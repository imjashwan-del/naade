import { SectionHeading } from "@/components/SectionHeading";
import { getSiteContent } from "@/lib/site-content-db";

export default async function ContactPage() {
  const content = await getSiteContent("contact");
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-10">
      <SectionHeading eyebrow={content.eyebrow} title={content.title} />
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-[var(--color-charcoal)]/75">
        <p>{content.intro}</p>
        <p className="text-[var(--color-charcoal)]">
          Email: {content.email}
          <br />
          Phone: {content.phone}
          <br />
          Studio: {content.studio}
        </p>
        <p>{content.response}</p>
      </div>
    </main>
  );
}
