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
        className="relative h-28 w-24 shrink-0 overflow-hidden bg-[var(--color-offwhite)] sm:h-36 sm:w-28"
      >
        <Image src={item.imageUrl} alt={item.name} fill sizes="140px" className="object-cover" />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-3">
          <div>
            <Link
              href={`/product/${item.slug}`}
              className="text-sm font-medium uppercase tracking-[0.02em] text-[var(--color-charcoal)]"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-xs capitalize text-[var(--color-charcoal)]/55">{item.category}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-charcoal)]/70">
              {item.isMadeToMeasure ? (
                <span className="font-semibold uppercase tracking-[0.08em] text-[var(--color-maroon)]">
                  Made to Measure
                </span>
              ) : (
                item.size && <span>Size: {item.size}</span>
              )}
            </div>
            {item.isMadeToMeasure && item.measurements ? (
              <dl className="mt-2 grid grid-cols-3 gap-x-3 gap-y-1 text-[11px] text-[var(--color-charcoal)]/60">
                {MEASUREMENT_LABELS.map((m) => (
                  <div key={m.key} className="flex gap-1">
                    <dt className="font-medium">{m.label}:</dt>
                    <dd>{item.measurements?.[m.key]}&quot;</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
          <p className="whitespace-nowrap text-sm font-medium text-[var(--color-charcoal)]">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex h-9 w-28 items-center justify-between border border-[var(--color-charcoal)]/25">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
              className="h-full w-9 text-base text-[var(--color-charcoal)]"
            >
              −
            </button>
            <span className="text-sm">{item.quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
              className="h-full w-9 text-base text-[var(--color-charcoal)]"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.cartItemId)}
            className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)]/60 underline underline-offset-4 hover:text-[var(--color-maroon)]"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
