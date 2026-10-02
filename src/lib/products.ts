import { db } from "@/db";
import { products, type Product } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { FALLBACK_PRODUCTS } from "./fallback-products";

export type ProductFilters = {
  category?: string;
  isNewArrival?: boolean;
  isFeatured?: boolean;
};

export async function getActiveProducts(filters: ProductFilters = {}): Promise<Product[]> {
  try {
    const conditions = [eq(products.isActive, true)];
    if (filters.category) conditions.push(eq(products.category, filters.category));
    if (filters.isNewArrival) conditions.push(eq(products.isNewArrival, true));
    if (filters.isFeatured) conditions.push(eq(products.isFeatured, true));

    const rows = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(asc(products.sortOrder), desc(products.createdAt));

    if (rows.length > 0) return rows;
  } catch {
    // fall through to fallback dataset
  }

  let fallback = FALLBACK_PRODUCTS.filter((p) => p.isActive);
  if (filters.category) fallback = fallback.filter((p) => p.category === filters.category);
  if (filters.isNewArrival) fallback = fallback.filter((p) => p.isNewArrival);
  if (filters.isFeatured) fallback = fallback.filter((p) => p.isFeatured);
  return fallback;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const rows = await db
      .select()
      .from(products)
      .where(and(eq(products.slug, slug), eq(products.isActive, true)))
      .limit(1);
    if (rows.length > 0) return rows[0];
  } catch {
    // fall through
  }
  return FALLBACK_PRODUCTS.find((p) => p.slug === slug && p.isActive) ?? null;
}

export async function getProductById(id: number): Promise<Product | null> {
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return rows[0] ?? null;
}
