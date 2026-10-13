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
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-8 text-xs text-[var(--color-charcoal)]/50">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[var(--color-charcoal)]">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/shop" className="hover:text-[var(--color-charcoal)]">
              Shop
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/shop?category=${product.category}`}
              className="capitalize hover:text-[var(--color-charcoal)]"
            >
              {product.category}s
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-[var(--color-charcoal)] truncate max-w-[200px]">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <ProductGallery images={gallery} alt={product.name} />

        {/* Product Information */}
        <div className="lg:pt-2">
          <div className="flex items-center gap-2">
            {product.isNewArrival && <Badge>New</Badge>}
            <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-charcoal)]/50">
              {product.productCode}
            </p>
          </div>

          <h1 className="mt-3 font-serif-display text-[clamp(1.9rem,3.5vw,2.75rem)] leading-tight text-[var(--color-charcoal)]">
            {product.name}
          </h1>

          <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--color-maroon)]">
            {product.category} • Handwoven Ikat
          </p>

          <p className="mt-4 text-2xl font-medium text-[var(--color-charcoal)]">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-[var(--color-charcoal)]/80">
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

          {/* Craft Specifications */}
          {details.length > 0 && (
            <dl className="mt-10 grid grid-cols-1 gap-4 border-t border-[var(--color-line)] pt-8 sm:grid-cols-2">
              {details.map((detail) => (
                <div key={detail.label} className="border-b border-black/5 pb-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]/50">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-[var(--color-charcoal)]">
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* Craft Story */}
          {product.craftStory && (
            <div className="mt-8 border-t border-[var(--color-line)] pt-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-maroon)]">
                Artisan Story
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-charcoal)]/80">
                {product.craftStory}
              </p>
            </div>
          )}

          {/* Trust Highlights */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[var(--color-line)] pt-8 text-xs text-[var(--color-charcoal)]/70">
            <div className="flex items-start gap-2.5">
              <span className="font-serif-display text-base text-[var(--color-maroon)]">✓</span>
              <div>
                <p className="font-semibold text-[var(--color-charcoal)]">Complimentary Shipping</p>
                <p className="mt-0.5 text-[11px]">Dispatched across India in 3–5 business days.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="font-serif-display text-base text-[var(--color-maroon)]">✓</span>
              <div>
                <p className="font-semibold text-[var(--color-charcoal)]">Bespoke Fit</p>
                <p className="mt-0.5 text-[11px]">Individual made-to-measure tailoring option.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-24 border-t border-[var(--color-line)] pt-16">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-maroon)]">
                More in {product.category}s
              </p>
              <h2 className="mt-2 font-serif-display text-2xl text-[var(--color-charcoal)] sm:text-3xl">
                Complementary Pieces
              </h2>
            </div>
            <Link
              href={`/shop?category=${product.category}`}
              className="text-xs font-semibold uppercase tracking-wider text-[var(--color-charcoal)] underline underline-offset-4"
            >
              View all {product.category}s →
            </Link>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </main>
  );
}
