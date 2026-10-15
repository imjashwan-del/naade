import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { getSiteContent } from "@/lib/site-content-db";

export default async function MadeToMeasurePage() {
  const content = await getSiteContent("made-to-measure");

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow={content.eyebrow || "BESPOKE ATELIER"}
            title={content.title || "Your Fit. Your NAADE."}
            copy={content.copy || "Selected NAADE pieces can be made using your exact measurements for a more personal fit. Simply choose 'Make It To My Measurements' on any eligible product page and provide your chest, waist, shoulder, sleeve, garment length and neck measurements in inches."}
          />
          <div className="mt-8 space-y-4 font-serif text-[15px] leading-relaxed text-[var(--color-charcoal)]/85">
            <p>
              {content.detailOne ||
                "Each made-to-measure garment is cut and finished individually from single handwoven lengths of cloth, so please allow additional production time compared to standard sizes."}
            </p>
            <p>
              {content.detailTwo ||
                "Measurements are stored securely with your order and shared directly with our master tailoring studio in Pochampally, Telangana."}
            </p>
          </div>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Link
              href="/shop"
              className="flex h-12 w-full sm:w-auto items-center justify-center border border-[var(--color-charcoal)] bg-[var(--color-charcoal)] px-8 font-serif text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ivory)] transition-all hover:border-[var(--color-oxblood)] hover:bg-[var(--color-oxblood)]"
            >
              {content.button || "Shop Made to Measure Pieces"} &rarr;
            </Link>
            <Link
              href="/size-guide"
              className="flex h-11 items-center justify-center font-serif text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]/75 underline underline-offset-4 hover:text-[var(--color-oxblood)]"
            >
              View Measurement Guide &rarr;
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/3] sm:aspect-[4/5] overflow-hidden border border-[var(--color-line)] bg-[var(--color-parchment)] shadow-2xs">
          <Image
            src="/images/heritage/artisan-loom.jpg"
            alt={content.imageAlt || "Tailoring NAADE Pochampally handloom garments"}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </main>
  );
}
