import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { LinkButton } from "@/components/Button";
import { getSiteContent } from "@/lib/site-content-db";

export default async function MadeToMeasurePage() {
  const content = await getSiteContent("made-to-measure");
  return (
    <main className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            copy={content.copy}
          />
          <div className="mt-8 space-y-4 text-sm leading-relaxed text-[var(--color-charcoal)]/70">
            <p>{content.detailOne}</p>
            <p>{content.detailTwo}</p>
          </div>
          <div className="mt-8">
            <LinkButton href="/shop">{content.button}</LinkButton>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={content.image}
            alt={content.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </main>
  );
}
