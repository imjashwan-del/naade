import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { paymentAttempts, paymentVerificationAuditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";
import { adminRejectPaymentSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ref: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ref } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = adminRejectPaymentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation error",
        details: parsed.error.issues.map((i) => i.message),
      },
      { status: 400 },
    );
  }

  const { reason } = parsed.data;

  const [attempt] = await db
    .select()
    .from(paymentAttempts)
    .where(eq(paymentAttempts.orderReference, ref))
    .limit(1);

  if (!attempt) {
    return NextResponse.json(
      { error: "Payment attempt not found" },
      { status: 404 },
    );
  }

  if (attempt.status !== "PENDING_VERIFICATION") {
    return NextResponse.json(
      {
        error: `Cannot reject payment: current status is ${attempt.status}.`,
      },
      { status: 409 },
    );
  }

  await db
    .update(paymentAttempts)
    .set({
      status: "REJECTED",
      rejectionReason: reason,
      updatedAt: new Date(),
    })
    .where(eq(paymentAttempts.id, attempt.id));

  await db.insert(paymentVerificationAuditLogs).values({
    paymentAttemptId: attempt.id,
    orderReference: attempt.orderReference,
    adminId: session.adminId,
    adminEmail: session.email,
    action: "REJECTED",
    amount: attempt.total,
    notes: reason,
    ipAddress: req.headers.get("x-forwarded-for") || null,
  });

  return NextResponse.json({
    success: true,
    message: "Payment attempt rejected.",
  });
}
