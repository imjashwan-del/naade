import { notFound } from "next/navigation";
import { getProductBySlug, getActiveProducts } from "@/lib/products";
import { ProductGallery } from "@/components/ProductGallery";
import { AddToBagPanel } from "@/components/AddToBagPanel";
import { ProductGrid } from "@/components/ProductGrid";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/Badge";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const gallery = product.galleryImages?.length ? product.galleryImages : [product.mainImageUrl];

  const details = [
    { label: "Cloth Name", value: product.clothName },
    { label: "Weave Type", value: product.weaveType },
    { label: "Colour Story", value: product.colourStory },
  ].filter((d) => d.value);

  // Fetch related products in same category
  const allCategoryProducts = await getActiveProducts({ category: product.category });
  const related = allCategoryProducts.filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
      {/* Editorial Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-8 font-serif text-xs text-[var(--color-charcoal)]/60">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[var(--color-oxblood)]">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/shop" className="hover:text-[var(--color-oxblood)]">
              Shop
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/shop?category=${product.category}`}
              className="capitalize hover:text-[var(--color-oxblood)]"
            >
              {product.category}s
            </Link>
          </li>
          <li>/</li>
          <li className="font-semibold text-[var(--color-charcoal)] truncate max-w-[200px]">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Product Gallery */}
        <div className="border border-[var(--color-line)] bg-[var(--color-parchment)] p-2 shadow-2xs">
          <ProductGallery images={gallery} alt={product.name} />
        </div>

        {/* Product Information */}
        <div className="flex flex-col lg:pt-2">
          <div className="flex items-center gap-2.5">
            {product.isNewArrival && <Badge tone="oxblood">NEW PIECE</Badge>}
            <p className="font-serif text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-charcoal)]/60">
              {product.productCode || "POCHAMPALLY IKAT"}
            </p>
          </div>

          <h1 className="mt-3 font-serif-display text-[clamp(2.1rem,4vw,3.2rem)] font-normal uppercase leading-[1.08] tracking-[0.03em] text-[var(--color-oxblood)]">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2 font-serif text-xs uppercase tracking-[0.16em] text-[var(--color-charcoal)]/75">
            <span>{product.category}</span>
            <span>&bull;</span>
            <span>Telangana Pit-Loom Weave</span>
            <span className="font-telugu text-[var(--color-turmeric)]">పోచంపల్లి</span>
          </div>

          <p className="mt-5 font-serif text-2xl font-normal text-[var(--color-charcoal)]">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <p className="mt-6 max-w-lg font-serif text-[15px] leading-relaxed text-[var(--color-charcoal)]/85">
              {product.description}
            </p>
          )}

          {/* Add to Bag Panel with Size & Custom Measurements */}
          <div className="mt-8 border-t border-[var(--color-line)] pt-8">
            <AddToBagPanel
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                category: product.category,
                price: product.price,
                mainImageUrl: product.mainImageUrl,
                availableSizes: product.availableSizes,
                customMeasurementsEnabled: product.customMeasurementsEnabled,
                inventoryQuantity: product.inventoryQuantity,
              }}
            />
          </div>

          {/* Craft Specifications Table */}
          {details.length > 0 && (
            <dl className="mt-10 grid grid-cols-1 gap-4 border-t border-[var(--color-line)] pt-8 sm:grid-cols-2">
              {details.map((detail) => (
                <div key={detail.label} className="border-b border-[var(--color-line)] pb-3">
                  <dt className="font-serif text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-charcoal)]/60">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 font-serif text-sm font-medium text-[var(--color-charcoal)]">
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* Craft Story */}
          {product.craftStory && (
            <div className="mt-8 border-t border-[var(--color-line)] pt-8">
              <p className="font-serif text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-oxblood)]">
                The Heritage Story
              </p>
              <p className="mt-2 font-serif text-sm leading-relaxed text-[var(--color-charcoal)]/80">
                {product.craftStory}
              </p>
            </div>
          )}

          {/* Trust Highlights */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[var(--color-line)] pt-8 font-serif text-xs text-[var(--color-charcoal)]/75">
            <div className="flex items-start gap-2.5">
              <span className="text-base font-bold text-[var(--color-oxblood)]">&#10003;</span>
              <div>
                <p className="font-semibold text-[var(--color-charcoal)]">Complimentary Shipping</p>
                <p className="mt-0.5 text-[11px] text-[var(--color-charcoal)]/65">Across India in 3–5 business days.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-base font-bold text-[var(--color-oxblood)]">&#10003;</span>
              <div>
                <p className="font-semibold text-[var(--color-charcoal)]">Bespoke Proportions</p>
                <p className="mt-0.5 text-[11px] text-[var(--color-charcoal)]/65">Individual tailoring at no extra fee.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-24 border-t border-[var(--color-line)] pt-16">
          <div className="mb-10 flex items-end justify-between border-b border-[var(--color-line)] pb-5">
            <div>
              <p className="font-serif text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-oxblood)]">
                Archive Selection
              </p>
              <h2 className="mt-2 font-serif-display text-2xl uppercase tracking-[0.12em] text-[var(--color-charcoal)]">
                Complementary Pieces
              </h2>
            </div>
            <Link
              href={`/shop?category=${product.category}`}
              className="font-serif text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-charcoal)] transition-colors hover:text-[var(--color-oxblood)]"
            >
              View all {product.category}s &rarr;
            </Link>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </main>
  );
}
