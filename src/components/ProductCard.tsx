import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { Badge } from "./Badge";

export function ProductCard({ product }: { product: Product }) {
  const isSoldOut = product.inventoryQuantity !== undefined && product.inventoryQuantity <= 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-charcoal)]"
      aria-label={`View ${product.name}, price ${formatPrice(product.price)}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[var(--color-cotton)] border border-[var(--color-line)]/40 shadow-xs">
        <Image
          src={product.mainImageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {product.galleryImages?.[1] ? (
          <Image
            src={product.galleryImages[1]}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            aria-hidden
            loading="lazy"
            className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
          />
        ) : null}

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5 sm:left-3 sm:top-3">
          {product.isNewArrival && <Badge>New</Badge>}
          {product.customMeasurementsEnabled && (
            <span className="rounded-xs bg-[var(--color-charcoal)]/85 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--color-ivory)] backdrop-blur-sm">
              Custom Fit
            </span>
          )}
        </div>

        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[1px]">
            <span className="rounded-xs bg-black/85 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif-display text-sm sm:text-[15px] font-normal tracking-[0.02em] text-[var(--color-charcoal)] group-hover:text-[var(--color-maroon)] transition-colors truncate">
            {product.name}
          </h3>
          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--color-charcoal)]/60 truncate">
            {product.clothName || (product.category === "jacket" ? "Handwoven Jacket" : "Handloom Shirt")}
          </p>
        </div>
        <p className="whitespace-nowrap font-sans font-semibold text-sm text-[var(--color-charcoal)]">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
