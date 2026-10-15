import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content-db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Story — NAADE Pochampally Handlooms",
  description:
    "The story of NAADE and the weavers of Pochampally, Telangana. 1990s handloom heritage preserved as contemporary menswear.",
};

export default async function StoryPage() {
  const content = await getSiteContent("story");

  return (
    <main className="bg-[var(--color-ivory)]">
      {/* Editorial Header */}
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:px-6 lg:px-8 sm:pt-24 sm:pb-16">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-6 bg-[var(--color-oxblood)]" />
          <p className="font-serif text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--color-oxblood)]">
            {content.eyebrow || "HERITAGE & CRAFT ARCHIVE"}
          </p>
          <span className="h-px w-6 bg-[var(--color-oxblood)]" />
        </div>

        <h1 className="mt-5 font-serif-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-normal uppercase leading-[1.08] tracking-[0.03em] text-[var(--color-oxblood)]">
          {content.title || "Rooted in Pochampally"}
        </h1>

        <p className="mt-2 font-telugu text-sm text-[var(--color-turmeric)]">
          పోచంపల్లి ఇక్కత్ చేనేత కథ
        </p>

        <p className="mx-auto mt-6 max-w-2xl font-serif text-[16px] leading-relaxed text-[var(--color-charcoal)]/85 sm:text-[17px]">
          {content.subtitle ||
            "The intersection of ancient mathematical resist-dyeing and contemporary Indian menswear."}
        </p>
      </section>

      {/* Featured Archival Photograph */}
      <section className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[16/9] w-full overflow-hidden border border-[var(--color-line)] bg-[var(--color-charcoal)] shadow-sm sm:aspect-[21/9]">
          <Image
            src="/images/heritage/artisan-loom.jpg"
            alt="Pochampally artisan hand-weaving on a wooden pit loom"
            fill
            priority
            sizes="100vw"
            className="object-cover grayscale contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 font-serif text-xs tracking-wider text-[#f5efe6]/90 sm:bottom-6 sm:left-6">
            Master Weaver at Pit Loom &bull; Pochampally Cluster, Telangana &bull; Traditional Tie-Dye Handloom
          </div>
        </div>
      </section>

      {/* Story Narrative */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="space-y-8 font-serif text-[16px] leading-[1.85] text-[var(--color-charcoal)]/90 sm:text-[17px]">
          <p className="first-letter:float-left first-letter:mr-3 first-letter:font-serif-display first-letter:text-6xl first-letter:leading-none first-letter:text-[var(--color-oxblood)]">
            {content.p1 ||
              "In Pochampally, Telangana, cloth is not simply woven; it is calculated, tie-dyed in bundles, and aligned down to the millimeter before a single shuttle moves across the loom. This intricate process gives Ikat its signature softened edges and distinctive structural depth."}
          </p>

          {/* Authentic Woven Motif Intermission */}
          <div className="my-12 flex items-center justify-center">
            <div className="relative h-20 w-16">
              <Image
                src="/images/heritage/ikat-motif.png"
                alt=""
                aria-hidden
                fill
                className="object-contain"
              />
            </div>
          </div>

          <blockquote className="my-10 border-l-2 border-[var(--color-oxblood)] py-3 pl-6 bg-[var(--color-parchment)]">
            <p className="font-serif-display text-xl italic text-[var(--color-oxblood)] sm:text-2xl">
              &ldquo;{content.quote || "The beauty of handwoven Ikat lies in its slight human irregularities — proof that every thread was placed by deliberate human touch."}&rdquo;
            </p>
          </blockquote>

          <p>
            {content.p2 ||
              "NAADE was founded to translate this extraordinary GI-tagged handloom craft into modern, wearable silhouettes. Rather than treating Ikat as costume fabric or occasion-only attire, we build structured jackets, relaxed shirts, and tailored layers that belong in the modern wardrobe."}
          </p>
          <p>
            {content.p3 ||
              "Every garment begins in family-owned pit loom studios across Telangana. By working directly with master dyers and weavers, NAADE honors the craftsmanship, ensures honest livelihoods, and keeps the tactile spirit of Indian handlooms alive."}
          </p>
        </div>

        {/* Brand Principles */}
        <div className="mt-16 grid gap-6 border-t border-[var(--color-line)] pt-12 sm:grid-cols-3">
          <div className="border border-[var(--color-line)] bg-[var(--color-parchment)] p-6 shadow-2xs">
            <h3 className="font-serif-display text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-oxblood)]">
              Authentic Geometry
            </h3>
            <p className="mt-2 font-serif text-xs leading-relaxed text-[var(--color-charcoal)]/75">
              Double and Single Ikat dyed yarn-by-yarn before setting up the loom.
            </p>
          </div>
          <div className="border border-[var(--color-line)] bg-[var(--color-parchment)] p-6 shadow-2xs">
            <h3 className="font-serif-display text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-oxblood)]">
              Direct Weavers
            </h3>
            <p className="mt-2 font-serif text-xs leading-relaxed text-[var(--color-charcoal)]/75">
              Fair compensations directly honoring the weaving families of Telangana.
            </p>
          </div>
          <div className="border border-[var(--color-line)] bg-[var(--color-parchment)] p-6 shadow-2xs">
            <h3 className="font-serif-display text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-oxblood)]">
              Tailored Longevity
            </h3>
            <p className="mt-2 font-serif text-xs leading-relaxed text-[var(--color-charcoal)]/75">
              Menswear cut for enduring fit, modern utility, and timeless handloom prestige.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center border border-[var(--color-charcoal)] bg-[var(--color-charcoal)] px-8 py-4 font-serif text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ivory)] transition-all hover:border-[var(--color-oxblood)] hover:bg-[var(--color-oxblood)]"
          >
            Explore The Collection &rarr;
          </Link>
        </div>
      </section>
    </main>
  );
}
