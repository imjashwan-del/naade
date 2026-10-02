"use client";

import { startTransition, useEffect, useState, use } from "react";
import { formatDate, formatPrice } from "@/lib/format";
import type { Order, OrderItem } from "@/db/schema";
import { orderStatusValues, paymentStatusValues } from "@/lib/admin-validation";

type OrderWithItems = Order & { items: OrderItem[] };

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [saving, setSaving] = useState(false);
  const [tracking, setTracking] = useState({
    carrier: "",
    number: "",
    url: "",
  });
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    const res = await fetch(`/api/admin/orders/${id}`);
    const data = await res.json();
    startTransition(() => {
      setOrder(data.order ?? null);
      if (data.order) {
        setTracking({
          carrier: data.order.trackingCarrier ?? "",
          number: data.order.trackingNumber ?? "",
          url: data.order.trackingUrl ?? "",
        });
      }
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function updateStatus(
    field: "orderStatus" | "paymentStatus",
    value: string,
  ) {
    setSaving(true);
    setNotice(null);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    if (!res.ok)
      setNotice("Unable to update the order status. Please try again.");
    else await load();
    setSaving(false);
  }

  async function saveTracking(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trackingCarrier: tracking.carrier || null,
        trackingNumber: tracking.number || null,
        trackingUrl: tracking.url || null,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setNotice(data?.error || "Unable to save tracking details.");
    } else {
      setNotice("Tracking details saved.");
      await load();
    }
    setSaving(false);
  }

  if (!order) return <p className="text-sm text-black/50">Loading order…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif-display text-2xl">Order {order.orderNumber}</h1>
      <p className="mt-1 text-xs text-black/50">
        Placed {formatDate(order.createdAt)}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/50">
            Customer
          </p>
          <p className="mt-1 text-sm">{order.customerName}</p>
          <p className="text-sm text-black/60">{order.phone}</p>
          <p className="text-sm text-black/60">{order.email}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/50">
            Delivery Address
          </p>
          <p className="mt-1 text-sm text-black/70">
            {order.address}, {order.city}, {order.state} {order.pincode}
          </p>
        </div>
      </div>

      {notice ? (
        <p role="status" className="mt-5 text-sm text-[var(--color-maroon)]">
          {notice}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/50">
            Order Status
          </span>
          <select
            value={order.orderStatus}
            disabled={saving}
            onChange={(e) => updateStatus("orderStatus", e.target.value)}
            className="border border-black/20 px-3 py-2.5 text-sm"
          >
            {orderStatusValues.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/50">
            Payment Status
          </span>
          <select
            value={order.paymentStatus}
            disabled={saving}
            onChange={(e) => updateStatus("paymentStatus", e.target.value)}
            className="border border-black/20 px-3 py-2.5 text-sm"
          >
            {paymentStatusValues.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <form
        onSubmit={saveTracking}
        className="mt-8 border-t border-black/10 pt-6"
      >
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/50">
          Shipment tracking
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-xs text-black/60">
            Carrier
            <input
              value={tracking.carrier}
              onChange={(e) =>
                setTracking((value) => ({ ...value, carrier: e.target.value }))
              }
              className="border border-black/20 px-3 py-2.5 text-sm text-black"
              placeholder="Courier name"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-black/60">
            Tracking number
            <input
              value={tracking.number}
              onChange={(e) =>
                setTracking((value) => ({ ...value, number: e.target.value }))
              }
              className="border border-black/20 px-3 py-2.5 text-sm text-black"
              placeholder="Tracking ID"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-black/60">
            Tracking URL
            <input
              type="url"
              value={tracking.url}
              onChange={(e) =>
                setTracking((value) => ({ ...value, url: e.target.value }))
              }
              className="border border-black/20 px-3 py-2.5 text-sm text-black"
              placeholder="https://…"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-4 bg-black px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white disabled:opacity-50"
        >
          Save tracking
        </button>
      </form>

      <div className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/50">
          Products
        </p>
        <div className="mt-3 flex flex-col divide-y divide-black/10">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 text-sm">
              <div className="flex justify-between">
                <p className="font-medium">
                  {item.productName} &times; {item.quantity}
                </p>
                <p>{formatPrice(item.price * item.quantity)}</p>
              </div>
              <p className="mt-1 text-xs text-black/50">
                {item.isMadeToMeasure
                  ? "Made to Measure"
                  : item.size
                    ? `Size ${item.size}`
                    : "—"}
              </p>
              {item.isMadeToMeasure && item.measurements ? (
                <dl className="mt-2 grid grid-cols-3 gap-2 text-xs text-black/60">
                  {Object.entries(item.measurements).map(([key, value]) => (
                    <div key={key} className="flex gap-1">
                      <dt className="font-medium capitalize">{key}:</dt>
                      <dd>{value}&quot;</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-1 border-t border-black/10 pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
            </span>
          </div>
          <div className="flex justify-between text-base font-medium">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
