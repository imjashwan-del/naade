import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/db";
import { adminLoginAttempts, adminUsers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { createAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

function getAttemptKey(req: NextRequest, email: string) {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = req.headers.get("x-real-ip")?.trim() || forwardedFor || "unknown";
  return createHash("sha256")
    .update(`${address}\0${email.toLowerCase()}`)
    .digest("hex");
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid email and password" },
      { status: 400 },
    );
  }

  const { email, password } = parsed.data;
  try {
    const attemptKey = getAttemptKey(req, email);
    const now = new Date();
    const windowExpiredAt = new Date(now.getTime() - LOGIN_WINDOW_MS);
    const [attempt] = await db
      .insert(adminLoginAttempts)
      .values({ key: attemptKey, attempts: 1, windowStarted: now })
      .onConflictDoUpdate({
        target: adminLoginAttempts.key,
        set: {
          attempts: sql`case when ${adminLoginAttempts.windowStarted} < ${windowExpiredAt} then 1 else ${adminLoginAttempts.attempts} + 1 end`,
          windowStarted: sql`case when ${adminLoginAttempts.windowStarted} < ${windowExpiredAt} then ${now} else ${adminLoginAttempts.windowStarted} end`,
        },
      })
      .returning();

    if (attempt.attempts > MAX_LOGIN_ATTEMPTS) {
      return NextResponse.json(
        { error: "Too many sign-in attempts. Try again in 15 minutes." },
        { status: 429, headers: { "Retry-After": "900" } },
      );
    }

    const rows = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email.toLowerCase()))
      .limit(1);
    const admin = rows[0];

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

  await db.delete(adminLoginAttempts).where(eq(adminLoginAttempts.key, attemptKey));
    await createAdminSession({ adminId: admin.id, email: admin.email });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin login failed:", error);
    return NextResponse.json(
      {
        error:
          "Admin login is temporarily unavailable. Check the database connection.",
      },
      { status: 503 },
    );
  }
}
