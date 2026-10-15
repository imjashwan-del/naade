import { SectionHeading } from "@/components/SectionHeading";
import { getSiteContent } from "@/lib/site-content-db";

export default async function ShippingPage() {
  const content = await getSiteContent("shipping");
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <SectionHeading
        eyebrow={content.eyebrow || "ATELIER DISPATCH"}
        title={content.title || "Shipping & Delivery"}
      />
      <div className="mt-10 space-y-6 border border-[var(--color-line)] bg-[var(--color-parchment)] p-8 font-serif text-[15px] leading-relaxed text-[var(--color-charcoal)]/85 shadow-2xs">
        <div>
          <h3 className="font-serif-display text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-oxblood)]">
            Standard Orders
          </h3>
          <p className="mt-2 text-sm">
            {content.standard || "Standard size orders are dispatched within 3–5 business days across India from our Pochampally atelier."}
          </p>
        </div>

        <div className="border-t border-[var(--color-line)] pt-5">
          <h3 className="font-serif-display text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-oxblood)]">
            Made-to-Measure Garments
          </h3>
          <p className="mt-2 text-sm">
            {content.madeToMeasure || "Made-to-measure pieces are cut and tailored individually from individual cloth lengths and typically dispatch within 2–3 weeks."}
          </p>
        </div>

        <div className="border-t border-[var(--color-line)] pt-5">
          <h3 className="font-serif-display text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-oxblood)]">
            Complimentary Shipping
          </h3>
          <p className="mt-2 text-sm">
            {content.complimentary || "Complimentary insured delivery is available on all orders above ₹5,000 across all pin codes in India."}
          </p>
        </div>
      </div>
    </main>
  );
}
