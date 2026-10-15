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

        <aside className="h-fit rounded-xs border border-[var(--color-line)] bg-white/70 p-6 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]">
            Summary
          </p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="uppercase tracking-[0.08em] text-[var(--color-charcoal)]/70">
              Bag Subtotal
            </span>
            <span className="font-semibold text-[var(--color-charcoal)]">{formatPrice(subtotal)}</span>
          </div>
          
          <div className="mt-3 border-t border-[var(--color-line)] pt-3 text-xs text-[var(--color-charcoal)]/70">
            {subtotal >= 5000 ? (
              <p className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <span>✓</span> Complimentary express delivery included.
              </p>
            ) : (
              <p>
                Add {formatPrice(5000 - subtotal)} more to qualify for complimentary shipping. Standard delivery: ₹199.
              </p>
            )}
          </div>

          <Link
            href="/checkout"
            className="mt-6 flex w-full items-center justify-center rounded-xs bg-[var(--color-charcoal)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)] transition-all hover:bg-black hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-charcoal)]"
          >
            Proceed to Checkout →
          </Link>

          <p className="mt-4 text-center text-[11px] text-[var(--color-charcoal)]/50">
            Direct UPI (PhonePe, GPay, Paytm) accepted at checkout.
          </p>
        </aside>
      </div>
    </main>
  );
}
