import Link from "next/link";
import type { SiteContentValues } from "@/lib/site-content";

function getColumns(content: SiteContentValues) {
  return [
    {
      title: content.footerShop || "Shop",
      links: [
        { href: "/shop?category=jacket", label: content.navJackets || "Jackets" },
        { href: "/shop?category=shirt", label: content.navShirts || "Shirts" },
        { href: "/made-to-measure", label: content.navMadeToMeasure || "Made to Measure" },
        { href: "/shop?filter=new", label: content.navNew || "New Arrivals" },
      ],
    },
    {
      title: content.footerAbout || "About",
      links: [
        { href: "/story", label: content.footerStory || "Our Story" },
        { href: "/story", label: content.footerWeave || "The Weave" },
        { href: "/made-to-measure", label: "Bespoke Atelier" },
      ],
    },
    {
      title: content.footerHelp || "Customer Care",
      links: [
        { href: "/faq", label: "FAQ & Help" },
        { href: "/contact", label: content.footerContact || "Contact Studio" },
        { href: "/shipping", label: content.footerShipping || "Shipping Policy" },
        { href: "/returns", label: content.footerReturns || "Returns & Refunds" },
        { href: "/size-guide", label: content.footerSizeGuide || "Size Guide" },
      ],
    },
    {
      title: content.footerSocial || "Connect",
      links: [
        { href: "https://instagram.com", label: content.footerInstagram || "Instagram" },
        { href: "https://wa.me/918555909550", label: "WhatsApp Studio" },
        { href: `mailto:${content.contactEmail || "hello@naade.in"}`, label: content.contactEmail || "hello@naade.in" },
      ],
    },
  ];
}

export function Footer({ content }: { content: SiteContentValues }) {
  const columns = getColumns(content);

  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-ivory)]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr_1fr]">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link
              href="/"
              className="font-serif-display text-2xl tracking-[0.06em] text-[var(--color-charcoal)]"
            >
              {content.brand || "NAADE"}
            </Link>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-maroon)]">
              Pochampally Handloom Fashion
            </p>
            <p className="mt-4 max-w-[240px] text-xs leading-relaxed text-[var(--color-charcoal)]/65">
              {content.footerTagline || "Contemporary Ikat / Pochampally Telangana."} Authentic handloom menswear cut from single lengths of resist-dyed cloth.
            </p>
            <div className="mt-4">
              <a
                href="https://wa.me/918555909550"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-charcoal)] underline underline-offset-4 hover:text-[var(--color-maroon)]"
              >
                <span>WhatsApp: +91 8555909550</span>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]">
                {col.title}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[var(--color-charcoal)]/65 transition-colors hover:text-[var(--color-charcoal)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--color-line)] pt-8 text-[11px] uppercase tracking-[0.1em] text-[var(--color-charcoal)]/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {content.brand || "NAADE"}. All rights reserved. Handwoven in Pochampally.
          </p>
          <div className="flex gap-6">
            <span>{content.footerLocation || "Pochampally · Telangana · India"}</span>
            <Link href="/shipping" className="hover:underline">
              Terms &amp; Policies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
