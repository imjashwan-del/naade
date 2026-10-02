import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { Badge } from "./Badge";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-offwhite)]">
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
        {product.isNewArrival ? (
          <div className="absolute left-3 top-3">
            <Badge>New</Badge>
          </div>
        ) : null}
      </div>
      <div className="mt-3.5 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-[13px] font-medium uppercase tracking-[0.03em] text-[var(--color-charcoal)]">
            {product.name}
          </h3>
          <p className="mt-1 text-[12px] capitalize text-[var(--color-charcoal)]/55">
            {product.category}
          </p>
        </div>
        <p className="whitespace-nowrap text-[13px] font-medium text-[var(--color-charcoal)]">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
