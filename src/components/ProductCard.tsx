import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { Badge } from "./Badge";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const isSoldOut =
    product.inventoryQuantity !== undefined && product.inventoryQuantity <= 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oxblood)]"
      aria-label={`View ${product.name}, price ${formatPrice(product.price)}`}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xs border border-[var(--color-line)] bg-[var(--color-cotton)] shadow-2xs transition-all duration-300 group-hover:border-[var(--color-line-dark)]">
        <Image
          src={product.mainImageUrl}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {product.galleryImages?.[1] ? (
          <Image
            src={product.galleryImages[1]}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            aria-hidden
            loading="lazy"
            className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
          />
        ) : null}

        {/* Vintage Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1 sm:left-3 sm:top-3">
          {product.isNewArrival && <Badge tone="oxblood">NEW</Badge>}
          {product.customMeasurementsEnabled && (
            <span className="border border-[var(--color-charcoal)]/40 bg-[var(--color-ivory)]/95 px-2 py-0.5 font-serif text-[8px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)] backdrop-blur-xs">
              Custom Fit
            </span>
          )}
        </div>

        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
            <span className="border border-white/40 bg-black/85 px-3 py-1 font-serif text-[11px] font-semibold uppercase tracking-widest text-white">
              Archived / Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Details - Authentic Editorial Typography */}
      <div className="mt-3.5 flex flex-col items-start">
        <h3 className="font-serif-display text-[15px] font-medium tracking-[0.02em] text-[var(--color-charcoal)] transition-colors group-hover:text-[var(--color-oxblood)]">
          {product.name}
        </h3>
        <p className="mt-1 font-serif text-sm font-medium tracking-[0.02em] text-[var(--color-charcoal)]/90">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
