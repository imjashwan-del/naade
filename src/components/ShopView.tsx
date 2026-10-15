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
    { label: content.tabAll, category: undefined, filter: undefined },
    { label: content.tabJackets, category: "jacket" },
    { label: content.tabShirts, category: "shirt" },
    { label: content.tabNew, filter: "new" },
  ];

  const products = await getActiveProducts({
    category: category || undefined,
    isNewArrival: filter === "new" ? true : undefined,
  });

  const activeLabel =
    tabs.find((tab) => tab.category === category && tab.filter === filter)
      ?.label ?? content.tabAll;

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <SectionHeading
        eyebrow={content.eyebrow || "The Catalog"}
        title={content.title || "Shop NAADE"}
        copy={content.copy || "Contemporary menswear handwoven from Pochampally Ikat."}
      />

      {/* Filter Tabs */}
      <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-[var(--color-line)] pb-5">
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
              className={`rounded-xs px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-charcoal)] ${
                isActive
                  ? "bg-[var(--color-charcoal)] text-[var(--color-ivory)] shadow-xs"
                  : "bg-transparent text-[var(--color-charcoal)]/70 hover:bg-[var(--color-cotton)] hover:text-[var(--color-charcoal)]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-charcoal)]/60">
          Showing {products.length} {products.length === 1 ? "handloom piece" : "handloom pieces"}
        </p>
        {(category || filter) && (
          <Link
            href={basePath}
            className="text-xs text-[var(--color-maroon)] underline underline-offset-4 hover:text-black"
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
