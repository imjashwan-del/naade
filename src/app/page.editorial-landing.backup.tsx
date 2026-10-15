import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content-db";
import { getActiveProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent("home");
  const allProducts = await getActiveProducts();

  // Featured pieces from database
  const featured = allProducts.filter((p) => p.isFeatured).slice(0, 4);
  const displayProducts = featured.length > 0 ? featured : allProducts.slice(0, 4);

  return (
    <main className="flex flex-col bg-[var(--color-ivory)]">
      {/* =========================================================================
          1. HERO SECTION: AUTHENTIC 1990s POCHAMPALLY EDITORIAL (VISUAL REFERENCE)
         ========================================================================= */}
      <section className="relative border-b border-[var(--color-line)] bg-[var(--color-ivory)] overflow-hidden">
        <div className="mx-auto max-w-[1440px]">
          {/* =======================================================================
              DESKTOP HERO (PRESERVED EXACTLY FOR lg AND ABOVE: 1024px+)
             ======================================================================= */}
          <div className="hidden lg:grid lg:grid-cols-[44px_1.1fr_1.1fr_110px] items-stretch">
            {/* Left Column: Antique Botanical Block-Print Border (Mockup Left Border) */}
            <div className="relative overflow-hidden border-r border-[var(--color-line)] bg-[var(--color-parchment)]">
              <div className="absolute inset-0 opacity-80 mix-blend-multiply">
                <Image
                  src="/images/heritage/botanical-border.jpg"
                  alt=""
                  aria-hidden
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>

            {/* Center-Left Narrative: Editorial Headlines & Story CTA */}
            <div className="flex flex-col justify-center px-14 py-20">
              <div className="flex items-center gap-2.5">
                <span className="h-px w-5 bg-[var(--color-oxblood)]" />
                <p className="font-serif text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--color-oxblood)]">
                  {content.heroEyebrow || "POCHAMPALLY IKAT • TELANGANA"}
                </p>
                <span className="font-telugu text-[11px] text-[var(--color-turmeric)]">
                  పోచంపల్లి
                </span>
              </div>

              {/* Major 90s Telugu Handloom Editorial Headline */}
              <h1 className="mt-6 font-serif-display text-[clamp(2.5rem,5.2vw,4.5rem)] font-normal uppercase leading-[1.04] tracking-[0.03em] text-[var(--color-oxblood)]">
                WOVEN<br />
                IN TRADITION.<br />
                <span className="text-[var(--color-oxblood)]">MADE FOR</span><br />
                <span className="text-[var(--color-oxblood)]">TOMORROW.</span>
              </h1>

              <p className="mt-7 max-w-md font-serif text-[16px] leading-relaxed text-[var(--color-charcoal)]/85">
                {content.heroDescription ||
                  "NAADE brings the timeless art of Pochampally Ikat into contemporary menswear — where heritage meets everyday elegance."}
              </p>

              {/* Vintage Handloom Catalogue Action */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center border border-[var(--color-charcoal)] bg-transparent px-8 py-3.5 font-serif text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-charcoal)] transition-all hover:border-[var(--color-oxblood)] hover:bg-[var(--color-oxblood)] hover:text-[#f5efe6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oxblood)]"
                >
                  EXPLORE THE COLLECTION &rarr;
                </Link>
                <Link
                  href="/story"
                  className="font-serif text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-charcoal)]/75 underline underline-offset-4 transition-colors hover:text-[var(--color-oxblood)]"
                >
                  Our Heritage &rarr;
                </Link>
              </div>

              {/* Small Archive Tag Note */}
              <div className="mt-12 flex items-center gap-3 border-t border-[var(--color-line)] pt-5 text-[11px] font-serif tracking-[0.1em] text-[var(--color-charcoal)]/65">
                <span className="text-[var(--color-oxblood)] font-bold">&#9670;</span>
                <span>Geographical Indication (GI) Certified Pit-Loom Weave</span>
                <span>&bull;</span>
                <span>Telangana Archive</span>
              </div>
            </div>

            {/* Center-Right Hero Photograph (Authentic Pochampally Ikat Jacket Menswear) */}
            <div className="relative min-h-full bg-[var(--color-parchment)]">
              <Image
                src="/images/heritage/hero-man.jpg"
                alt="Man wearing authentic NAADE Pochampally Ikat jacket in Telangana heritage courtyard"
                fill
                priority
                sizes="45vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-40" />
            </div>

            {/* Right Column: Authentic Pochampally Ikat Textile Swatch Strip */}
            <div className="relative overflow-hidden border-l border-[var(--color-line)] bg-[#1a1715]">
              <Image
                src="/images/heritage/ikat-vertical-swatch.jpg"
                alt="Authentic Pochampally Ikat textile swatch texture"
                fill
                priority
                sizes="110px"
                className="object-cover"
              />
            </div>
          </div>

          {/* =======================================================================
              DEDICATED MOBILE HERO (COMPOSED FOR PHONE & TABLET SCREENS: <lg)
             ======================================================================= */}
          <div className="flex flex-col lg:hidden">
            {/* 1. Authentic Pochampally Ikat Menswear Photograph (Natural 4:3 Aspect Ratio) */}
            <div className="relative w-full border-b border-[var(--color-line)] bg-[var(--color-parchment)]">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/images/heritage/hero-man.jpg"
                  alt="Man wearing authentic NAADE Pochampally Ikat jacket in Telangana heritage courtyard"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                {/* Archival Badge Tag */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 border border-white/30 bg-black/65 px-2.5 py-1 text-[9px] font-serif uppercase tracking-[0.16em] text-[#f5efe6] backdrop-blur-xs">
                  <span className="text-[var(--color-turmeric)] font-bold">&#9670;</span>
                  <span>1990s Pochampally Handloom Archive</span>
                </div>
              </div>
            </div>

            {/* 2. Editorial Narrative & Immediate Action Below Image */}
            <div className="flex flex-col px-4 py-8 sm:px-6 sm:py-10">
              <div className="flex items-center gap-2">
                <span className="h-px w-4 bg-[var(--color-oxblood)]" />
                <p className="font-serif text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-oxblood)]">
                  {content.heroEyebrow || "POCHAMPALLY IKAT • TELANGANA"}
                </p>
                <span className="font-telugu text-[10px] text-[var(--color-turmeric)]">
                  పోచంపల్లి
                </span>
              </div>

              <h1 className="mt-3.5 font-serif-display text-2xl sm:text-3xl font-normal uppercase leading-[1.12] tracking-[0.03em] text-[var(--color-oxblood)]">
                WOVEN IN TRADITION.<br />
                MADE FOR TOMORROW.
              </h1>

              <p className="mt-3 max-w-md font-serif text-[14px] leading-relaxed text-[var(--color-charcoal)]/85">
                {content.heroDescription ||
                  "NAADE brings the timeless art of Pochampally Ikat into contemporary menswear — where heritage meets everyday elegance."}
              </p>

              {/* Mobile Actions: Comfortable 48px touch targets */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/shop"
                  className="flex h-12 items-center justify-center border border-[var(--color-charcoal)] bg-[var(--color-charcoal)] px-6 font-serif text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ivory)] transition-all hover:bg-[var(--color-oxblood)] hover:border-[var(--color-oxblood)] active:scale-[0.99]"
                >
                  EXPLORE THE COLLECTION &rarr;
                </Link>
                <Link
                  href="/story"
                  className="flex h-11 items-center justify-center font-serif text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-charcoal)]/80 underline underline-offset-4 hover:text-[var(--color-oxblood)]"
                >
                  Our Heritage &rarr;
                </Link>
              </div>

              {/* Mobile Archive Note */}
              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[var(--color-line)] pt-3 text-[10px] font-serif tracking-[0.08em] text-[var(--color-charcoal)]/65">
                <span className="text-[var(--color-oxblood)] font-bold">&#9670;</span>
                <span>GI Certified Pit-Loom Weave</span>
                <span>&bull;</span>
                <span>Telangana Heritage Archive</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. ROOTED IN POCHAMPALLY: DOCUMENTARY ARCHIVE & CRAFTSMANSHIP
         ========================================================================= */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-ivory)] py-12 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-[1.1fr_1.5fr_0.8fr_0.8fr] lg:gap-10">
            {/* 1. Black & White Documentary Photograph of Master Weaver at Pit Loom */}
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-[var(--color-line)] bg-[var(--color-cotton)] shadow-2xs">
              <Image
                src="/images/heritage/artisan-loom.jpg"
                alt="Master artisan at traditional wooden pit loom in Pochampally, Telangana"
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
                className="object-cover grayscale contrast-110"
              />
            </div>

            {/* 2. Editorial Story Narrative */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-xl sm:text-2xl font-normal uppercase tracking-[0.14em] text-[var(--color-oxblood)]">
                  ROOTED IN POCHAMPALLY
                </h2>
              </div>
              <p className="mt-1 font-telugu text-xs text-[var(--color-turmeric)] tracking-wide">
                పోచంపల్లి చేనేత వారసత్వం
              </p>

              <p className="mt-4 font-serif text-[14px] sm:text-[15px] leading-relaxed text-[var(--color-charcoal)]/85">
                From the looms of Pochampally, Telangana, comes a legacy of precision, patience and pattern. At NAADE, we work with skilled artisans to create modern silhouettes in authentic Ikat &mdash; keeping a centuries-old tradition alive, one weave at a time.
              </p>

              <div className="mt-6">
                <Link
                  href="/story"
                  className="font-serif text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-charcoal)] underline underline-offset-4 transition-colors hover:text-[var(--color-oxblood)]"
                >
                  OUR STORY &rarr;
                </Link>
              </div>
            </div>

            {/* 3. Authentic Handloom Ikat Diamond Motif Symbol */}
            <div className="flex items-center justify-center py-2 lg:py-0">
              <div className="relative h-24 w-20 sm:h-28 sm:w-24">
                <Image
                  src="/images/heritage/ikat-motif.png"
                  alt="Traditional Pochampally Ikat diamond motif"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* 4. Heritage Pillars: 2x2 grid on mobile, vertical stack on desktop */}
            <div className="grid grid-cols-2 gap-2.5 border-t border-[var(--color-line)] pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 lg:flex lg:flex-col lg:space-y-4">
              <div className="border border-[var(--color-line)] bg-[var(--color-parchment)] p-2.5 text-center font-serif text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-charcoal)]/85 lg:border-0 lg:bg-transparent lg:p-0 lg:text-left">
                HANDLOOM
              </div>
              <div className="border border-[var(--color-line)] bg-[var(--color-parchment)] p-2.5 text-center font-serif text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-charcoal)]/85 lg:border-0 lg:bg-transparent lg:p-0 lg:text-left">
                HERITAGE
              </div>
              <div className="border border-[var(--color-line)] bg-[var(--color-parchment)] p-2.5 text-center font-serif text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-charcoal)]/85 lg:border-0 lg:bg-transparent lg:p-0 lg:text-left">
                CRAFTSMANSHIP
              </div>
              <div className="border border-[var(--color-line)] bg-[var(--color-parchment)] p-2.5 text-center font-serif text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-charcoal)]/85 lg:border-0 lg:bg-transparent lg:p-0 lg:text-left">
                SUSTAINABILITY
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURED PIECES: THE 1990s HANDLOOM CATALOGUE (VISUAL REFERENCE)
         ========================================================================= */}
      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-24">
        {/* Section Heading & View All Link */}
        <div className="flex items-end justify-between border-b border-[var(--color-line)] pb-5">
          <div className="flex items-baseline gap-3">
            <h2 className="font-serif-display text-xl sm:text-2xl font-normal uppercase tracking-[0.2em] text-[var(--color-charcoal)]">
              FEATURED PIECES
            </h2>
          </div>
          <Link
            href="/shop"
            className="font-serif text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-charcoal)] transition-colors hover:text-[var(--color-oxblood)]"
          >
            VIEW ALL &rarr;
          </Link>
        </div>

        {/* 5-Column Grid: 4 Real Products + 1 Vintage Catalogue Card */}
        <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3.5 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {displayProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={idx < 2}
            />
          ))}

          {/* 5th Item: Authentic Heritage Catalogue Card (Mobile: horizontal banner; Desktop: 5th column) */}
          <div className="col-span-2 lg:col-span-1 flex flex-row lg:flex-col items-center lg:items-stretch justify-between overflow-hidden border border-[var(--color-line)] bg-[var(--color-parchment)] p-3 sm:p-4 shadow-2xs gap-3 sm:gap-4">
            <div className="relative aspect-[3/4] w-20 sm:w-28 lg:w-full lg:aspect-[4/5] shrink-0 overflow-hidden">
              <Image
                src="/images/heritage/legacy-card.jpg"
                alt="More than clothing — it's a legacy. Pochampally handloom archive."
                fill
                sizes="(max-width: 640px) 100px, 20vw"
                className="object-contain object-center"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center border-l lg:border-l-0 lg:border-t border-[var(--color-line)] pl-3 lg:pl-0 lg:pt-3 text-left lg:text-center">
              <p className="font-serif text-[11px] sm:text-xs text-[var(--color-charcoal)]/85 leading-snug">
                More than clothing &mdash; it&apos;s a legacy. Handcrafted in Pochampally.
              </p>
              <Link
                href="/story"
                className="mt-2 inline-block font-serif text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-oxblood)] underline underline-offset-4 hover:text-black"
              >
                Discover The Legacy &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CRAFTSMANSHIP & PROCESS: THE 1990s POCHAMPALLY ARCHIVE
         ========================================================================= */}
      <section className="border-t border-b border-[var(--color-line)] bg-[var(--color-cotton)]/35 py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-serif text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-oxblood)]">
              THE WEAVING PROCESS &bull; నేత ప్రక్రియ
            </p>
            <h2 className="mt-3 font-serif-display text-2xl sm:text-4xl text-[var(--color-charcoal)] font-normal tracking-[0.02em]">
              Precision, Patience &amp; The Pit Loom
            </h2>
            <p className="mt-4 font-serif text-[15px] leading-relaxed text-[var(--color-charcoal)]/80">
              Unlike printed industrial cloth, Pochampally Ikat patterns are calculated on mathematical graphs and resist-dyed before weaving commences.
            </p>
          </div>

          <div className="mt-10 sm:mt-14 grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="border border-[var(--color-line)] bg-[var(--color-ivory)] p-5 sm:p-6 shadow-2xs">
              <div className="flex items-baseline justify-between border-b border-[var(--color-line)] pb-3">
                <span className="font-serif text-2xl font-bold text-[var(--color-oxblood)]">01</span>
                <span className="font-telugu text-xs text-[var(--color-turmeric)]">బాంధణి</span>
              </div>
              <h3 className="mt-4 font-serif-display text-base font-semibold text-[var(--color-charcoal)]">
                Mathematical Tying
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-charcoal)]/75">
                Yarn hanks are bound tightly with rubber strips based on geometric grids, protecting sections from dye penetration.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border border-[var(--color-line)] bg-[var(--color-ivory)] p-5 sm:p-6 shadow-2xs">
              <div className="flex items-baseline justify-between border-b border-[var(--color-line)] pb-3">
                <span className="font-serif text-2xl font-bold text-[var(--color-oxblood)]">02</span>
                <span className="font-telugu text-xs text-[var(--color-turmeric)]">రంగులద్దడం</span>
              </div>
              <h3 className="mt-4 font-serif-display text-base font-semibold text-[var(--color-charcoal)]">
                Resist Immersion
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-charcoal)]/75">
                Submerged in authentic natural indigo, oxblood, and earth dyes. Multiple immersions create rich, enduring color depth.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border border-[var(--color-line)] bg-[var(--color-ivory)] p-5 sm:p-6 shadow-2xs">
              <div className="flex items-baseline justify-between border-b border-[var(--color-line)] pb-3">
                <span className="font-serif text-2xl font-bold text-[var(--color-oxblood)]">03</span>
                <span className="font-telugu text-xs text-[var(--color-turmeric)]">మగ్గం నేత</span>
              </div>
              <h3 className="mt-4 font-serif-display text-base font-semibold text-[var(--color-charcoal)]">
                Pit-Loom Weaving
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-charcoal)]/75">
                Warp and weft meet on traditional pit-looms where human hands align each motif to reveal softened geometric lines.
              </p>
            </div>

            {/* Step 4 */}
            <div className="border border-[var(--color-line)] bg-[var(--color-ivory)] p-5 sm:p-6 shadow-2xs">
              <div className="flex items-baseline justify-between border-b border-[var(--color-line)] pb-3">
                <span className="font-serif text-2xl font-bold text-[var(--color-oxblood)]">04</span>
                <span className="font-telugu text-xs text-[var(--color-turmeric)]">కుట్టుపని</span>
              </div>
              <h3 className="mt-4 font-serif-display text-base font-semibold text-[var(--color-charcoal)]">
                Bespoke Tailoring
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-charcoal)]/75">
                Individual lengths of woven cloth are cut and tailored into contemporary Nehru and single-breasted menswear jackets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. MADE TO MEASURE & CUSTOM FIT
         ========================================================================= */}
      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="h-px w-5 bg-[var(--color-oxblood)]" />
              <p className="font-serif text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-oxblood)]">
                BESPOKE ATELIER
              </p>
            </div>

            <h2 className="mt-4 font-serif-display text-2xl sm:text-4xl text-[var(--color-charcoal)]">
              Your Fit. Your NAADE.
            </h2>

            <p className="mt-4 font-serif text-[14px] sm:text-[15px] leading-relaxed text-[var(--color-charcoal)]/85">
              We believe authentic handloom clothing should fit with quiet confidence. Every piece in our collection can be tailored to your individual proportions at no additional charge.
            </p>

            <ul className="mt-6 space-y-3 font-serif text-xs text-[var(--color-charcoal)]/85">
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--color-oxblood)] font-bold">&#9670;</span>
                <span>Custom chest, waist, shoulder, sleeve length, and garment length.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--color-oxblood)] font-bold">&#9670;</span>
                <span>Cut from individual lengths of cloth by our master tailor in Pochampally.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--color-oxblood)] font-bold">&#9670;</span>
                <span>Dispatched with complimentary express delivery across India.</span>
              </li>
            </ul>

            <div className="mt-8 w-full sm:w-auto">
              <Link
                href="/made-to-measure"
                className="flex h-12 w-full sm:w-auto sm:inline-flex items-center justify-center border border-[var(--color-charcoal)] bg-[var(--color-charcoal)] px-8 font-serif text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ivory)] transition-all hover:bg-[var(--color-oxblood)] hover:border-[var(--color-oxblood)]"
              >
                Explore Custom Order &rarr;
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden border border-[var(--color-line)] bg-[var(--color-parchment)] shadow-2xs">
            <Image
              src="/images/heritage/artisan-loom.jpg"
              alt="Craftsmanship in Pochampally"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
