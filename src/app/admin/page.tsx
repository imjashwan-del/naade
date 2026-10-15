import Link from "next/link";
import { and, asc, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, paymentAttempts } from "@/db/schema";
import { formatDate, formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const fulfillmentStatuses = [
  "PENDING",
  "CONFIRMED",
  "IN PRODUCTION",
  "READY",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export default async function AdminIndexPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 6);

  const [
    orderSummaryRows,
    productSummaryRows,
    pendingPaymentsRows,
    recentOrders,
    weeklyOrders,
    statusRows,
    lowStockProducts,
  ] = await Promise.all([
    db
      .select({
        totalOrders: count(),
        paidOrders: sql<number>`count(*) filter (where ${orders.paymentStatus} = 'PAID')`,
        paidRevenue: sql<number>`coalesce(sum(case when ${orders.paymentStatus} = 'PAID' then ${orders.total} else 0 end), 0)`,
        openOrders: sql<number>`count(*) filter (where ${orders.orderStatus} in ('PENDING', 'CONFIRMED', 'IN PRODUCTION', 'READY'))`,
      })
      .from(orders),
    db
      .select({
        activeProducts: sql<number>`count(*) filter (where ${products.isActive})`,
        lowStock: sql<number>`count(*) filter (where ${products.isActive} and ${products.inventoryQuantity} <= 5)`,
      })
      .from(products),
    db
      .select({
        pendingCount: count(),
      })
      .from(paymentAttempts)
      .where(eq(paymentAttempts.status, "PENDING_VERIFICATION")),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(6),
    db
      .select({ createdAt: orders.createdAt, total: orders.total })
      .from(orders)
      .where(
        and(eq(orders.paymentStatus, "PAID"), gte(orders.createdAt, weekStart)),
      ),
    db
      .select({ status: orders.orderStatus, orders: count() })
      .from(orders)
      .groupBy(orders.orderStatus),
    db
      .select({
        id: products.id,
        name: products.name,
        inventoryQuantity: products.inventoryQuantity,
      })
      .from(products)
      .where(
        and(eq(products.isActive, true), lte(products.inventoryQuantity, 5)),
      )
      .orderBy(asc(products.inventoryQuantity))
      .limit(5),
  ]);

  const orderSummary = orderSummaryRows[0];
  const productSummary = productSummaryRows[0];
  const totalOrders = Number(orderSummary?.totalOrders ?? 0);
  const paidOrders = Number(orderSummary?.paidOrders ?? 0);
  const paidRevenue = Number(orderSummary?.paidRevenue ?? 0);
  const openOrders = Number(orderSummary?.openOrders ?? 0);
  const activeProducts = Number(productSummary?.activeProducts ?? 0);
  const lowStockCount = Number(productSummary?.lowStock ?? 0);
  const pendingPayments = Number(pendingPaymentsRows[0]?.pendingCount ?? 0);

  const dailySales = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return { date, key: dayKey(date), revenue: 0 };
  });
  for (const order of weeklyOrders) {
    const day = dailySales.find((item) => item.key === dayKey(order.createdAt));
    if (day) day.revenue += order.total;
  }
  const maxDailySales = Math.max(...dailySales.map((day) => day.revenue));
  const statusCounts = new Map(
    statusRows.map((row) => [row.status, Number(row.orders)]),
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-maroon)]">
            Store overview
          </p>
          <h1 className="mt-2 font-serif-display text-3xl text-[var(--color-charcoal)]">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-[var(--color-charcoal)]/60">
            Sales, fulfilment, and inventory at a glance.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/pending-payments"
            className="bg-amber-800 text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] hover:bg-amber-900 transition-colors"
          >
            Pending Payments ({pendingPayments})
          </Link>
          <Link
            href="/admin/orders"
            className="border border-[var(--color-charcoal)]/25 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em]"
          >
            Confirmed orders
          </Link>
          <Link
            href="/admin/products/new"
            className="bg-[var(--color-charcoal)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white"
          >
            Add product
          </Link>
        </div>
      </header>

      {pendingPayments > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-sm border border-amber-900/20 bg-amber-50 p-5 text-amber-950">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-900">
                Action Required: {pendingPayments} Payment {pendingPayments === 1 ? "Attempt" : "Attempts"} Awaiting Verification
              </p>
            </div>
            <p className="mt-1 text-xs text-amber-900/80">
              Customers have initiated direct UPI checkout or reported transaction references. Verify your bank statement and confirm fulfillment.
            </p>
          </div>
          <Link
            href="/admin/pending-payments"
            className="w-fit bg-amber-900 text-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] rounded-xs hover:bg-black transition-colors"
          >
            Review Queue →
          </Link>
        </div>
      )}

      <section
        aria-label="Store metrics"
        className="grid grid-cols-2 border-y border-[var(--color-line)] lg:grid-cols-4"
      >
        {[
          {
            label: "Paid revenue",
            value: formatPrice(paidRevenue),
            note: `From ${paidOrders} paid orders`,
          },
          {
            label: "All orders",
            value: totalOrders.toLocaleString("en-IN"),
            note: `${openOrders} need fulfilment`,
          },
          {
            label: "Average order",
            value: formatPrice(
              paidOrders ? Math.round(paidRevenue / paidOrders) : 0,
            ),
            note: "Paid orders only",
          },
          {
            label: "Active products",
            value: activeProducts.toLocaleString("en-IN"),
            note: `${lowStockCount} low on stock`,
          },
        ].map((metric, index) => (
          <article
            key={metric.label}
            className={`px-4 py-5 sm:px-6 ${index < 2 ? "border-b border-[var(--color-line)] lg:border-b-0" : ""} ${index % 2 === 0 ? "border-r border-[var(--color-line)] lg:border-r-0" : ""} ${index < 3 ? "lg:border-r lg:border-[var(--color-line)]" : ""}`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-charcoal)]/55">
              {metric.label}
            </p>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-[var(--color-charcoal)]">
              {metric.value}
            </p>
            <p className="mt-1 text-xs text-[var(--color-charcoal)]/50">
              {metric.note}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="border border-[var(--color-line)] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em]">
                Paid sales
              </h2>
              <p className="mt-1 text-xs text-[var(--color-charcoal)]/55">
                Last 7 days
              </p>
            </div>
            <p className="text-sm font-semibold tabular-nums">
              {formatPrice(
                dailySales.reduce((sum, day) => sum + day.revenue, 0),
              )}
            </p>
          </div>
          <div
            role="img"
            aria-label="Paid sales for the last seven days"
            className="mt-6 grid h-44 grid-cols-7 items-end gap-2 border-b border-[var(--color-line)] sm:gap-4"
          >
            {dailySales.map((day) => {
              const height = maxDailySales
                ? Math.max(6, (day.revenue / maxDailySales) * 100)
                : 6;
              return (
                <div
                  key={day.key}
                  className="flex h-full flex-col items-center justify-end gap-2"
                >
                  <div
                    title={`${day.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}: ${formatPrice(day.revenue)}`}
                    className="w-full max-w-10 bg-[var(--color-maroon)]/80 transition-colors hover:bg-[var(--color-maroon)]"
                    style={{ height: `${height}%` }}
                  />
                  <span className="pb-2 text-[10px] text-[var(--color-charcoal)]/55">
                    {day.date.toLocaleDateString("en-IN", { day: "numeric" })}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.08em] text-[var(--color-charcoal)]/45">
            <span>
              {weekStart.toLocaleDateString("en-IN", { month: "short" })}
            </span>
            <span>Today</span>
          </div>
        </div>

        <div className="border border-[var(--color-line)] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em]">
                Order pipeline
              </h2>
              <p className="mt-1 text-xs text-[var(--color-charcoal)]/55">
                By fulfilment status
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold uppercase tracking-[0.08em] underline underline-offset-4"
            >
              Manage
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {fulfillmentStatuses.map((status) => {
              const value = statusCounts.get(status) ?? 0;
              const width = totalOrders ? (value / totalOrders) * 100 : 0;
              return (
                <div key={status}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-[var(--color-charcoal)]/70">
                      {status}
                    </span>
                    <span className="tabular-nums text-[var(--color-charcoal)]">
                      {value}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[var(--color-offwhite)]">
                    <div
                      className="h-full bg-[var(--color-indigo)]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em]">
              Recent orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold uppercase tracking-[0.08em] underline underline-offset-4"
            >
              All orders
            </Link>
          </div>
          {recentOrders.length ? (
            <div className="overflow-x-auto border-y border-[var(--color-line)]">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-[10px] uppercase tracking-[0.08em] text-[var(--color-charcoal)]/50">
                  <tr>
                    <th className="py-3 font-medium">Order</th>
                    <th className="py-3 font-medium">Customer</th>
                    <th className="py-3 font-medium">Status</th>
                    <th className="py-3 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-[var(--color-line)]/70"
                    >
                      <td className="py-3 pr-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-medium underline-offset-4 hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                        <p className="mt-0.5 text-[11px] text-[var(--color-charcoal)]/50">
                          {formatDate(order.createdAt)}
                        </p>
                      </td>
                      <td className="py-3 pr-3">{order.customerName}</td>
                      <td className="py-3 pr-3 text-xs">{order.orderStatus}</td>
                      <td className="py-3 text-right tabular-nums">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="border-y border-[var(--color-line)] py-8 text-sm text-[var(--color-charcoal)]/55">
              No orders have been placed yet.
            </p>
          )}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em]">
              Low stock
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-semibold uppercase tracking-[0.08em] underline underline-offset-4"
            >
              Products
            </Link>
          </div>
          {lowStockProducts.length ? (
            <ul className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
              {lowStockProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {product.name}
                  </Link>
                  <span className="shrink-0 text-xs tabular-nums text-[var(--color-maroon)]">
                    {product.inventoryQuantity} left
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="border-y border-[var(--color-line)] py-8 text-sm text-[var(--color-charcoal)]/55">
              No active products need a stock check.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
