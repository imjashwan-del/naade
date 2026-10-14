import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { paymentAttempts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { submitUpiReferenceSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = submitUpiReferenceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid reference submission",
        details: parsed.error.issues.map((i) => i.message),
      },
      { status: 400 },
    );
  }

  const { orderReference, customerUpiReference, customerNote } = parsed.data;

  const [attempt] = await db
    .select()
    .from(paymentAttempts)
    .where(eq(paymentAttempts.orderReference, orderReference))
    .limit(1);

  if (!attempt) {
    return NextResponse.json(
      { error: "Order reference not found" },
      { status: 404 },
    );
  }

  if (attempt.status !== "PENDING_VERIFICATION") {
    return NextResponse.json(
      {
        error: `This payment attempt is currently ${attempt.status} and cannot be updated.`,
      },
      { status: 400 },
    );
  }

  // Update customer reference without modifying verification status.
  // CRITICAL: Submitting a reference does NOT mark the order as paid.
  await db
    .update(paymentAttempts)
    .set({
      customerUpiReference,
      customerNote: customerNote || attempt.customerNote,
      updatedAt: new Date(),
    })
    .where(eq(paymentAttempts.id, attempt.id));

  return NextResponse.json({
    success: true,
    message:
      "UPI reference saved. Our atelier will verify your transaction against the receiving bank statement before confirming your order.",
    customerUpiReference,
  });
}
