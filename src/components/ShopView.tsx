import { SectionHeading } from "@/components/SectionHeading";
import { ProductGrid } from "@/components/ProductGrid";
import { getActiveProducts } from "@/lib/products";
import { getSiteContent } from "@/lib/site-content-db";
import Link from "next/link";

export type ShopSearchParams = { category?: string; filter?: string };

export async function ShopView({
  searchParams,
  basePath = "/shop",
}: {
  searchParams?: Promise<ShopSearchParams>;
  basePath?: string;
}) {
  const content = await getSiteContent("shop");
  const resolvedParams = searchParams ? await searchParams : {};
  const { category, filter } = resolvedParams;

  const tabs = [
    { label: content.tabAll || "All Pieces", category: undefined, filter: undefined },
    { label: content.tabJackets || "Jackets", category: "jacket" },
    { label: content.tabShirts || "Shirts", category: "shirt" },
    { label: content.tabNew || "New Arrivals", filter: "new" },
  ];

  const products = await getActiveProducts({
    category: category || undefined,
    isNewArrival: filter === "new" ? true : undefined,
  });

  const activeLabel =
    tabs.find((tab) => tab.category === category && tab.filter === filter)
      ?.label ?? tabs[0].label;

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <SectionHeading
        eyebrow={content.eyebrow || "HANDLOOM CATALOGUE"}
        title={content.title || "The Collection"}
        copy={content.copy || "Contemporary menswear crafted from authentic Pochampally Ikat, handwoven in Telangana."}
      />

      {/* 90s Catalogue Filter Tabs */}
      <div className="mt-10 flex flex-wrap items-center gap-2 border-b border-[var(--color-line)] pb-5">
        {tabs.map((tab) => {
          const queryParams = new URLSearchParams({
            ...(tab.category ? { category: tab.category } : {}),
            ...(tab.filter ? { filter: tab.filter } : {}),
          }).toString();

          const href = queryParams
            ? `${basePath === "/" ? "/shop" : basePath}?${queryParams}`
            : basePath;

          const isActive = tab.label === activeLabel;
          return (
            <Link
              key={tab.label}
              href={href}
              className={`border px-5 py-2 font-serif text-[11px] font-semibold uppercase tracking-[0.16em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oxblood)] ${
                isActive
                  ? "border-[var(--color-oxblood)] bg-[var(--color-oxblood)] text-[#f5efe6] shadow-2xs"
                  : "border-[var(--color-line)] bg-[var(--color-parchment)] text-[var(--color-charcoal)]/80 hover:border-[var(--color-charcoal)] hover:text-[var(--color-charcoal)]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="font-serif text-xs uppercase tracking-[0.14em] text-[var(--color-charcoal)]/70">
          Showing {products.length} {products.length === 1 ? "handloom piece" : "handloom pieces"}
        </p>
        {(category || filter) && (
          <Link
            href={basePath}
            className="font-serif text-xs font-semibold text-[var(--color-oxblood)] underline underline-offset-4 hover:text-black"
          >
            Clear filters
          </Link>
        )}
      </div>

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </main>
  );
}
