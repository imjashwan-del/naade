import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { createOrderSchema } from "@/lib/validation";
import { FALLBACK_PRODUCTS } from "@/lib/fallback-products";

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
      {
        error: "Invalid order details",
        issues: parsed.error.flatten(),
        details: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  const rawWhatsAppNumber =
    process.env.NEXT_PUBLIC_NAADE_WHATSAPP_NUMBER ||
    process.env.NAADE_WHATSAPP_NUMBER ||
    "918555909550";
  const whatsappNumber = rawWhatsAppNumber.replace(/\D/g, "");


  const { customer, items } = parsed.data;

  // 1. Fetch products from database (fallback supported for dev seeds)
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

  const productsById = new Map<number, (typeof products.$inferSelect)>();
  for (const p of dbProducts) {
    productsById.set(p.id, p);
  }

  // Include fallback products if not in DB
  for (const fp of FALLBACK_PRODUCTS) {
    if (!productsById.has(fp.id)) {
      productsById.set(fp.id, fp);
    }
  }

  // 2. Validate stock & active status
  const quantitiesByProduct = new Map<number, number>();
  for (const item of items) {
    const product = productsById.get(item.productId);
    if (!product || !product.isActive) {
      return NextResponse.json(
        {
          error:
            "A product in your bag is no longer available. Refresh your bag and try again.",
        },
        { status: 409 }
      );
    }
    quantitiesByProduct.set(
      item.productId,
      (quantitiesByProduct.get(item.productId) ?? 0) + item.quantity
    );
  }

  for (const [productId, quantity] of quantitiesByProduct) {
    const product = productsById.get(productId)!;
    if (product.inventoryQuantity > 0 && quantity > product.inventoryQuantity) {
      return NextResponse.json(
        {
          error: `${product.name} does not have enough stock for this quantity.`,
        },
        { status: 409 }
      );
    }
  }

  // 3. Resolve items with database pricing
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
    0
  );
  const shipping =
    subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const orderNumber = generateOrderNumber();

  // 4. Insert order into DB
  let createdOrder: typeof orders.$inferSelect | null = null;
  try {
    const [inserted] = await db
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

    createdOrder = inserted;

    if (createdOrder) {
      await db.insert(orderItems).values(
        resolvedItems.map((item) => ({
          orderId: createdOrder!.id,
          productId: item.productId > 0 ? item.productId : null,
          productName: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          isMadeToMeasure: item.isMadeToMeasure,
          measurements: item.measurements,
          imageUrl: item.imageUrl,
        }))
      );
    }
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: "We could not save your order. Please try again." },
      { status: 500 }
    );
  }

  // 5. Generate formatted WhatsApp UPI checkout message
  const itemBlocks: string[] = [];
  for (const i of resolvedItems) {
    const lines: string[] = [];
    lines.push(i.name);

    const specs: string[] = [];
    if (i.size) {
      specs.push(`Size: ${i.size}`);
    }
    specs.push(`Qty: ${i.quantity}`);
    specs.push(`Price: ₹${(i.price * i.quantity).toLocaleString("en-IN")}`);
    lines.push(specs.join(" | "));

    if (i.isMadeToMeasure && i.measurements) {
      const m = i.measurements;
      const measureParts: string[] = [];
      if (m.chest) measureParts.push(`Chest: ${m.chest}"`);
      if (m.waist) measureParts.push(`Waist: ${m.waist}"`);
      if (m.shoulder) measureParts.push(`Shoulder: ${m.shoulder}"`);
      if (m.sleeveLength) measureParts.push(`Sleeve: ${m.sleeveLength}"`);
      if (m.garmentLength) measureParts.push(`Length: ${m.garmentLength}"`);
      if (m.neck) measureParts.push(`Neck: ${m.neck}"`);
      if (measureParts.length > 0) {
        lines.push(`Measurements (MTM): ${measureParts.join(", ")}`);
      }
    }
    itemBlocks.push(lines.join("\n"));
  }

  const messageLines = [
    "Hello NAADE Team,",
    "",
    "I'd like to place an order with NAADE.",
    "",
    "*ORDER DETAILS*",
    `Order ID: ${orderNumber}`,
    "",
    "*CUSTOMER DETAILS*",
    `Name: ${customer.fullName}`,
    `Phone: ${customer.phone}`,
    "",
    "*DELIVERY ADDRESS*",
    customer.address,
    `${customer.city}, ${customer.state} - ${customer.pincode}`,
    "",
    "*ORDER SUMMARY*",
    itemBlocks.join("\n\n"),
    "",
    `Subtotal: ₹${subtotal.toLocaleString("en-IN")}`,
    `Shipping: ${shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}`,
    `*TOTAL: ₹${total.toLocaleString("en-IN")}*`,
    "",
    "Please share the UPI payment details for this order. I'll complete the payment after confirmation.",
    "",
    "Thank you.",
    "",
    customer.fullName ? customer.fullName : "NAADE Customer",
  ];

  const whatsappMessage = messageLines.join("\n");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;


  return NextResponse.json(
    {
      success: true,
      order: {
        id: createdOrder?.id,
        orderNumber,
        total,
        customerName: customer.fullName,
      },
      whatsappUrl,
    },
    { status: 201 }
  );
}
