import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { ProductGallery } from "@/components/ProductGallery";
import { AddToBagPanel } from "@/components/AddToBagPanel";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/Badge";

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

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={gallery} alt={product.name} />

        <div className="lg:pt-2">
          <div className="flex items-center gap-2">
            {product.isNewArrival ? <Badge>New</Badge> : null}
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-charcoal)]/50">
              {product.productCode}
            </p>
          </div>
          <h1 className="mt-3 font-serif-display text-[clamp(1.8rem,3.5vw,2.5rem)] leading-tight text-[var(--color-charcoal)]">
            {product.name}
          </h1>
          <p className="mt-2 text-sm capitalize text-[var(--color-charcoal)]/55">
            {product.category}
          </p>
          <p className="mt-4 text-xl font-medium text-[var(--color-charcoal)]">
            {formatPrice(product.price)}
          </p>

          {product.description ? (
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-[var(--color-charcoal)]/75">
              {product.description}
            </p>
          ) : null}

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

          {details.length > 0 ? (
            <dl className="mt-10 grid grid-cols-1 gap-4 border-t border-[var(--color-line)] pt-8 sm:grid-cols-2">
              {details.map((detail) => (
                <div key={detail.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)]/50">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 text-sm text-[var(--color-charcoal)]">{detail.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {product.craftStory ? (
            <div className="mt-8 border-t border-[var(--color-line)] pt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)]/50">
                Craft Story
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-charcoal)]/75">
                {product.craftStory}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
