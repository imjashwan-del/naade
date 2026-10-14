"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/format";
import type { Order, OrderItem } from "@/db/schema";

type OrderWithItems = Order & { items: OrderItem[] };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-maroon)]">
            Store Orders
          </p>
          <h1 className="font-serif-display text-2xl text-[var(--color-charcoal)]">
            Confirmed Orders
          </h1>
          <p className="mt-1 text-xs text-[var(--color-charcoal)]/60">
            This section contains only orders whose payment has been manually verified (PAID).
          </p>
        </div>
        <Link
          href="/admin/pending-payments"
          className="w-fit bg-amber-800 text-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] hover:bg-amber-900 transition-colors"
        >
          Inspect Pending Payments →
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--color-line)] pb-3 text-xs font-semibold uppercase tracking-[0.1em]">
        <Link
          href="/admin/orders"
          className="bg-[var(--color-charcoal)] text-[var(--color-ivory)] px-3 py-1.5"
        >
          Confirmed Orders ({orders.length})
        </Link>
        <Link
          href="/admin/pending-payments"
          className="text-[var(--color-charcoal)]/60 hover:text-[var(--color-charcoal)] px-3 py-1.5 transition-colors"
        >
          Pending Payments
        </Link>
        <Link
          href="/admin/pending-payments?status=cancelled_expired"
          className="text-[var(--color-charcoal)]/60 hover:text-[var(--color-charcoal)] px-3 py-1.5 transition-colors"
        >
          Cancelled / Expired
        </Link>
      </div>

      {loading ? (
        <p className="py-8 text-sm text-[var(--color-charcoal)]/50">Loading confirmed orders…</p>
      ) : orders.length === 0 ? (
        <div className="border border-dashed border-[var(--color-line)] py-12 text-center text-sm text-[var(--color-charcoal)]/60">
          No confirmed orders yet. All unverified payments appear under{" "}
          <Link href="/admin/pending-payments" className="font-semibold underline">
            Pending Payments
          </Link>
          .
        </div>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-[var(--color-line)] bg-white">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--color-line)] bg-[var(--color-offwhite)]/50 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-charcoal)]/60">
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Items &amp; Measurements</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4">Payment Verification</th>
                <th className="py-3.5 px-4">Fulfilment</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[var(--color-line)] align-top hover:bg-black/[0.01]">
                  {/* Order Reference */}
                  <td className="py-4 px-4 font-mono font-medium text-xs text-[var(--color-charcoal)]">
                    {order.orderNumber}
                  </td>

                  {/* Customer Details */}
                  <td className="py-4 px-4 text-xs text-[var(--color-charcoal)]">
                    <p className="font-semibold text-sm">{order.customerName}</p>
                    <p className="text-[var(--color-charcoal)]/70">{order.phone}</p>
                    <p className="text-[var(--color-charcoal)]/60">{order.email}</p>
                    <p className="mt-1 text-[11px] text-[var(--color-charcoal)]/65 leading-tight">
                      {order.address}, {order.city}, {order.state} - {order.pincode}
                    </p>
                  </td>

                  {/* Items */}
                  <td className="py-4 px-4 text-xs text-[var(--color-charcoal)]/80">
                    <div className="space-y-1 max-w-[220px]">
                      {order.items.map((item) => (
                        <div key={item.id} className="border-b border-black/5 pb-1 last:border-0">
                          <p className="font-medium text-[var(--color-charcoal)]">
                            {item.productName} &times; {item.quantity}
                          </p>
                          <p className="text-[11px] text-[var(--color-charcoal)]/60">
                            {item.isMadeToMeasure
                              ? "Made to Measure (MTM)"
                              : item.size
                                ? `Size: ${item.size}`
                                : "Standard"}
                          </p>
                          {item.isMadeToMeasure && item.measurements && (
                            <div className="text-[10px] text-[var(--color-charcoal)]/60">
                              {Object.entries(item.measurements)
                                .map(([k, v]) => `${k}: ${v}"`)
                                .join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 whitespace-nowrap font-semibold text-sm text-[var(--color-charcoal)]">
                    {formatPrice(order.total)}
                  </td>

                  {/* Payment Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-block rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-900 border border-emerald-200">
                      PAID
                    </span>
                  </td>

                  {/* Payment Verification Info */}
                  <td className="py-4 px-4 text-xs text-[var(--color-charcoal)]/70 whitespace-nowrap">
                    <p className="font-medium text-[11px] text-[var(--color-charcoal)]">
                      {order.verifiedAt ? formatDate(order.verifiedAt) : formatDate(order.createdAt)}
                    </p>
                    {order.verifiedTransactionReference && (
                      <p className="font-mono text-[10px] text-emerald-800 mt-0.5">
                        Ref: {order.verifiedTransactionReference}
                      </p>
                    )}
                    {order.verifiedByAdminEmail && (
                      <p className="text-[10px] text-[var(--color-charcoal)]/50 mt-0.5">
                        By: {order.verifiedByAdminEmail}
                      </p>
                    )}
                  </td>

                  {/* Fulfilment Status */}
                  <td className="py-4 px-4 text-xs whitespace-nowrap">
                    <span className="inline-block rounded bg-black/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-charcoal)]">
                      {order.orderStatus}
                    </span>
                    {order.trackingNumber && (
                      <p className="mt-1 font-mono text-[10px] text-[var(--color-charcoal)]/60">
                        {order.trackingCarrier ? `${order.trackingCarrier}: ` : ""}
                        {order.trackingNumber}
                      </p>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-charcoal)] underline hover:text-[var(--color-maroon)]"
                    >
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
