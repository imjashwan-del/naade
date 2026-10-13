"use client";

import Link from "next/link";
import { useEffect } from "react";

type NavLink = { href: string; label: string };

export function MobileMenu({
  open,
  onClose,
  links,
  onOpenSearch,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  onOpenSearch?: () => void;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        aria-label="Close menu"
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className={`absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-[var(--color-ivory)] shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-5">
          <div>
            <span className="font-serif-display text-xl tracking-[0.06em] text-[var(--color-charcoal)]">
              NAADE
            </span>
            <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-maroon)]">
              Pochampally Ikat
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded p-1 text-2xl leading-none text-[var(--color-charcoal)] hover:bg-black/5"
          >
            &times;
          </button>
        </div>

        {/* Mobile Search button */}
        <div className="border-b border-[var(--color-line)] px-6 py-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSearch?.();
            }}
            className="flex w-full items-center gap-3 rounded border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-xs font-medium uppercase tracking-wider text-[var(--color-charcoal)]/70 hover:border-black/30"
          >
            <svg
              className="h-4 w-4 text-[var(--color-charcoal)]/50"
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
            <span>Search pieces…</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col overflow-y-auto px-6 py-4">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="border-b border-[var(--color-line)]/50 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-[var(--color-charcoal)] transition-colors hover:text-[var(--color-maroon)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cart"
            onClick={onClose}
            className="border-b border-[var(--color-line)]/50 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-[var(--color-charcoal)] hover:text-[var(--color-maroon)]"
          >
            Shopping Bag
          </Link>
        </nav>

        {/* Footer info */}
        <div className="mt-auto border-t border-[var(--color-line)] bg-[var(--color-offwhite)]/50 px-6 py-5 text-xs text-[var(--color-charcoal)]/70">
          <p className="font-semibold uppercase tracking-wider text-[var(--color-charcoal)]">
            Studio Pochampally
          </p>
          <p className="mt-1">Telangana, India</p>
          <p className="mt-2 text-[11px] text-[var(--color-maroon)]">
            WhatsApp: +91 8555909550
          </p>
        </div>
      </div>
    </div>
  );
}
