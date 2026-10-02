import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

const verifySchema = z.object({
  orderNumber: z.string(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid verification payload" },
      { status: 400 },
    );
  }

  const { orderNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    parsed.data;

  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  const order = rows[0];
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.razorpayOrderId !== razorpayOrderId) {
    return NextResponse.json(
      { error: "Payment does not match this order" },
      { status: 400 },
    );
  }

  const isValid = verifyRazorpaySignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });

  if (!isValid) {
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 400 },
    );
  }

  if (order.paymentStatus === "PAID") {
    if (order.razorpayPaymentId === razorpayPaymentId) {
      return NextResponse.json({ success: true, orderNumber });
    }
    return NextResponse.json(
      { error: "Order has already been paid" },
      { status: 409 },
    );
  }

  if (order.paymentStatus !== "PENDING") {
    return NextResponse.json(
      { error: "Order is not awaiting payment" },
      { status: 409 },
    );
  }

  const updated = await db.transaction(async (tx) => {
    const [paidOrder] = await tx
      .update(orders)
      .set({
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
        razorpayPaymentId,
        razorpaySignature,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(orders.id, order.id),
          eq(orders.razorpayOrderId, razorpayOrderId),
          eq(orders.paymentStatus, "PENDING"),
        ),
      )
      .returning();

    if (!paidOrder) return false;

    const items = await tx
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));
    for (const item of items) {
      if (item.productId) {
        await tx
          .update(products)
          .set({
            inventoryQuantity: sql`greatest(${products.inventoryQuantity} - ${item.quantity}, 0)`,
          })
          .where(eq(products.id, item.productId));
      }
    }
    return true;
  });

  if (!updated) {
    const [latestOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, order.id))
      .limit(1);
    if (
      latestOrder?.paymentStatus === "PAID" &&
      latestOrder.razorpayPaymentId === razorpayPaymentId
    ) {
      return NextResponse.json({ success: true, orderNumber });
    }
    return NextResponse.json(
      { error: "Order is not awaiting payment" },
      { status: 409 },
    );
  }

  return NextResponse.json({ success: true, orderNumber });
}
