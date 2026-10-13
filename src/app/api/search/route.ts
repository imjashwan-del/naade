import { NextRequest, NextResponse } from "next/server";
import { getActiveProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.toLowerCase().trim() || "";

  const allProducts = await getActiveProducts();

  if (!query) {
    return NextResponse.json({
      products: allProducts.slice(0, 6),
      total: allProducts.length,
    });
  }

  const filtered = allProducts.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(query);
    const descMatch = product.description.toLowerCase().includes(query);
    const catMatch = product.category.toLowerCase().includes(query);
    const codeMatch = product.productCode?.toLowerCase().includes(query);
    const weaveMatch = product.weaveType?.toLowerCase().includes(query);
    const clothMatch = product.clothName?.toLowerCase().includes(query);
    return nameMatch || descMatch || catMatch || codeMatch || weaveMatch || clothMatch;
  });

  return NextResponse.json({
    products: filtered,
    total: filtered.length,
  });
}
