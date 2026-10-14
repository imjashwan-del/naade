import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { paymentAttempts } from "@/db/schema";
import { desc, eq, or } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status") || "pending";

  const allAttempts = await db
    .select()
    .from(paymentAttempts)
    .orderBy(desc(paymentAttempts.createdAt));

  const now = new Date();

  // Categorize
  const pendingAttempts = allAttempts.filter(
    (a) =>
      a.status === "PENDING_VERIFICATION" && new Date(a.expiresAt) >= now,
  );

  const verifiedAttempts = allAttempts.filter(
    (a) => a.status === "MANUALLY_VERIFIED",
  );

  const cancelledOrExpiredAttempts = allAttempts.filter(
    (a) =>
      a.status === "REJECTED" ||
      a.status === "CANCELLED" ||
      a.status === "EXPIRED" ||
      (a.status === "PENDING_VERIFICATION" && new Date(a.expiresAt) < now),
  );

  let filtered = pendingAttempts;
  if (statusFilter === "verified") {
    filtered = verifiedAttempts;
  } else if (statusFilter === "cancelled_expired") {
    filtered = cancelledOrExpiredAttempts;
  } else if (statusFilter === "all") {
    filtered = allAttempts;
  }

  return NextResponse.json({
    counts: {
      pending: pendingAttempts.length,
      verified: verifiedAttempts.length,
      cancelledExpired: cancelledOrExpiredAttempts.length,
      total: allAttempts.length,
    },
    attempts: filtered,
  });
}
