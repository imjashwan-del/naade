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
    <main className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        copy={content.copy}
      />

      <div className="mt-8 flex flex-wrap gap-2 border-b border-[var(--color-line)] pb-6">
        {tabs.map((tab) => {
          const queryParams = new URLSearchParams({
            ...(tab.category ? { category: tab.category } : {}),
            ...(tab.filter ? { filter: tab.filter } : {}),
          }).toString();

          const href = queryParams
            ? `${basePath === "/" ? "/" : basePath}?${queryParams}`
            : basePath;

          const isActive = tab.label === activeLabel;
          return (
            <Link
              key={tab.label}
              href={href}
              className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                isActive
                  ? "bg-[var(--color-charcoal)] text-[var(--color-ivory)]"
                  : "bg-transparent text-[var(--color-charcoal)]/60 hover:text-[var(--color-charcoal)]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <p className="mt-6 text-xs uppercase tracking-[0.1em] text-[var(--color-charcoal)]/50">
        {products.length} {products.length === 1 ? "piece" : "pieces"}
      </p>

      <div className="mt-6">
        <ProductGrid products={products} />
      </div>
    </main>
  );
}
