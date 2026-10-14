import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { paymentAttempts, products, type PaymentAttemptItem } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { createOrderSchema } from "@/lib/validation";
import { FALLBACK_PRODUCTS } from "@/lib/fallback-products";
import { getUpiConfig, buildUpiPaymentUri } from "@/lib/upi-config";

export const dynamic = "force-dynamic";

function generateOrderReference() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `NAADE-${stamp}-${random}`;
}

const SHIPPING_THRESHOLD = 5000;
const SHIPPING_FEE = 199;
const EXPIRATION_HOURS = 24;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid order details",
        issues: parsed.error.flatten(),
        details: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const { customer, items } = parsed.data;

  // 1. Fetch products from database (with fallback for local seed)
  const productIds = [...new Set(items.map((item) => item.productId))];
  let dbProducts: (typeof products.$inferSelect)[] = [];
  try {
    dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));
  } catch {
    dbProducts = [];
  }

  const productsById = new Map<number, typeof products.$inferSelect>();
  for (const p of dbProducts) {
    productsById.set(p.id, p);
  }
  for (const fp of FALLBACK_PRODUCTS) {
    if (!productsById.has(fp.id)) {
      productsById.set(fp.id, fp);
    }
  }

  // 2. Validate stock & active status using trusted server data
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
    if (product.inventoryQuantity > 0 && quantity > product.inventoryQuantity) {
      return NextResponse.json(
        {
          error: `${product.name} does not have enough stock for this quantity.`,
        },
        { status: 409 },
      );
    }
  }

  // 3. Resolve items with database pricing (never trust client prices)
  const resolvedItems: PaymentAttemptItem[] = items.map((item) => {
    const product = productsById.get(item.productId)!;
    return {
      productId: item.productId,
      productName: product.name,
      category: product.category,
      price: product.price,
      quantity: item.quantity,
      size: item.size ?? null,
      isMadeToMeasure: Boolean(item.isMadeToMeasure),
      measurements: item.measurements ?? null,
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

  const orderReference = generateOrderReference();
  const expiresAt = new Date(Date.now() + EXPIRATION_HOURS * 60 * 60 * 1000);

  // 4. Insert into payment_attempts with status PENDING_VERIFICATION
  // Note: This is NOT inserted into the orders table. Unverified attempts never appear in confirmed orders.
  try {
    await db.insert(paymentAttempts).values({
      orderReference,
      customerName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      items: resolvedItems,
      subtotal,
      shipping,
      total,
      currency: "INR",
      status: "PENDING_VERIFICATION",
      expiresAt,
    });
  } catch (err) {
    console.error("Failed to insert payment attempt:", err);
    return NextResponse.json(
      { error: "Unable to initiate payment attempt. Please try again." },
      { status: 500 },
    );
  }

  // 5. Retrieve configurable UPI details
  const upiConfig = await getUpiConfig();

  let upiIntentUrl: string | null = null;
  if (upiConfig.isConfigured) {
    upiIntentUrl = buildUpiPaymentUri({
      upiId: upiConfig.upiId,
      payeeName: upiConfig.payeeName,
      amount: total,
      orderReference,
      note: `Order ${orderReference}`,
    });
  }

  return NextResponse.json(
    {
      success: true,
      orderReference,
      amount: total,
      currency: "INR",
      isConfigured: upiConfig.isConfigured,
      upiId: upiConfig.upiId || null,
      payeeName: upiConfig.payeeName,
      upiIntentUrl,
      expiresAt: expiresAt.toISOString(),
    },
    { status: 201 },
  );
}
