"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { CartItemRow } from "@/components/CartItemRow";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal, isLoaded } = useCart();

  if (!isLoaded) {
    return (
      <main className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10">
        <p className="font-serif text-sm text-[var(--color-charcoal)]/50">Opening your bag…</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-28 text-center sm:px-6 lg:px-10">
        <div className="flex items-center gap-2 text-[var(--color-oxblood)]">
          <span className="inline-block h-1.5 w-1.5 rotate-45 bg-current" />
          <span className="inline-block h-2 w-2 rotate-45 bg-current" />
          <span className="inline-block h-1.5 w-1.5 rotate-45 bg-current" />
        </div>
        <h1 className="mt-5 font-serif-display text-3xl uppercase tracking-[0.1em] text-[var(--color-charcoal)] sm:text-4xl">
          Your Shopping Bag is Empty
        </h1>
        <p className="mt-3 max-w-sm font-serif text-[15px] text-[var(--color-charcoal)]/75">
          Discover contemporary menswear woven on traditional pit looms in Pochampally.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-[var(--color-charcoal)] bg-[var(--color-charcoal)] px-8 py-3.5 font-serif text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ivory)] transition-all hover:border-[var(--color-oxblood)] hover:bg-[var(--color-oxblood)]"
          >
            Explore The Collection &rarr;
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <div className="flex items-center gap-2 border-b border-[var(--color-line)] pb-4">
        <h1 className="font-serif-display text-2xl uppercase tracking-[0.14em] text-[var(--color-charcoal)] sm:text-3xl">
          Shopping Bag
        </h1>
        <span className="font-serif text-xs text-[var(--color-oxblood)]">
          ({items.length} {items.length === 1 ? "piece" : "pieces"})
        </span>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          {items.map((item) => (
            <CartItemRow key={item.cartItemId} item={item} />
          ))}
        </div>

        <aside className="h-fit border border-[var(--color-line)] bg-[var(--color-parchment)] p-6 shadow-2xs">
          <p className="font-serif text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-oxblood)]">
            ORDER SUMMARY
          </p>

          <div className="mt-5 flex items-center justify-between font-serif text-sm">
            <span className="uppercase tracking-[0.08em] text-[var(--color-charcoal)]/80">
              Bag Subtotal
            </span>
            <span className="font-semibold text-[var(--color-charcoal)]">
              {formatPrice(subtotal)}
            </span>
          </div>
          
          <div className="mt-4 border-t border-[var(--color-line)] pt-4 font-serif text-xs text-[var(--color-charcoal)]/75 leading-relaxed">
            {subtotal >= 5000 ? (
              <p className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <span>&#10003;</span> Complimentary shipping included across India.
              </p>
            ) : (
              <p>
                Add {formatPrice(5000 - subtotal)} more to qualify for complimentary shipping. Standard delivery: &#8377;199.
              </p>
            )}
          </div>

          <Link
            href="/checkout"
            className="mt-6 flex w-full items-center justify-center border border-[var(--color-charcoal)] bg-[var(--color-charcoal)] px-6 py-4 font-serif text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ivory)] transition-all hover:border-[var(--color-oxblood)] hover:bg-[var(--color-oxblood)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oxblood)]"
          >
            PROCEED TO CHECKOUT &rarr;
          </Link>

          <div className="mt-4 border-t border-[var(--color-line)] pt-4 text-center font-serif text-[11px] text-[var(--color-charcoal)]/60">
            Direct UPI (PhonePe, GPay, Paytm) safeguarded checkout.
          </div>
        </aside>
      </div>
    </main>
  );
}
