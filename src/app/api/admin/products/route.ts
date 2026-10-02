import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";
import { productInputSchema } from "@/lib/admin-validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(products).orderBy(desc(products.createdAt));
  return NextResponse.json({ products: rows });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = productInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product data", issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const [product] = await db.insert(products).values(parsed.data).returning();
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "A product with this slug or code already exists." }, { status: 409 });
  }
}
