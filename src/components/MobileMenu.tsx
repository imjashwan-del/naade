"use client";

import Link from "next/link";
import { useEffect } from "react";

type NavLink = { href: string; label: string };

export function MobileMenu({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
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
      className={`fixed inset-0 z-50 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        aria-label="Close menu"
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-[var(--color-ivory)] shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-5">
          <span className="font-serif-display text-lg tracking-[0.08em]">
            NAADE
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-2xl leading-none text-[var(--color-charcoal)]"
          >
            &times;
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-6 py-6">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="border-b border-[var(--color-line)] py-4 text-sm font-medium uppercase tracking-[0.14em] text-[var(--color-charcoal)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-4 border-t border-[var(--color-line)] px-6 py-6">
          <Link
            href="/cart"
            onClick={onClose}
            className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-charcoal)]/70"
          >
            Bag
          </Link>
        </div>
      </div>
    </div>
  );
}
