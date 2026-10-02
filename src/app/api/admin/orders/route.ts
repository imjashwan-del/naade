import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const orderRows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  const itemRows = await db.select().from(orderItems);

  const grouped = orderRows.map((order) => ({
    ...order,
    items: itemRows.filter((item) => item.orderId === order.id),
  }));

  return NextResponse.json({ orders: grouped });
}
