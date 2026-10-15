"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/lib/cart-types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";

const MEASUREMENT_LABELS: { key: keyof NonNullable<CartItem["measurements"]>; label: string }[] = [
  { key: "chest", label: "Chest" },
  { key: "waist", label: "Waist" },
  { key: "shoulder", label: "Shoulder" },
  { key: "sleeveLength", label: "Sleeve" },
  { key: "garmentLength", label: "Length" },
  { key: "neck", label: "Neck" },
];

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 border-b border-[var(--color-line)] py-6 sm:gap-6">
      <Link
        href={`/product/${item.slug}`}
        className="relative h-28 w-24 shrink-0 overflow-hidden border border-[var(--color-line)] bg-[var(--color-parchment)] sm:h-36 sm:w-28"
      >
        <Image src={item.imageUrl} alt={item.name} fill sizes="140px" className="object-contain p-1" />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-3">
          <div>
            <Link
              href={`/product/${item.slug}`}
              className="font-serif-display text-[15px] font-medium tracking-[0.02em] text-[var(--color-charcoal)] transition-colors hover:text-[var(--color-oxblood)]"
            >
              {item.name}
            </Link>
            <p className="mt-1 font-serif text-xs uppercase tracking-[0.12em] text-[var(--color-charcoal)]/60">
              {item.category} &bull; Pochampally Ikat
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-serif text-xs text-[var(--color-charcoal)]/80">
              {item.isMadeToMeasure ? (
                <span className="font-semibold uppercase tracking-[0.14em] text-[var(--color-oxblood)]">
                  Made to Measure (Custom Tailored)
                </span>
              ) : (
                item.size && <span>Size: {item.size}</span>
              )}
            </div>
            {item.isMadeToMeasure && item.measurements ? (
              <dl className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1 font-serif text-[11px] text-[var(--color-charcoal)]/70">
                {MEASUREMENT_LABELS.map((m) => (
                  <div key={m.key} className="flex gap-1">
                    <dt className="font-medium text-[var(--color-charcoal)]/60">{m.label}:</dt>
                    <dd>{item.measurements?.[m.key]}&quot;</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
          <p className="whitespace-nowrap font-serif text-base font-normal text-[var(--color-charcoal)]">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex h-9 w-28 items-center justify-between border border-[var(--color-line)] bg-[var(--color-parchment)]">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
              className="h-full w-9 text-base text-[var(--color-charcoal)] hover:bg-[var(--color-cotton)]"
            >
              &minus;
            </button>
            <span className="font-serif text-sm font-semibold">{item.quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
              className="h-full w-9 text-base text-[var(--color-charcoal)] hover:bg-[var(--color-cotton)]"
            >
              &#43;
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.cartItemId)}
            className="font-serif text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)]/60 underline underline-offset-4 hover:text-[var(--color-oxblood)]"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
