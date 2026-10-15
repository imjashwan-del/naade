import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { paymentAttempts, orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUpiConfig, buildUpiPaymentUri } from "@/lib/upi-config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref")?.trim();

  if (!ref) {
    return NextResponse.json(
      { error: "Order reference is required" },
      { status: 400 },
    );
  }

  // 1. Check payment attempts table
  const [attempt] = await db
    .select()
    .from(paymentAttempts)
    .where(eq(paymentAttempts.orderReference, ref))
    .limit(1);

  if (attempt) {
    const isExpired =
      attempt.status === "PENDING_VERIFICATION" &&
      new Date(attempt.expiresAt) < new Date();

    const effectiveStatus = isExpired ? "EXPIRED" : attempt.status;

    const upiConfig = await getUpiConfig();
    let upiIntentUrl: string | null = null;
    let appIntents: {
      generic: string;
      phonePe: string;
      googlePay: string;
      paytm: string;
    } | null = null;

    if (upiConfig.isConfigured && effectiveStatus === "PENDING_VERIFICATION") {
      upiIntentUrl = buildUpiPaymentUri({
        upiId: upiConfig.upiId,
        payeeName: upiConfig.payeeName,
        amount: attempt.total,
        orderReference: attempt.orderReference,
      });
      appIntents = {
        generic: upiIntentUrl,
        phonePe: `phonepe://pay?${upiIntentUrl.replace(/^upi:\/\/pay\?/, "")}`,
        googlePay: `tez://upi/pay?${upiIntentUrl.replace(/^upi:\/\/pay\?/, "")}`,
        paytm: `paytmmp://pay?${upiIntentUrl.replace(/^upi:\/\/pay\?/, "")}`,
      };
    }

    return NextResponse.json({
      success: true,
      orderReference: attempt.orderReference,
      status: effectiveStatus,
      amount: attempt.total,
      subtotal: attempt.subtotal,
      shipping: attempt.shipping,
      currency: attempt.currency,
      customerName: attempt.customerName,
      phone: attempt.phone,
      address: attempt.address,
      city: attempt.city,
      state: attempt.state,
      pincode: attempt.pincode,
      items: attempt.items,
      customerUpiReference: attempt.customerUpiReference || null,
      verifiedTransactionReference: attempt.verifiedTransactionReference || null,
      verifiedAt: attempt.verifiedAt || null,
      createdAt: attempt.createdAt,
      expiresAt: attempt.expiresAt,
      isConfigured: upiConfig.isConfigured,
      upiId: upiConfig.upiId || "8555909550@ybl",
      payeeName: upiConfig.payeeName,
      upiIntentUrl,
      appIntents,
    });
  }

  // 2. Fallback check confirmed orders
  const [confirmedOrder] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, ref))
    .limit(1);

  if (confirmedOrder) {
    return NextResponse.json({
      success: true,
      orderReference: confirmedOrder.orderNumber,
      status: "MANUALLY_VERIFIED",
      amount: confirmedOrder.total,
      subtotal: confirmedOrder.subtotal,
      shipping: confirmedOrder.shipping,
      currency: "INR",
      customerName: confirmedOrder.customerName,
      phone: confirmedOrder.phone,
      address: confirmedOrder.address,
      city: confirmedOrder.city,
      state: confirmedOrder.state,
      pincode: confirmedOrder.pincode,
      items: [],
      verifiedTransactionReference: confirmedOrder.verifiedTransactionReference,
      verifiedAt: confirmedOrder.verifiedAt || confirmedOrder.createdAt,
      createdAt: confirmedOrder.createdAt,
    });
  }

  return NextResponse.json(
    { error: "Payment attempt not found" },
    { status: 404 },
  );
}
