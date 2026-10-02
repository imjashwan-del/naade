import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductGrid } from "@/components/ProductGrid";
import { getActiveProducts } from "@/lib/products";
import { getSiteContent } from "@/lib/site-content-db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent("home");
  const featuredProducts = await getActiveProducts({ isFeatured: true });
  const products =
    featuredProducts.length > 0 ? featuredProducts : await getActiveProducts();

  return (
    <main>
      {/* HERO */}
      <section className="relative flex min-h-[86svh] items-end overflow-hidden bg-[var(--color-charcoal)]">
        <Image
          src={content.heroImage}
          alt={content.heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/10" />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-14 pt-32 sm:px-6 lg:px-10 lg:pb-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-ivory)]/80">
            {content.heroEyebrow}
          </p>
          <h1 className="mt-4 max-w-2xl whitespace-pre-line font-serif-display text-[clamp(2.2rem,6vw,4.5rem)] leading-[1.05] text-[var(--color-ivory)]">
            {content.heroTitle}
          </h1>
          <p className="mt-5 max-w-md text-[15px] text-[var(--color-ivory)]/85">
            {content.heroDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <LinkButton href="/shop?category=jacket" variant="secondary">
              {content.heroJacketsButton}
            </LinkButton>
            <LinkButton
              href="/shop?category=shirt"
              variant="outline"
              className="border-[var(--color-ivory)] text-[var(--color-ivory)] hover:bg-[var(--color-ivory)] hover:text-[var(--color-charcoal)]"
            >
              {content.heroShirtsButton}
            </LinkButton>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <SectionHeading
          eyebrow={content.featuredEyebrow}
          title={content.featuredTitle}
          copy={content.featuredCopy}
        />
        <div className="mt-12">
          <ProductGrid products={products.slice(0, 8)} />
        </div>
        <div className="mt-14 flex justify-center">
          <LinkButton href="/shop" variant="outline">
            {content.viewAllButton}
          </LinkButton>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-[1440px] px-4 pb-20 sm:px-6 lg:px-10 lg:pb-28">
        <div className="grid gap-6 md:grid-cols-2">
          <CategoryCard
            image={content.jacketsImage}
            title={content.jacketsTitle}
            copy={content.jacketsCopy}
            href="/shop?category=jacket"
            cta="Shop Jackets"
          />
          <CategoryCard
            image={content.shirtsImage}
            title={content.shirtsTitle}
            copy={content.shirtsCopy}
            href="/shop?category=shirt"
            cta="Shop Shirts"
          />
        </div>
      </section>

      {/* THE WEAVE */}
      <section
        id="weave"
        className="border-y border-[var(--color-line)] bg-[var(--color-offwhite)]"
      >
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-10 lg:py-24">
          <div className="relative aspect-[4/3] overflow-hidden lg:order-2">
            <Image
              src={content.weaveImage}
              alt={content.weaveImageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="lg:order-1">
            <SectionHeading
              eyebrow={content.weaveEyebrow}
              title={content.weaveTitle}
              copy={content.weaveCopy}
            />
          </div>
        </div>
      </section>

      {/* MADE TO MEASURE */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={content.measureImage}
              alt={content.measureImageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-maroon)]">
              {content.measureEyebrow}
            </p>
            <h2 className="mt-4 whitespace-pre-line font-serif-display text-[clamp(1.8rem,4vw,2.75rem)] leading-[1.1] text-[var(--color-charcoal)]">
              {content.measureTitle}
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--color-charcoal)]/70">
              {content.measureCopy}
            </p>
            <div className="mt-8">
              <LinkButton href="/made-to-measure" variant="primary">
                {content.measureButton}
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CategoryCard({
  image,
  title,
  copy,
  href,
  cta,
}: {
  image: string;
  title: string;
  copy: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block aspect-[4/5] overflow-hidden sm:aspect-[3/4]"
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
        <h3 className="font-serif-display text-2xl text-[var(--color-ivory)] sm:text-3xl">
          {title}
        </h3>
        <p className="mt-2 max-w-xs text-sm text-[var(--color-ivory)]/85">
          {copy}
        </p>
        <span className="mt-5 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)] underline underline-offset-4">
          {cta}
        </span>
      </div>
    </Link>
  );
}
