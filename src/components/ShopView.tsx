import { ProductGrid } from "@/components/ProductGrid";
import { getActiveProducts } from "@/lib/products";
import { getSiteContent } from "@/lib/site-content-db";
import Link from "next/link";

export type ShopSearchParams = {
  category?: string;
  filter?: string;
  sort?: string;
};

export async function ShopView({
  searchParams,
  basePath = "/shop",
}: {
  searchParams?: Promise<ShopSearchParams>;
  basePath?: string;
}) {
  const content = await getSiteContent("shop");
  const resolvedParams = searchParams ? await searchParams : {};
  const { category, filter, sort } = resolvedParams;

  const tabs = [
    { label: content.tabAll || "All Pieces", category: undefined, filter: undefined },
    { label: content.tabJackets || "Jackets", category: "jacket" },
    { label: content.tabShirts || "Shirts", category: "shirt" },
    { label: content.tabNew || "New Arrivals", filter: "new" },
  ];

  const sortOptions = [
    { label: "Featured", value: "featured" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Newest", value: "newest" },
  ];

  const rawProducts = await getActiveProducts({
    category: category || undefined,
    isNewArrival: filter === "new" ? true : undefined,
  });

  // Apply functional sorting
  const products = [...rawProducts];
  if (sort === "price-asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === "newest") {
    products.sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
  }

  const activeLabel =
    tabs.find((tab) => tab.category === category && tab.filter === filter)
      ?.label ?? tabs[0].label;

  const currentSort = sort || "featured";

  return (
    <main className="mx-auto max-w-[1440px] px-3.5 sm:px-6 lg:px-10 py-6 sm:py-10">
      {/* Restrained Collection Introduction (No oversized hero, immediate product access) */}
      <div className="border-b border-[var(--color-line)] pb-5 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-4 bg-[var(--color-oxblood)]" />
              <p className="font-serif text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-oxblood)]">
                POCHAMPALLY HANDLOOM ARCHIVE
              </p>
              <span className="font-telugu text-[10px] text-[var(--color-turmeric)]">
                పోచంపల్లి
              </span>
            </div>

            <h1 className="mt-1 font-serif-display text-2xl sm:text-3xl lg:text-4xl font-normal uppercase tracking-[0.12em] text-[var(--color-charcoal)]">
              {content.title || "THE COLLECTION"}
            </h1>

            <p className="mt-1 font-serif text-xs sm:text-sm text-[var(--color-charcoal)]/75 tracking-wide">
              {content.copy || "Tradition, woven into what we wear."}
            </p>
          </div>

          {/* Quick Heritage Trust Highlights */}
          <div className="hidden md:flex items-center gap-3 text-[11px] font-serif tracking-[0.08em] text-[var(--color-charcoal)]/65">
            <span className="text-[var(--color-oxblood)] font-bold">&#9670;</span>
            <span>Telangana Pit-Loom Weaves</span>
            <span>&bull;</span>
            <span>Complimentary Delivery Across India</span>
          </div>
        </div>
      </div>

      {/* 90s Catalogue Filter & Sort Controls */}
      <div className="mt-5 sm:mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 border-b border-[var(--color-line)] pb-4 sm:pb-5">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {tabs.map((tab) => {
            const queryParams = new URLSearchParams();
            if (tab.category) queryParams.set("category", tab.category);
            if (tab.filter) queryParams.set("filter", tab.filter);
            if (sort && sort !== "featured") queryParams.set("sort", sort);

            const queryString = queryParams.toString();
            const href = queryString
              ? `${basePath === "/" ? "/" : basePath}?${queryString}`
              : basePath;

            const isActive = tab.label === activeLabel;
            return (
              <Link
                key={tab.label}
                href={href}
                className={`border px-3.5 sm:px-5 py-2 font-serif text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oxblood)] ${
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

        {/* Sorting Controls */}
        <div className="flex items-center gap-2">
          <span className="font-serif text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]/60">
            Sort:
          </span>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {sortOptions.map((opt) => {
              const queryParams = new URLSearchParams();
              if (category) queryParams.set("category", category);
              if (filter) queryParams.set("filter", filter);
              if (opt.value !== "featured") queryParams.set("sort", opt.value);

              const queryString = queryParams.toString();
              const href = queryString
                ? `${basePath === "/" ? "/" : basePath}?${queryString}`
                : basePath;

              const isSortActive = currentSort === opt.value;
              return (
                <Link
                  key={opt.value}
                  href={href}
                  className={`border px-2 sm:px-2.5 py-1 font-serif text-[9.5px] sm:text-[10px] font-medium uppercase tracking-[0.08em] transition-colors ${
                    isSortActive
                      ? "border-[var(--color-charcoal)] bg-[var(--color-charcoal)] text-[var(--color-ivory)]"
                      : "border-[var(--color-line)] bg-transparent text-[var(--color-charcoal)]/70 hover:border-[var(--color-charcoal)]"
                  }`}
                >
                  {opt.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result Count & Clear Active Filters */}
      <div className="mt-3.5 sm:mt-4 flex items-center justify-between">
        <p className="font-serif text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[var(--color-charcoal)]/70">
          Showing {products.length} {products.length === 1 ? "handloom piece" : "handloom pieces"}
        </p>
        {(category || filter || (sort && sort !== "featured")) && (
          <Link
            href={basePath}
            className="font-serif text-[11px] sm:text-xs font-semibold text-[var(--color-oxblood)] underline underline-offset-4 hover:text-black"
          >
            Clear filters
          </Link>
        )}
      </div>

      {/* Main Product Grid (Main focus of interface) */}
      <div className="mt-5 sm:mt-8">
        <ProductGrid products={products} />
      </div>

      {/* Compact Vintage Handloom Heritage Footnote */}
      <div className="mt-16 sm:mt-20 border-t border-[var(--color-line)] pt-8 pb-4 text-center">
        <div className="flex items-center justify-center gap-2 text-[var(--color-oxblood)]">
          <span className="inline-block h-1 w-1 rotate-45 bg-current" />
          <span className="inline-block h-1.5 w-1.5 rotate-45 bg-current" />
          <span className="inline-block h-1 w-1 rotate-45 bg-current" />
        </div>
        <p className="mt-2 font-serif text-xs uppercase tracking-[0.16em] text-[var(--color-charcoal)]/70">
          Handcrafted in Pochampally, Telangana &bull; GI Certified Pit Loom Handloom
        </p>
        <p className="mt-1 font-serif text-[11px] text-[var(--color-charcoal)]/55">
          Each piece is tailored from individual lengths of cloth with zero surcharge for bespoke sizing.
        </p>
      </div>
    </main>
  );
}
