import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { orderStatusValues, paymentStatusValues } from "@/lib/admin-validation";
import { sendOrderStatusEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const schema = z.object({
  orderStatus: z.enum(orderStatusValues).optional(),
  paymentStatus: z.enum(paymentStatusValues).optional(),
  trackingCarrier: z.string().trim().max(100).nullable().optional(),
  trackingNumber: z.string().trim().max(120).nullable().optional(),
  trackingUrl: z
    .union([z.string().url(), z.literal("")])
    .nullable()
    .optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.id, Number(id)))
    .limit(1);
  if (!rows[0])
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, Number(id)));
  return NextResponse.json({ order: { ...rows[0], items } });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success || Object.keys(parsed.data ?? {}).length === 0) {
    return NextResponse.json(
      { error: "Provide an order or tracking update" },
      { status: 400 },
    );
  }

  const update = {
    ...parsed.data,
    ...(parsed.data.trackingUrl === "" ? { trackingUrl: null } : {}),
    updatedAt: new Date(),
  };
  const [previousOrder] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, Number(id)))
    .limit(1);
  if (!previousOrder) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [order] = await db
    .update(orders)
    .set(update)
    .where(eq(orders.id, Number(id)))
    .returning();

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (parsed.data.orderStatus && parsed.data.orderStatus !== previousOrder.orderStatus) {
    try {
      await sendOrderStatusEmail(order);
    } catch (error) {
      console.error("Order status email failed:", error);
    }
  }
  return NextResponse.json({ order });
}
