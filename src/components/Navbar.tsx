"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { SiteContentValues } from "@/lib/site-content";

const SearchModal = dynamic(
  () => import("./SearchModal").then((mod) => mod.SearchModal),
  { ssr: false }
);

const MobileMenu = dynamic(
  () => import("./MobileMenu").then((mod) => mod.MobileMenu),
  { ssr: false }
);

export function Navbar({ content }: { content: SiteContentValues }) {
  const pathname = usePathname();
  const { itemCount, isLoaded } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const showAnnouncement =
    content.announcementEnabled !== "false" && Boolean(content.announcementText);

  const navLinks = [
    { href: "/", label: "THE COLLECTION", exact: true },
    { href: "/shop?category=jacket", label: "JACKETS", exact: false },
    { href: "/shop?category=shirt", label: "SHIRTS", exact: false },
    { href: "/made-to-measure", label: "CUSTOM ORDER", exact: false },
    { href: "/story", label: "OUR STORY", exact: false },
    { href: "/contact", label: "CONTACT", exact: false },
  ];

  return (
    <>
      {/* 90s Heritage Announcement Bar */}
      {showAnnouncement && (
        <div className="border-b border-[#441416] bg-[var(--color-oxblood)] px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f5efe6]">
          <p className="mx-auto max-w-5xl">
            {content.announcementText ||
              "Handwoven Pochampally Ikat • Complimentary Shipping Across India • Bespoke Sizing"}
          </p>
        </div>
      )}

      {/* Main Heritage Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-ivory)]/98 backdrop-blur-xs">
        <div className="mx-auto flex h-14 sm:h-16 lg:h-20 max-w-[1440px] items-center justify-between px-3.5 sm:px-6 lg:px-10">
          {/* Authentic Brand Wordmark with Pochampally Ikat Symbol */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 sm:gap-3.5 focus-visible:outline-none"
            aria-label="NAADE Pochampally Handloom Homepage"
          >
            {/* Authentic Diamond Motif Icon */}
            <div className="relative h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/heritage/ikat-motif.png"
                alt=""
                aria-hidden
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-col">
              <span className="font-serif-display text-xl sm:text-2xl lg:text-[28px] font-normal tracking-[0.14em] text-[var(--color-charcoal)] transition-colors group-hover:text-[var(--color-oxblood)]">
                {content.brand || "NAADE"}
              </span>
              <span className="hidden font-serif text-[8px] sm:text-[9px] font-medium tracking-[0.2em] text-[var(--color-charcoal)]/75 uppercase xs:block sm:block">
                POCHAMPALLY IKAT &bull; HANDLOOM &bull; INDIA
              </span>
            </div>
          </Link>

          {/* Desktop Heritage Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const isActive = link.exact
                ? pathname === link.href
                : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative py-1 font-serif text-[11px] font-medium tracking-[0.16em] uppercase transition-colors hover:text-[var(--color-oxblood)] ${
                    isActive
                      ? "text-[var(--color-charcoal)] font-semibold"
                      : "text-[var(--color-charcoal)]/80"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[var(--color-oxblood)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Profile/Admin, Shopping Bag */}
          <div className="flex items-center gap-3 sm:gap-5 lg:gap-7">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search collection"
              className="flex h-9 w-9 items-center justify-center p-1 text-[var(--color-charcoal)]/80 transition-colors hover:text-[var(--color-oxblood)]"
            >
              <svg
                className="h-[19px] w-[19px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>

            {/* Profile / Admin Login Link - visible on tablet/desktop, accessible via Mobile Drawer on phones */}
            <Link
              href="/admin/login"
              aria-label="Atelier Login & Account"
              className="hidden sm:flex h-9 w-9 items-center justify-center p-1 text-[var(--color-charcoal)]/80 transition-colors hover:text-[var(--color-oxblood)]"
            >
              <svg
                className="h-[19px] w-[19px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </Link>

            {/* Shopping Bag with Badge */}
            <Link
              href="/cart"
              aria-label="View Shopping Bag"
              className="group relative flex h-9 w-9 items-center justify-center p-1 text-[var(--color-charcoal)]/85 transition-colors hover:text-[var(--color-oxblood)]"
            >
              <svg
                className="h-[21px] w-[21px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {/* Badge Counter */}
              <span className="absolute -right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-oxblood)] px-1 font-serif text-[10px] font-bold text-[#f5efe6] shadow-xs">
                {isLoaded ? itemCount : 0}
              </span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 items-center justify-center border border-[var(--color-line)] text-[var(--color-charcoal)] transition-colors hover:border-[var(--color-oxblood)] hover:text-[var(--color-oxblood)] lg:hidden"
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

      {/* Mobile Heritage Drawer */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={navLinks.map((l) => ({ href: l.href, label: l.label }))}
        onOpenSearch={() => setSearchOpen(true)}
      />
    </>
  );
}
