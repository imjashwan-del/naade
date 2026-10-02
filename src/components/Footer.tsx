import Link from "next/link";
import type { SiteContentValues } from "@/lib/site-content";

function getColumns(content: SiteContentValues) {
  return [
    {
      title: content.footerShop,
      links: [
        { href: "/shop?category=jacket", label: content.navJackets },
        { href: "/shop?category=shirt", label: content.navShirts },
        { href: "/shop?filter=new", label: content.navNew },
      ],
    },
    {
      title: content.footerAbout,
      links: [
        { href: "/#weave", label: content.footerStory },
        { href: "/#weave", label: content.footerWeave },
      ],
    },
    {
      title: content.footerHelp,
      links: [
        { href: "/contact", label: content.footerContact },
        { href: "/shipping", label: content.footerShipping },
        { href: "/returns", label: content.footerReturns },
        { href: "/size-guide", label: content.footerSizeGuide },
      ],
    },
    {
      title: content.footerSocial,
      links: [
        { href: "https://instagram.com", label: content.footerInstagram },
      ],
    },
  ];
}

export function Footer({ content }: { content: SiteContentValues }) {
  const columns = getColumns(content);
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-ivory)]">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <p className="font-serif-display text-2xl tracking-[0.06em] text-[var(--color-charcoal)]">
              {content.brand}
            </p>
            <p className="mt-3 max-w-[220px] text-[11px] uppercase tracking-[0.14em] text-[var(--color-charcoal)]/55">
              {content.footerTagline}
            </p>
          </div>
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
                      className="text-[13px] text-[var(--color-charcoal)]/65 hover:text-[var(--color-charcoal)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-[var(--color-line)] pt-6 text-[11px] uppercase tracking-[0.1em] text-[var(--color-charcoal)]/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{content.brand} &copy; 2026</p>
          <p>{content.footerLocation}</p>
        </div>
      </div>
    </footer>
  );
}
