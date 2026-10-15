import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content-db";
import { getActiveProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent("home");
  const allProducts = await getActiveProducts();
  
  // Featured products from database / fallback
  const featuredProducts = allProducts.filter((p) => p.isFeatured).slice(0, 4);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 4);

  const heroImageSrc = content.heroImage?.trim() || "/images/hero.jpg";

  return (
    <main className="flex flex-col">
      {/* 1. Hero Section: Authentic Heritage Editorial */}
      <section className="relative overflow-hidden border-b border-[var(--color-line)] bg-[var(--color-ivory)]">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-10 lg:py-24">
          {/* Left Hero Narrative */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-[var(--color-maroon)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-maroon)]">
                {content.heroEyebrow || "POCHAMPALLY IKAT • TELANGANA"}
              </p>
            </div>

            <h1 className="mt-5 font-serif-display text-[clamp(2.4rem,5vw,4.2rem)] font-normal leading-[1.08] tracking-[-0.01em] text-[var(--color-charcoal)]">
              {(content.heroTitle || "Contemporary Ikat\nfrom Pochampally")
                .split("\n")
                .map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--color-charcoal)]/80 sm:text-base">
              {content.heroDescription ||
                "Handcrafted luxury menswear rooted in the centuries-old weaving heritage of Pochampally. Every jacket and shirt is tailored from authentic resist-dyed cottons, woven one thread at a time on traditional Indian pit looms."}
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/shop?category=jacket"
                className="inline-flex items-center justify-center rounded-xs bg-[var(--color-charcoal)] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)] shadow-xs transition-all hover:bg-black hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-charcoal)]"
              >
                {content.heroJacketsButton || "Explore Jackets"} →
              </Link>
              <Link
                href="/shop?category=shirt"
                className="inline-flex items-center justify-center rounded-xs border border-[var(--color-charcoal)]/30 bg-transparent px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)] transition-colors hover:border-[var(--color-charcoal)] hover:bg-[var(--color-cotton)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-charcoal)]"
              >
                {content.heroShirtsButton || "Explore Shirts"}
              </Link>
            </div>

            {/* Micro Badge */}
            <div className="mt-10 flex items-center gap-4 border-t border-[var(--color-line)] pt-6 text-xs text-[var(--color-charcoal)]/65">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-[var(--color-maroon)]">◈</span>
                <span>Geographical Indication (GI) Certified Handloom</span>
              </div>
              <span className="text-[var(--color-line)]">•</span>
              <div>Atelier Direct</div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="relative">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[540px] overflow-hidden rounded-xs border border-[var(--color-line)] bg-[var(--color-offwhite)] shadow-sm">
              <Image
                src={heroImageSrc}
                alt={content.heroImageAlt || "NAADE contemporary handloom Ikat jacket crafted in Pochampally"}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 540px"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ivory)]/90">
                  The Pochampally Edit
                </p>
                <p className="mt-1 font-serif-display text-lg tracking-[0.02em]">
                  Mathematical Resist-Dye &amp; Tailored Silhouettes
                </p>
              </div>
            </div>

            {/* Subtle decorative offset border frame */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-3 -right-3 hidden h-full w-full rounded-xs border border-[var(--color-maroon)]/30 lg:block -z-10"
            />
          </div>
        </div>
      </section>

      {/* 2. Artisanal Trust Pillars */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-cotton)]/40 py-10 sm:py-12">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div className="border-l-2 border-[var(--color-maroon)] pl-4">
              <p className="font-serif-display text-sm font-semibold tracking-[0.02em] text-[var(--color-charcoal)] sm:text-base">
                {content.trust1Title || "Pochampally GI Cluster"}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-charcoal)]/70">
                {content.trust1Copy || "Handwoven in Telangana with authentic resist-dyed yarns."}
              </p>
            </div>
            <div className="border-l-2 border-[var(--color-maroon)] pl-4">
              <p className="font-serif-display text-sm font-semibold tracking-[0.02em] text-[var(--color-charcoal)] sm:text-base">
                {content.trust2Title || "Bespoke Measurements"}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-charcoal)]/70">
                {content.trust2Copy || "Custom tailored from individual cloth lengths at no extra cost."}
              </p>
            </div>
            <div className="border-l-2 border-[var(--color-maroon)] pl-4">
              <p className="font-serif-display text-sm font-semibold tracking-[0.02em] text-[var(--color-charcoal)] sm:text-base">
                {content.trust3Title || "100% Handloom Cottons"}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-charcoal)]/70">
                {content.trust3Copy || "Breathable natural fibers woven on traditional pit looms."}
              </p>
            </div>
            <div className="border-l-2 border-[var(--color-maroon)] pl-4">
              <p className="font-serif-display text-sm font-semibold tracking-[0.02em] text-[var(--color-charcoal)] sm:text-base">
                {content.trust4Title || "Direct Studio Model"}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-charcoal)]/70">
                {content.trust4Copy || "Connected directly to master artisans and weaving families."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Collection Section */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--color-line)] pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-[var(--color-maroon)]">
              <span className="inline-block h-1 w-1 rotate-45 bg-current" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                {content.featuredEyebrow || "The Edit"}
              </p>
            </div>
            <h2 className="mt-2 font-serif-display text-3xl text-[var(--color-charcoal)] sm:text-4xl">
              {content.featuredTitle || "Featured Pieces"}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-charcoal)]/70">
              {content.featuredCopy || "Contemporary silhouettes. Traditional weave. Made in Pochampally."}
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)] underline underline-offset-4 hover:text-[var(--color-maroon)] transition-colors"
          >
            {content.viewAllButton || "View All Products"} →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Category Showcase: Jackets vs Shirts */}
      <section className="border-t border-b border-[var(--color-line)] bg-[var(--color-cotton)]/30 py-16 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-maroon)]">
              Curated Disciplines
            </p>
            <h2 className="mt-2 font-serif-display text-2xl text-[var(--color-charcoal)] sm:text-3xl">
              Jackets &amp; Shirts in Pochampally Handloom
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:gap-12">
            {/* Category 1: Jackets */}
            <Link
              href="/shop?category=jacket"
              className="group relative overflow-hidden rounded-xs border border-[var(--color-line)] bg-[var(--color-ivory)] transition-all hover:border-[var(--color-charcoal)]/40 shadow-xs"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-offwhite)]">
                <Image
                  src={content.jacketsImage || "/images/category-jackets.jpg"}
                  alt="NAADE Pochampally Ikat Jackets"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ivory)]">
                    Structure &amp; Form
                  </span>
                  <h3 className="mt-1 font-serif-display text-2xl font-normal">
                    {content.jacketsTitle || "Handloom Jackets"}
                  </h3>
                  <p className="mt-1 text-xs text-white/85 line-clamp-2">
                    {content.jacketsCopy || "Tailored Nehru and single-breasted jackets woven from mathematical Ikat."}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-charcoal)]">
                <span>Explore Collection</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>

            {/* Category 2: Shirts */}
            <Link
              href="/shop?category=shirt"
              className="group relative overflow-hidden rounded-xs border border-[var(--color-line)] bg-[var(--color-ivory)] transition-all hover:border-[var(--color-charcoal)]/40 shadow-xs"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-offwhite)]">
                <Image
                  src={content.shirtsImage || "/images/category-shirts.jpg"}
                  alt="NAADE Pochampally Handloom Shirts"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ivory)]">
                    Relaxed Everyday Luxury
                  </span>
                  <h3 className="mt-1 font-serif-display text-2xl font-normal">
                    {content.shirtsTitle || "Handloom Shirts"}
                  </h3>
                  <p className="mt-1 text-xs text-white/85 line-clamp-2">
                    {content.shirtsCopy || "Pure cotton shirts woven on pit looms, cut for contemporary comfort."}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-charcoal)]">
                <span>Explore Collection</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Craft Story: "The Architecture of Ikat" */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xs border border-[var(--color-line)] bg-[var(--color-offwhite)]">
            <Image
              src={content.weaveImage || "/images/weave-texture.jpg"}
              alt={content.weaveImageAlt || "Detail of authentic handloom Pochampally Ikat weave"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-maroon)]">
              {content.weaveEyebrow || "Craft & Geometry"}
            </p>
            <h2 className="mt-3 font-serif-display text-3xl text-[var(--color-charcoal)] sm:text-4xl">
              {content.weaveTitle || "The Architecture of Ikat"}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[var(--color-charcoal)]/80 sm:text-base">
              {content.weaveCopy ||
                "Pochampally Ikat is created by resist-dyeing yarns before weaving, allowing the pattern to emerge through the structure of the cloth itself. The calculated geometry requires weeks of mathematical tying and precision handloom weaving."}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-charcoal)]/75">
              Unlike industrial print fashion where patterns are stamped onto prefabricated textiles, every single meter of NAADE cloth is born on traditional wooden looms in Telangana. The softened geometric lines are the hallmark of authentic human handcraft.
            </p>
            <div className="mt-8">
              <Link
                href="/story"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)] underline underline-offset-4 hover:text-[var(--color-maroon)]"
              >
                Read our Pochampally story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Made to Measure Atelier Highlight */}
      <section className="border-t border-[var(--color-line)] bg-[var(--color-offwhite)]/60 py-16 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-maroon)]">
                {content.measureEyebrow || "Personal Fit"}
              </p>
              <h2 className="mt-3 font-serif-display text-3xl text-[var(--color-charcoal)] sm:text-4xl">
                {content.measureTitle || "Your Fit. Your NAADE."}
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-[var(--color-charcoal)]/80 sm:text-base">
                {content.measureCopy ||
                  "Selected NAADE pieces can be cut to your individual measurements. We believe handwoven clothing should fit with quiet confidence."}
              </p>

              <ul className="mt-6 space-y-3 text-xs text-[var(--color-charcoal)]/80">
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-maroon)] font-bold">✓</span>
                  <span>Input chest, waist, shoulder, sleeve &amp; garment length directly at checkout.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-maroon)] font-bold">✓</span>
                  <span>Handcrafted individually by our master tailor in Pochampally.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-maroon)] font-bold">✓</span>
                  <span>No surcharge for custom bespoke sizing.</span>
                </li>
              </ul>

              <div className="mt-8">
                <Link
                  href="/made-to-measure"
                  className="inline-flex items-center justify-center rounded-xs bg-[var(--color-charcoal)] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)] transition-colors hover:bg-black"
                >
                  {content.measureButton || "Explore Made to Measure"} →
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-xs border border-[var(--color-line)] bg-white shadow-xs">
              <Image
                src={content.measureImage || "/images/made-to-measure.jpg"}
                alt={content.measureImageAlt || "Tailor crafting a bespoke NAADE handloom garment"}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
