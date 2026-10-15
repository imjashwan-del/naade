import { SectionHeading } from "@/components/SectionHeading";
import { getSiteContent } from "@/lib/site-content-db";

export default async function ReturnsPage() {
  const content = await getSiteContent("returns");
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <SectionHeading
        eyebrow={content.eyebrow || "ATELIER CARE"}
        title={content.title || "Returns & Exchanges"}
      />
      <div className="mt-10 space-y-6 border border-[var(--color-line)] bg-[var(--color-parchment)] p-8 font-serif text-[15px] leading-relaxed text-[var(--color-charcoal)]/85 shadow-2xs">
        <div>
          <h3 className="font-serif-display text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-oxblood)]">
            Standard Size Returns
          </h3>
          <p className="mt-2 text-sm">
            {content.standard || "Standard size pieces may be returned unworn, with original tags intact, within 7 days of delivery for an exchange or store credit."}
          </p>
        </div>

        <div className="border-t border-[var(--color-line)] pt-5">
          <h3 className="font-serif-display text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-oxblood)]">
            Made-to-Measure Garments
          </h3>
          <p className="mt-2 text-sm">
            {content.madeToMeasure || "Made-to-measure pieces are cut specifically to your individual proportions and are final sale, unless the garment arrives damaged during transit or with an atelier manufacturing defect."}
          </p>
        </div>

        <div className="border-t border-[var(--color-line)] pt-5">
          <h3 className="font-serif-display text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-oxblood)]">
            How to Request
          </h3>
          <p className="mt-2 text-sm">
            {content.instructions || "To initiate a return or exchange, please reach out to our studio via WhatsApp or email with your Order Reference Number."}
          </p>
        </div>
      </div>
    </main>
  );
}
