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
        className={`absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-[var(--color-ivory)] shadow-2xl transition-transform duration-300 ease-out border-l border-[var(--color-line)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="font-serif-display text-xl font-normal tracking-[0.12em] text-[var(--color-charcoal)]">
              NAADE
            </span>
            <span className="h-3 w-px bg-[var(--color-line)]" />
            <span className="text-[10px] font-serif font-semibold uppercase tracking-[0.2em] text-[var(--color-oxblood)]">
              పోచంపల్లి
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-xs border border-[var(--color-line)] text-xl text-[var(--color-charcoal)] transition-colors hover:border-[var(--color-oxblood)] hover:text-[var(--color-oxblood)]"
          >
            &times;
          </button>
        </div>

        {/* Mobile Search Button */}
        <div className="border-b border-[var(--color-line)] px-5 py-3.5 bg-[var(--color-cotton)]/40">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSearch?.();
            }}
            className="flex h-11 w-full items-center gap-3 border border-[var(--color-line)] bg-[var(--color-ivory)] px-3.5 text-xs font-serif uppercase tracking-wider text-[var(--color-charcoal)]/75 hover:border-[var(--color-oxblood)] transition-colors"
          >
            <svg
              className="h-4 w-4 text-[var(--color-oxblood)]"
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
            <span>Search handloom collection…</span>
          </button>
        </div>

        {/* Nav Links with 48px+ touch targets */}
        <nav className="flex flex-col overflow-y-auto px-5 py-3">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="flex items-center justify-between border-b border-[var(--color-line)]/60 py-4 font-serif text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-charcoal)] transition-colors hover:text-[var(--color-oxblood)] active:text-[var(--color-oxblood)]"
            >
              <span>{link.label}</span>
              <span className="text-[var(--color-line-dark)] text-sm">&rarr;</span>
            </Link>
          ))}
          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center justify-between border-b border-[var(--color-line)]/60 py-4 font-serif text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-charcoal)] hover:text-[var(--color-oxblood)]"
          >
            <span>Shopping Bag</span>
            <span className="text-[var(--color-line-dark)] text-sm">&rarr;</span>
          </Link>
          <Link
            href="/admin/login"
            onClick={onClose}
            className="flex items-center gap-2.5 border-b border-[var(--color-line)]/60 py-4 font-serif text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-charcoal)]/70 hover:text-[var(--color-oxblood)]"
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
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            <span>Atelier Account &bull; Login</span>
          </Link>
        </nav>

        {/* Heritage Footer Info */}
        <div className="mt-auto border-t border-[var(--color-line)] bg-[var(--color-parchment)] px-5 py-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-oxblood)]" />
            <p className="font-serif text-[11px] font-semibold uppercase tracking-wider text-[var(--color-charcoal)]">
              Studio Pochampally
            </p>
          </div>
          <p className="mt-1 font-serif text-[11px] text-[var(--color-charcoal)]/75">
            Telangana, India &bull; Pit-Loom Archive
          </p>
          <a
            href="https://wa.me/918555909550"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 border border-[var(--color-oxblood)]/30 bg-[var(--color-ivory)] font-serif text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-oxblood)] transition-colors hover:bg-[var(--color-oxblood)] hover:text-[#f5efe6]"
          >
            <span>WhatsApp Atelier &bull; +91 8555909550</span>
          </a>
        </div>
      </div>
    </div>
  );
}
