"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { SiteContentValues } from "@/lib/site-content";

export function Footer({ content }: { content: SiteContentValues }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-line)] bg-[#141210] text-[#f5efe6]">
      {/* Background Dark Ikat Textile Drapery */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/heritage/footer-textile-bg.jpg"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover opacity-35 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12100e]/95 via-[#161412]/85 to-[#1c1a18]/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.2fr_1.6fr_1.2fr] lg:gap-14">
          {/* Left Column: Brand Identity */}
          <div className="flex flex-col items-start">
            <Link
              href="/"
              className="flex items-center gap-3 font-serif-display text-2xl font-normal tracking-[0.16em] text-[#f5efe6] sm:text-3xl"
            >
              <div className="relative h-7 w-7 shrink-0">
                <Image
                  src="/images/heritage/ikat-motif.png"
                  alt=""
                  aria-hidden
                  fill
                  className="object-contain brightness-125"
                />
              </div>
              <span>{content.brand || "NAADE"}</span>
            </Link>
            <p className="mt-2 font-serif text-[10px] uppercase tracking-[0.22em] text-[#dfd6c7]/80">
              Pochampally Ikat &bull; Handloom &bull; India
            </p>
            <p className="mt-1 font-telugu text-xs text-[#c2882a]/90 tracking-wide">
              పోచంపల్లి చేనేత వారసత్వం
            </p>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-[#dfd6c7]/75">
              Preserving the 1990s Pochampally handloom archive as a contemporary menswear label. Crafted on traditional pit looms in Telangana.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#dfd6c7]/65">
              <span>Studio: Pochampally, Telangana</span>
              <span>&bull;</span>
              <a
                href="https://wa.me/918555909550"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-[#f5efe6]"
              >
                +91 8555909550
              </a>
            </div>
          </div>

          {/* Center Column: Newsletter Subscription (Visual Reference Match) */}
          <div className="flex flex-col">
            <h3 className="font-serif-display text-base font-normal tracking-[0.06em] text-[#f5efe6] sm:text-lg">
              Join our journey
            </h3>
            <p className="mt-1.5 text-xs text-[#dfd6c7]/80 leading-relaxed max-w-md">
              Be the first to know about new collections, artisan stories and exclusive updates from our Pochampally atelier.
            </p>

            {subscribed ? (
              <div className="mt-5 border border-[#dfd6c7]/30 bg-[#631e21]/40 px-4 py-3 text-xs text-[#f5efe6]">
                Thank you for joining our handloom journey. We will share new weaves and artisan stories with you.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-5 flex flex-wrap items-center gap-2 sm:flex-nowrap">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full min-w-0 border border-[#dfd6c7]/30 bg-black/40 px-4 py-2.5 text-xs text-[#f5efe6] placeholder-[#dfd6c7]/50 outline-none transition-colors focus:border-[#dfd6c7] sm:max-w-xs"
                />
                <button
                  type="submit"
                  className="border border-[#742226] bg-[var(--color-oxblood)] px-6 py-2.5 font-serif text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f5efe6] transition-all hover:bg-[#7a2428] hover:shadow-sm"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Social Channels & Policies */}
          <div className="flex flex-col items-start lg:items-end">
            {/* Social Icons */}
            <div className="flex items-center gap-4 text-[#f5efe6]">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NAADE Instagram"
                className="rounded-full border border-[#dfd6c7]/30 p-2 text-[#dfd6c7] transition-all hover:border-[#dfd6c7] hover:text-[#f5efe6]"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/918555909550"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NAADE WhatsApp"
                className="rounded-full border border-[#dfd6c7]/30 p-2 text-[#dfd6c7] transition-all hover:border-[#dfd6c7] hover:text-[#f5efe6]"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NAADE Craft Documentaries"
                className="rounded-full border border-[#dfd6c7]/30 p-2 text-[#dfd6c7] transition-all hover:border-[#dfd6c7] hover:text-[#f5efe6]"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

            {/* Editorial Footer Links */}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-serif tracking-[0.1em] text-[#dfd6c7]/80 lg:justify-end">
              <Link href="/shipping" className="transition-colors hover:text-[#f5efe6]">
                Shipping
              </Link>
              <span>|</span>
              <Link href="/returns" className="transition-colors hover:text-[#f5efe6]">
                Returns
              </Link>
              <span>|</span>
              <Link href="/shipping" className="transition-colors hover:text-[#f5efe6]">
                Privacy
              </Link>
              <span>|</span>
              <Link href="/shipping" className="transition-colors hover:text-[#f5efe6]">
                Terms
              </Link>
              <span>|</span>
              <Link href="/faq" className="transition-colors hover:text-[#f5efe6]">
                FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Handloom Legacy Note */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#dfd6c7]/20 pt-8 text-[11px] font-serif uppercase tracking-[0.16em] text-[#dfd6c7]/60 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {content.brand || "NAADE"}. Pochampally Handloom Heritage.
          </p>
          <div className="flex items-center gap-2">
            <span>Preserved from Pochampally, Telangana, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
