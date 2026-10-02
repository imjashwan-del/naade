"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { CartItemRow } from "@/components/CartItemRow";
import { LinkButton } from "@/components/Button";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal, isLoaded } = useCart();

  if (!isLoaded) {
    return (
      <main className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10">
        <p className="text-sm text-[var(--color-charcoal)]/50">Loading your bag…</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-28 text-center sm:px-6 lg:px-10">
        <p className="ikat-diamonds text-[var(--color-maroon)]">
          <span />
          <span />
          <span />
        </p>
        <h1 className="mt-5 font-serif-display text-3xl text-[var(--color-charcoal)]">
          Your bag is empty
        </h1>
        <p className="mt-3 max-w-sm text-sm text-[var(--color-charcoal)]/60">
          Discover contemporary menswear woven from Pochampally Ikat.
        </p>
        <div className="mt-8">
          <LinkButton href="/shop">Continue Shopping</LinkButton>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <h1 className="font-serif-display text-3xl text-[var(--color-charcoal)]">Your Bag</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {items.map((item) => (
            <CartItemRow key={item.cartItemId} item={item} />
          ))}
        </div>

        <aside className="h-fit border border-[var(--color-line)] p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="uppercase tracking-[0.1em] text-[var(--color-charcoal)]/60">
              Subtotal
            </span>
            <span className="font-medium text-[var(--color-charcoal)]">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-[var(--color-charcoal)]/50">
            Shipping and taxes calculated at checkout.
          </p>
          <Link
            href="/checkout"
            className="mt-6 flex w-full items-center justify-center bg-[var(--color-charcoal)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)] transition-colors hover:bg-black"
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}
