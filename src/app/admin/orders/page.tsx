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
    <div>
      <h1 className="font-serif-display text-2xl">Orders</h1>

      {loading ? (
        <p className="mt-8 text-sm text-black/50">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-sm text-black/50">No orders yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left text-[11px] uppercase tracking-[0.08em] text-black/50">
                <th className="py-3">Order</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Products</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Payment</th>
                <th className="py-3">Status</th>
                <th className="py-3">Date</th>
                <th className="py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-black/5 align-top">
                  <td className="py-3 pr-4 font-medium">{order.orderNumber}</td>
                  <td className="py-3 pr-4">
                    <p>{order.customerName}</p>
                    <p className="text-xs text-black/50">{order.phone}</p>
                    <p className="text-xs text-black/50">{order.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-xs text-black/70">
                    {order.items.map((item) => (
                      <div key={item.id}>
                        {item.productName} &times; {item.quantity}
                        {item.isMadeToMeasure ? " (MTM)" : item.size ? ` (${item.size})` : ""}
                      </div>
                    ))}
                  </td>
                  <td className="py-3 pr-4">{formatPrice(order.total)}</td>
                  <td className="py-3 pr-4">{order.paymentStatus}</td>
                  <td className="py-3 pr-4">{order.orderStatus}</td>
                  <td className="py-3 pr-4 text-xs text-black/60">{formatDate(order.createdAt)}</td>
                  <td className="py-3 text-right">
                    <Link href={`/admin/orders/${order.id}`} className="text-xs font-semibold uppercase text-black/70 underline">
                      Manage
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
