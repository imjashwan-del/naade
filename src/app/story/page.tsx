import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content-db";
import { LinkButton } from "@/components/Button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Story — NAADE Pochampally Handlooms",
  description:
    "The story of NAADE and the weavers of Pochampally, Telangana. Traditional resist-dyeing meets contemporary menswear.",
};

export default async function StoryPage() {
  const content = await getSiteContent("story");

  return (
    <main className="bg-[var(--color-ivory)]">
      {/* Editorial Header */}
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:px-6 lg:px-8 sm:pt-24 sm:pb-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--color-maroon)]">
          {content.eyebrow}
        </p>
        <h1 className="mt-4 font-serif-display text-[clamp(2.4rem,5vw,3.75rem)] leading-[1.1] text-[var(--color-charcoal)]">
          {content.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-charcoal)]/80 sm:text-lg">
          {content.subtitle}
        </p>
      </section>

      {/* Featured Photograph */}
      <section className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-[var(--color-charcoal)] shadow-lg sm:aspect-[21/9]">
          <Image
            src={content.image}
            alt={content.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 text-xs tracking-wider text-[var(--color-ivory)]/75 sm:bottom-6 sm:left-6">
            Handloom Pit Looms • Pochampally Handloom Park Cluster
          </div>
        </div>
      </section>

      {/* Story Narrative */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="space-y-8 text-base leading-[1.8] text-[var(--color-charcoal)]/85 sm:text-[17px]">
          <p className="first-letter:float-left first-letter:mr-3 first-letter:font-serif-display first-letter:text-5xl first-letter:leading-none first-letter:text-[var(--color-maroon)]">
            {content.p1}
          </p>

          <blockquote className="my-10 border-l-2 border-[var(--color-maroon)] pl-6 py-2">
            <p className="font-serif-display text-xl italic text-[var(--color-charcoal)] sm:text-2xl">
              &ldquo;{content.quote}&rdquo;
            </p>
          </blockquote>

          <p>{content.p2}</p>
          <p>{content.p3}</p>
        </div>

        {/* Brand Principles */}
        <div className="mt-16 grid gap-6 border-t border-[var(--color-line)] pt-12 sm:grid-cols-3">
          <div className="border border-[var(--color-line)] bg-[var(--color-offwhite)]/50 p-6">
            <h3 className="font-serif-display text-base text-[var(--color-charcoal)]">
              Authentic Geometry
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-charcoal)]/70">
              Double and Single Ikat dyed yarn-by-yarn before setting up the loom.
            </p>
          </div>
          <div className="border border-[var(--color-line)] bg-[var(--color-offwhite)]/50 p-6">
            <h3 className="font-serif-display text-base text-[var(--color-charcoal)]">
              Direct Weavers
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-charcoal)]/70">
              Fair compensations directly honoring the artisans of Telangana.
            </p>
          </div>
          <div className="border border-[var(--color-line)] bg-[var(--color-offwhite)]/50 p-6">
            <h3 className="font-serif-display text-base text-[var(--color-charcoal)]">
              Tailored Longevity
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-charcoal)]/70">
              Clothing cut for enduring fit, modern utility, and timeless style.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <LinkButton href="/shop" variant="primary">
            Explore The Collection
          </LinkButton>
        </div>
      </section>
    </main>
  );
}
