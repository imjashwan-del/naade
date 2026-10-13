"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { MobileMenu } from "./MobileMenu";
import { SearchModal } from "./SearchModal";
import type { SiteContentValues } from "@/lib/site-content";

export function Navbar({ content }: { content: SiteContentValues }) {
  const { itemCount, isLoaded } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const showAnnouncement =
    content.announcementEnabled !== "false" && Boolean(content.announcementText);

  const navLinks = [
    { href: "/shop", label: content.navShop || "Shop" },
    { href: "/shop?category=jacket", label: content.navJackets || "Jackets" },
    { href: "/shop?category=shirt", label: content.navShirts || "Shirts" },
    {
      href: "/made-to-measure",
      label: content.navMadeToMeasure || "Made to Measure",
    },
    { href: "/story", label: content.navStory || "Our Story" },
    { href: "/faq", label: content.navFaq || "FAQ" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-[var(--color-charcoal)] px-4 py-2 text-center text-[11px] font-medium tracking-[0.14em] text-[var(--color-ivory)]">
          <p className="mx-auto max-w-5xl uppercase">
            {content.announcementText}
          </p>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-ivory)]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-baseline gap-2 font-serif-display text-2xl tracking-[0.06em] text-[var(--color-charcoal)]"
          >
            <span>{content.brand || "NAADE"}</span>
            <span className="hidden text-[9px] font-sans font-semibold uppercase tracking-[0.25em] text-[var(--color-maroon)] sm:inline-block">
              Pochampally
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]/75 transition-colors hover:text-[var(--color-charcoal)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={content.searchLabel || "Search"}
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]/80 transition-colors hover:text-[var(--color-charcoal)]"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <span className="hidden sm:inline">
                {content.searchLabel || "Search"}
              </span>
            </button>

            {/* Bag / Cart */}
            <Link
              href="/cart"
              aria-label={content.bagLabel || "Shopping Bag"}
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]/80 transition-colors hover:text-[var(--color-charcoal)]"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <span>{content.bagLabel || "Bag"}</span>
              <span className="font-mono text-xs">
                {isLoaded && itemCount > 0 ? `(${itemCount})` : "(0)"}
              </span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded border border-[var(--color-line)] text-[var(--color-charcoal)] lg:hidden"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Interactive Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Drawer */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={navLinks}
        onOpenSearch={() => setSearchOpen(true)}
      />
    </>
  );
}
