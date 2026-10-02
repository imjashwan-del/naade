import type { MetadataRoute } from "next";
import { getActiveProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const paths = [
    "/",
    "/shop",
    "/made-to-measure",
    "/size-guide",
    "/shipping",
    "/returns",
    "/contact",
  ];
  const products = await getActiveProducts();

  return [
    ...paths.map((path) => ({ url: `${siteUrl}${path}` })),
    ...products.map((product) => ({
      url: `${siteUrl}/product/${product.slug}`,
      lastModified: product.updatedAt,
    })),
  ];
}