import type { Product } from "@/db/schema";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="border border-[var(--color-line)] bg-[var(--color-parchment)] py-20 text-center">
        <p className="font-serif text-sm tracking-wide text-[var(--color-charcoal)]/65">
          No handloom pieces currently found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
