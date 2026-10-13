import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { verifyPhonePePayment } from "@/lib/phonepe";

export const dynamic = "force-dynamic";

/**
 * GET /api/checkout/verify?orderNumber=NAADE-XXXX
 *
 * PhonePe redirects the user here after payment (success or failure).
 * We verify the payment status server-side using the PhonePe Status API
 * and then redirect the user to the appropriate confirmation or failure page.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber");

  if (!orderNumber) {
    return NextResponse.redirect(
      new URL("/checkout?error=missing_order", req.url),
    );
  }

  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  const order = rows[0];

  if (!order) {
    return NextResponse.redirect(
      new URL("/checkout?error=order_not_found", req.url),
    );
  }

  // Already confirmed — idempotent redirect
  if (order.paymentStatus === "PAID") {
    return NextResponse.redirect(
      new URL(`/order-confirmation/${orderNumber}`, req.url),
    );
  }

  // Verify payment status with PhonePe server-side
  try {
    const statusResponse = await verifyPhonePePayment(order.orderNumber);

    // V2: state is top-level — "COMPLETED" | "PENDING" | "FAILED" | "CANCELLED"
    if (statusResponse.state !== "COMPLETED") {
      return NextResponse.redirect(
        new URL(`/checkout?error=payment_failed&order=${orderNumber}`, req.url),
      );
    }

    const phonePeTransactionId =
      statusResponse.paymentDetails?.[0]?.transactionId ??
      statusResponse.orderId ??
      order.orderNumber;

    // Mark order as paid in a transaction and decrement inventory
    const updated = await db.transaction(async (tx) => {
      const [paidOrder] = await tx
        .update(orders)
        .set({
          paymentStatus: "PAID",
          orderStatus: "CONFIRMED",
          phonePeTransactionId,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(orders.id, order.id),
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
      // Race condition — another request already updated it
      return NextResponse.redirect(
        new URL(`/order-confirmation/${orderNumber}`, req.url),
      );
    }

    return NextResponse.redirect(
      new URL(`/order-confirmation/${orderNumber}`, req.url),
    );
  } catch (error) {
    console.error("PhonePe verification error:", error);
    return NextResponse.redirect(
      new URL(`/checkout?error=verification_error&order=${orderNumber}`, req.url),
    );
  }
}
