import { notFound } from "next/navigation";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice, formatDate } from "@/lib/format";
import { LinkButton } from "@/components/Button";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  const orderRows = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  const order = orderRows[0];
  if (!order) notFound();

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  const isPaid = order.paymentStatus === "PAID";

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-10">
      <div className="text-center">
        <p className="ikat-diamonds justify-center text-[var(--color-maroon)]">
          <span />
          <span />
          <span />
        </p>
        <h1 className="mt-5 font-serif-display text-3xl text-[var(--color-charcoal)] sm:text-4xl">
          {isPaid ? "Order Confirmed" : "Order Received"}
        </h1>
        <p className="mt-3 text-sm text-[var(--color-charcoal)]/65">
          {isPaid
            ? "Thank you for choosing NAADE."
            : "Thank you for your order. Payment is still pending."}
        </p>
      </div>

      {!isPaid ? (
        <div className="mt-8 border border-[var(--color-maroon)]/30 bg-[var(--color-maroon)]/5 p-4 text-sm text-[var(--color-maroon)]">
          {order.paymentStatus === "FAILED"
            ? "Payment could not be verified. Please contact us to complete your order."
            : "Payment configuration is pending on our end, so this order has not been charged yet. Our team will reach out to arrange payment."}
        </div>
      ) : null}

      <div className="mt-10 grid gap-6 border-y border-[var(--color-line)] py-8 sm:grid-cols-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)]/50">
            Order Number
          </p>
          <p className="mt-1 text-sm text-[var(--color-charcoal)]">
            {order.orderNumber}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)]/50">
            Payment Status
          </p>
          <p className="mt-1 text-sm text-[var(--color-charcoal)]">
            {order.paymentStatus}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)]/50">
            Order Date
          </p>
          <p className="mt-1 text-sm text-[var(--color-charcoal)]">
            {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)]/50">
          Products
        </p>
        <div className="mt-4 flex flex-col divide-y divide-[var(--color-line)]">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-4 py-4 text-sm"
            >
              <div>
                <p className="font-medium text-[var(--color-charcoal)]">
                  {item.productName} &times; {item.quantity}
                </p>
                <p className="mt-1 text-xs text-[var(--color-charcoal)]/55">
                  {item.isMadeToMeasure
                    ? "Made to Measure"
                    : item.size
                      ? `Size ${item.size}`
                      : ""}
                </p>
              </div>
              <p className="whitespace-nowrap text-[var(--color-charcoal)]">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-[var(--color-line)] pt-4 text-base font-medium text-[var(--color-charcoal)]">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-8 border-t border-[var(--color-line)] pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)]/50">
          Delivery Details
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-charcoal)]">
          {order.customerName}
          <br />
          {order.address}, {order.city}, {order.state} {order.pincode}
          <br />
          {order.phone} &middot; {order.email}
        </p>
      </div>

      {order.trackingNumber || order.trackingUrl ? (
        <div className="mt-8 border-t border-[var(--color-line)] pt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)]/50">
            Shipment tracking
          </p>
          <p className="mt-2 text-sm text-[var(--color-charcoal)]">
            {[order.trackingCarrier, order.trackingNumber]
              .filter(Boolean)
              .join(" · ") || "Tracking available"}
          </p>
          {order.trackingUrl ? (
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm underline underline-offset-4"
            >
              Track shipment
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="mt-10 flex justify-center">
        <LinkButton href="/shop">Continue Shopping</LinkButton>
      </div>
    </main>
  );
}
