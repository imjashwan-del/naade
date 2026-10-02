"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { MobileMenu } from "./MobileMenu";

import type { SiteContentValues } from "@/lib/site-content";
export function Navbar({ content }: { content: SiteContentValues }) {
  const { itemCount, isLoaded } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/shop", label: content.navShop },
    { href: "/shop?category=jacket", label: content.navJackets },
    { href: "/shop?category=shirt", label: content.navShirts },
    { href: "/shop?filter=new", label: content.navNew },
  ];
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-ivory)]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link
            href="/"
            className="font-serif-display text-xl tracking-[0.08em] text-[var(--color-charcoal)]"
          >
            {content.brand}
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-charcoal)]/80 transition-colors hover:text-[var(--color-charcoal)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 sm:gap-5">
            <Link
              href="/shop"
              aria-label={content.searchLabel}
              className="hidden text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-charcoal)]/80 hover:text-[var(--color-charcoal)] sm:block"
            >
              {content.searchLabel}
            </Link>
            <Link
              href="/cart"
              aria-label={content.bagLabel}
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-charcoal)]/80 hover:text-[var(--color-charcoal)]"
            >
              {content.bagLabel}
              {isLoaded && itemCount > 0 ? ` (${itemCount})` : " (0)"}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <span className="block h-[1.5px] w-5 bg-[var(--color-charcoal)]" />
              <span className="block h-[1.5px] w-5 bg-[var(--color-charcoal)]" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={navLinks}
      />
    </>
  );
}
