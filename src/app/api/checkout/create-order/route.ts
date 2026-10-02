import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { createOrderSchema } from "@/lib/validation";
import { getRazorpayClient, isRazorpayConfigured } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `NAADE-${stamp}-${random}`;
}

const SHIPPING_THRESHOLD = 5000;
const SHIPPING_FEE = 199;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid order details", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      {
        error:
          "Online payment is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local to accept prepaid orders.",
      },
      { status: 503 },
    );
  }

  const { customer, items } = parsed.data;

  const productIds = [...new Set(items.map((item) => item.productId))];
  const productRows = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));
  const productsById = new Map(
    productRows.map((product) => [product.id, product]),
  );
  const quantitiesByProduct = new Map<number, number>();

  for (const item of items) {
    const product = productsById.get(item.productId);
    if (!product || !product.isActive) {
      return NextResponse.json(
        {
          error:
            "A product in your bag is no longer available. Refresh your bag and try again.",
        },
        { status: 409 },
      );
    }
    quantitiesByProduct.set(
      item.productId,
      (quantitiesByProduct.get(item.productId) ?? 0) + item.quantity,
    );
  }

  for (const [productId, quantity] of quantitiesByProduct) {
    const product = productsById.get(productId)!;
    if (quantity > product.inventoryQuantity) {
      return NextResponse.json(
        {
          error: `${product.name} does not have enough stock for this quantity.`,
        },
        { status: 409 },
      );
    }
  }

  const resolvedItems = items.map((item) => {
    const product = productsById.get(item.productId)!;
    return {
      ...item,
      name: product.name,
      category: product.category,
      price: product.price,
      imageUrl: product.mainImageUrl,
    };
  });

  const subtotal = resolvedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping =
    subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const totalInPaise = total * 100;

  if (totalInPaise < 100) {
    return NextResponse.json(
      { error: "Minimum order amount must be at least ₹1.00" },
      { status: 400 },
    );
  }

  const orderNumber = generateOrderNumber();

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      customerName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      subtotal,
      shipping,
      total,
      paymentStatus: "PENDING",
      orderStatus: "PENDING",
    })
    .returning();

  await db.insert(orderItems).values(
    resolvedItems.map((item) => ({
      orderId: order.id,
      productId: item.productId > 0 ? item.productId : null,
      productName: item.name,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      isMadeToMeasure: item.isMadeToMeasure,
      measurements: item.measurements,
      imageUrl: item.imageUrl,
    })),
  );

  try {
    const razorpay = getRazorpayClient();
    const razorpayOrder = await razorpay.orders.create({
      amount: totalInPaise,
      currency: "INR",
      receipt: order.orderNumber,
    });

    await db
      .update(orders)
      .set({ razorpayOrderId: razorpayOrder.id, updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    return NextResponse.json({
      configured: true,
      orderNumber: order.orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId:
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    const status =
      error && typeof error === "object" && "statusCode" in error
        ? Number((error as { statusCode?: number }).statusCode)
        : 0;

    if (status === 401) {
      return NextResponse.json(
        { error: "Razorpay authentication failed." },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Unable to initiate payment with Razorpay right now." },
      { status: 502 },
    );
  }
}
