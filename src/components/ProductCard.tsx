import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { Badge } from "./Badge";

export function ProductCard({ product }: { product: Product }) {
  const isSoldOut = product.inventoryQuantity !== undefined && product.inventoryQuantity <= 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[var(--color-offwhite)]">
        <Image
          src={product.mainImageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.galleryImages?.[1] ? (
          <Image
            src={product.galleryImages[1]}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            aria-hidden
            className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
          />
        ) : null}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNewArrival && <Badge>New</Badge>}
          {product.customMeasurementsEnabled && (
            <span className="rounded bg-[var(--color-charcoal)]/85 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--color-ivory)] backdrop-blur-sm">
              Custom Fit
            </span>
          )}
        </div>

        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <span className="rounded bg-black/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-serif-display text-sm tracking-[0.02em] text-[var(--color-charcoal)] group-hover:text-[var(--color-maroon)] transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 text-[11px] capitalize text-[var(--color-charcoal)]/60">
            {product.clothName || product.category}
          </p>
        </div>
        <p className="whitespace-nowrap font-medium text-sm text-[var(--color-charcoal)]">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
