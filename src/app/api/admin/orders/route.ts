import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const showAll = searchParams.get("all") === "1";

  // Requirement: The confirmed Orders section must contain only orders whose payment has been manually verified (PAID)
  let orderRows: (typeof orders.$inferSelect)[];
  if (showAll) {
    orderRows = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
  } else {
    orderRows = await db
      .select()
      .from(orders)
      .where(eq(orders.paymentStatus, "PAID"))
      .orderBy(desc(orders.createdAt));
  }

  const itemRows = await db.select().from(orderItems);

  const grouped = orderRows.map((order) => ({
    ...order,
    items: itemRows.filter((item) => item.orderId === order.id),
  }));

  return NextResponse.json({ orders: grouped });
}
