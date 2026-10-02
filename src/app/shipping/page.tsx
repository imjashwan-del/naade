import { SectionHeading } from "@/components/SectionHeading";
import { getSiteContent } from "@/lib/site-content-db";

export default async function ShippingPage() {
  const content = await getSiteContent("shipping");
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-10">
      <SectionHeading eyebrow={content.eyebrow} title={content.title} />
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-[var(--color-charcoal)]/75">
        <p>{content.standard}</p>
        <p>{content.madeToMeasure}</p>
        <p>{content.complimentary}</p>
      </div>
    </main>
  );
}
