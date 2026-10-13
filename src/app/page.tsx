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
      {/* 1. HERO SECTION */}
      <section className="relative flex min-h-[88svh] items-end overflow-hidden bg-[var(--color-charcoal)]">
        <Image
          src={content.heroImage}
          alt={content.heroImageAlt || "Handwoven Pochampally Ikat cloth"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-85 transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/15" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-16 pt-32 sm:px-6 lg:px-10 lg:pb-24">
          <div className="max-w-3xl">
            <p className="inline-block border-b border-[var(--color-ivory)]/40 pb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--color-ivory)]/90">
              {content.heroEyebrow}
            </p>
            <h1 className="mt-5 whitespace-pre-line font-serif-display text-[clamp(2.4rem,6vw,4.75rem)] leading-[1.04] text-[var(--color-ivory)]">
              {content.heroTitle}
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[var(--color-ivory)]/85 sm:text-base">
              {content.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <LinkButton
                href="/shop?category=jacket"
                variant="secondary"
                className="bg-[var(--color-ivory)] text-[var(--color-charcoal)] hover:bg-white"
              >
                {content.heroJacketsButton || "Shop Jackets"}
              </LinkButton>
              <LinkButton
                href="/shop?category=shirt"
                variant="outline"
                className="border-[var(--color-ivory)] text-[var(--color-ivory)] hover:bg-[var(--color-ivory)] hover:text-[var(--color-charcoal)]"
              >
                {content.heroShirtsButton || "Shop Shirts"}
              </LinkButton>
              <Link
                href="/story"
                className="ml-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)]/80 underline underline-offset-8 transition-colors hover:text-white"
              >
                The Story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CRAFT & HERITAGE PILLARS */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-offwhite)]/70 py-10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-maroon)]">
                01 • Heritage
              </p>
              <h3 className="mt-1 font-serif-display text-sm text-[var(--color-charcoal)] sm:text-base">
                {content.trust1Title || "Pochampally GI Cluster"}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-charcoal)]/70">
                {content.trust1Copy || "Handwoven in Telangana with authentic resist-dyed yarns."}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-maroon)]">
                02 • Bespoke
              </p>
              <h3 className="mt-1 font-serif-display text-sm text-[var(--color-charcoal)] sm:text-base">
                {content.trust2Title || "Made to Measure"}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-charcoal)]/70">
                {content.trust2Copy || "Custom tailored from individual cloth lengths at no extra cost."}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-maroon)]">
                03 • Pure Fiber
              </p>
              <h3 className="mt-1 font-serif-display text-sm text-[var(--color-charcoal)] sm:text-base">
                {content.trust3Title || "100% Handloom Cotton"}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-charcoal)]/70">
                {content.trust3Copy || "Breathable natural fibers woven on traditional pit looms."}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-maroon)]">
                04 • Atelier Direct
              </p>
              <h3 className="mt-1 font-serif-display text-sm text-[var(--color-charcoal)] sm:text-base">
                {content.trust4Title || "Direct Artisan Studio"}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-charcoal)]/70">
                {content.trust4Copy || "Connected directly to master artisans and weaving families."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURATED EDITORIAL CATEGORIES */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[var(--color-line)] pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--color-maroon)]">
              Collections
            </p>
            <h2 className="mt-2 font-serif-display text-3xl text-[var(--color-charcoal)] sm:text-4xl">
              Jackets &amp; Shirts
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)] underline underline-offset-4 hover:text-[var(--color-maroon)]"
          >
            Explore Complete Catalog →
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Jackets Card */}
          <Link
            href="/shop?category=jacket"
            className="group relative block aspect-[4/5] overflow-hidden rounded-sm bg-[var(--color-offwhite)] sm:aspect-[3/4]"
          >
            <Image
              src={content.jacketsImage}
              alt={content.jacketsTitle}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ivory)]/70">
                Outerwear
              </span>
              <h3 className="mt-1 font-serif-display text-2xl text-[var(--color-ivory)] sm:text-3xl">
                {content.jacketsTitle}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-ivory)]/85">
                {content.jacketsCopy}
              </p>
              <span className="mt-5 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)] underline underline-offset-8 transition-colors group-hover:text-white">
                Shop Tailored Jackets →
              </span>
            </div>
          </Link>

          {/* Shirts Card */}
          <Link
            href="/shop?category=shirt"
            className="group relative block aspect-[4/5] overflow-hidden rounded-sm bg-[var(--color-offwhite)] sm:aspect-[3/4]"
          >
            <Image
              src={content.shirtsImage}
              alt={content.shirtsTitle}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ivory)]/70">
                Layering
              </span>
              <h3 className="mt-1 font-serif-display text-2xl text-[var(--color-ivory)] sm:text-3xl">
                {content.shirtsTitle}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-ivory)]/85">
                {content.shirtsCopy}
              </p>
              <span className="mt-5 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)] underline underline-offset-8 transition-colors group-hover:text-white">
                Shop Casual Shirts →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS DISCOVERY */}
      <section className="mx-auto max-w-[1440px] px-4 pb-20 sm:px-6 lg:px-10 lg:pb-28">
        <div className="flex flex-col items-center text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--color-maroon)]">
            {content.featuredEyebrow}
          </p>
          <h2 className="mt-2 font-serif-display text-3xl text-[var(--color-charcoal)] sm:text-4xl">
            {content.featuredTitle}
          </h2>
          <p className="mt-3 max-w-md text-sm text-[var(--color-charcoal)]/70">
            {content.featuredCopy}
          </p>
        </div>

        <div className="mt-12">
          <ProductGrid products={products.slice(0, 8)} />
        </div>

        <div className="mt-14 flex justify-center">
          <LinkButton href="/shop" variant="outline" className="border-black/30 hover:bg-black hover:text-white">
            {content.viewAllButton || "View All Pieces"}
          </LinkButton>
        </div>
      </section>

      {/* 5. THE WEAVE / CRAFT SECTION */}
      <section
        id="weave"
        className="border-y border-[var(--color-line)] bg-[var(--color-offwhite)]/80"
      >
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-28">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[var(--color-charcoal)] shadow-md lg:order-2">
            <Image
              src={content.weaveImage}
              alt={content.weaveImageAlt || "Close-up of handwoven Ikat textile"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute bottom-3 right-3 rounded bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-widest text-[var(--color-ivory)]">
              Double Ikat Resist Weave
            </div>
          </div>
          <div className="lg:order-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--color-maroon)]">
              {content.weaveEyebrow}
            </p>
            <h2 className="mt-3 font-serif-display text-[clamp(1.9rem,3.8vw,2.75rem)] leading-tight text-[var(--color-charcoal)]">
              {content.weaveTitle}
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[var(--color-charcoal)]/80">
              {content.weaveCopy}
            </p>
            <div className="mt-8 flex items-center gap-6">
              <LinkButton href="/story" variant="primary">
                Read The Cultural Story
              </LinkButton>
              <Link
                href="/shop"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)] hover:underline"
              >
                Browse Cloth →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MADE TO MEASURE SPOTLIGHT */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[var(--color-offwhite)] shadow-sm">
            <Image
              src={content.measureImage}
              alt={content.measureImageAlt || "Tailor measuring garment"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--color-maroon)]">
              {content.measureEyebrow}
            </p>
            <h2 className="mt-3 whitespace-pre-line font-serif-display text-[clamp(1.9rem,3.8vw,2.75rem)] leading-[1.1] text-[var(--color-charcoal)]">
              {content.measureTitle}
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[var(--color-charcoal)]/75">
              {content.measureCopy}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <LinkButton href="/made-to-measure" variant="primary">
                {content.measureButton || "Explore Made to Measure"}
              </LinkButton>
              <Link
                href="/size-guide"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]/75 underline underline-offset-4 hover:text-[var(--color-charcoal)]"
              >
                View Size Guide
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
