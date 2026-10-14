import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  paymentAttempts,
  orders,
  orderItems,
  paymentVerificationAuditLogs,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";
import { adminVerifyPaymentSchema } from "@/lib/validation";

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
  const parsed = adminVerifyPaymentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation error",
        details: parsed.error.issues.map((i) => i.message),
      },
      { status: 400 },
    );
  }

  const { verifiedTransactionReference, notes } = parsed.data;

  // 1. Fetch payment attempt
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

  // 2. Prevent duplicate or invalid verification
  if (attempt.status !== "PENDING_VERIFICATION") {
    return NextResponse.json(
      {
        error: `Cannot verify payment: current status is ${attempt.status}. Duplicate verification prevented.`,
      },
      { status: 409 },
    );
  }

  // 3. Double-check no existing order exists with this order reference
  const [existingOrder] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, attempt.orderReference))
    .limit(1);

  if (existingOrder) {
    return NextResponse.json(
      {
        error: "A confirmed order already exists for this order reference.",
      },
      { status: 409 },
    );
  }

  const verifiedAt = new Date();

  // 4. Create confirmed order with payment status PAID
  let createdOrder: typeof orders.$inferSelect;
  try {
    const [insertedOrder] = await db
      .insert(orders)
      .values({
        orderNumber: attempt.orderReference,
        customerName: attempt.customerName,
        email: attempt.email,
        phone: attempt.phone,
        address: attempt.address,
        city: attempt.city,
        state: attempt.state,
        pincode: attempt.pincode,
        subtotal: attempt.subtotal,
        shipping: attempt.shipping,
        total: attempt.total,
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
        paymentAttemptId: attempt.id,
        verifiedTransactionReference,
        verifiedAt,
        verifiedByAdminEmail: session.email,
      })
      .returning();

    createdOrder = insertedOrder;

    // 5. Insert order items
    if (attempt.items && attempt.items.length > 0) {
      await db.insert(orderItems).values(
        attempt.items.map((item) => ({
          orderId: createdOrder.id,
          productId: item.productId > 0 ? item.productId : null,
          productName: item.productName,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          size: item.size ?? null,
          isMadeToMeasure: item.isMadeToMeasure,
          measurements: item.measurements ?? null,
          imageUrl: item.imageUrl ?? "",
        })),
      );
    }

    // 6. Update payment attempt status to MANUALLY_VERIFIED
    await db
      .update(paymentAttempts)
      .set({
        status: "MANUALLY_VERIFIED",
        verifiedTransactionReference,
        verifiedAt,
        verifiedByAdminId: session.adminId,
        verifiedByAdminEmail: session.email,
        orderId: createdOrder.id,
        updatedAt: verifiedAt,
      })
      .where(eq(paymentAttempts.id, attempt.id));

    // 7. Record immutable audit log
    await db.insert(paymentVerificationAuditLogs).values({
      paymentAttemptId: attempt.id,
      orderReference: attempt.orderReference,
      adminId: session.adminId,
      adminEmail: session.email,
      action: "VERIFIED_AND_CONFIRMED",
      verifiedTransactionReference,
      amount: attempt.total,
      notes: notes || null,
      ipAddress: req.headers.get("x-forwarded-for") || null,
    });
  } catch (err) {
    console.error("Payment verification and order promotion failed:", err);
    return NextResponse.json(
      { error: "Failed to confirm payment and create order." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Payment successfully verified and order confirmed.",
    order: {
      id: createdOrder.id,
      orderNumber: createdOrder.orderNumber,
      total: createdOrder.total,
      customerName: createdOrder.customerName,
      paymentStatus: createdOrder.paymentStatus,
      verifiedAt,
      verifiedTransactionReference,
    },
  });
}
