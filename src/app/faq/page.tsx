import { getSiteContent } from "@/lib/site-content-db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Frequently Asked Questions — NAADE Pochampally Handlooms",
  description:
    "Find answers about NAADE's Pochampally Ikat garments, made-to-measure sizing, ordering, care, and delivery across India.",
};

export default async function FaqPage() {
  const content = await getSiteContent("faq");

  const faqs = [
    { q: content.q1, a: content.a1 },
    { q: content.q2, a: content.a2 },
    { q: content.q3, a: content.a3 },
    { q: content.q4, a: content.a4 },
    { q: content.q5, a: content.a5 },
    { q: content.q6, a: content.a6 },
  ].filter((item) => item.q && item.a);

  return (
    <main className="bg-[var(--color-ivory)]">
      {/* Editorial Header */}
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-10 text-center sm:px-6 lg:px-8 sm:pt-24 sm:pb-14">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-6 bg-[var(--color-oxblood)]" />
          <p className="font-serif text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--color-oxblood)]">
            {content.eyebrow || "ATELIER ASSISTANCE"}
          </p>
          <span className="h-px w-6 bg-[var(--color-oxblood)]" />
        </div>

        <h1 className="mt-4 font-serif-display text-[clamp(2.2rem,4.5vw,3.5rem)] font-normal uppercase leading-[1.1] tracking-[0.03em] text-[var(--color-oxblood)]">
          {content.title || "Frequently Asked Questions"}
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-serif text-[15px] leading-relaxed text-[var(--color-charcoal)]/80">
          {content.subtitle || "Clear answers regarding our Pochampally handloom craft, bespoke sizing, ordering process, and shipping."}
        </p>
      </section>

      {/* Accordion FAQ list */}
      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 sm:pb-28">
        <div className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group py-6 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left">
                <h3 className="font-serif-display text-lg text-[var(--color-charcoal)] transition-colors group-hover:text-[var(--color-oxblood)] sm:text-xl">
                  {faq.q}
                </h3>
                <span className="shrink-0 font-serif text-xl font-light text-[var(--color-oxblood)] transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="mt-4 pr-6 font-serif text-[15px] leading-relaxed text-[var(--color-charcoal)]/85">
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>

        {/* Contact fallback */}
        <div className="mt-14 border border-[var(--color-line)] bg-[var(--color-parchment)] p-8 text-center shadow-2xs">
          <h4 className="font-serif-display text-xl uppercase tracking-[0.06em] text-[var(--color-charcoal)]">
            Have a personal question regarding fit or cloth?
          </h4>
          <p className="mt-2 font-serif text-sm text-[var(--color-charcoal)]/75">
            Our atelier team in Pochampally is available to answer questions on sizing, custom measurements, and orders.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="border border-[var(--color-charcoal)] bg-[var(--color-charcoal)] px-6 py-3 font-serif text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ivory)] hover:bg-[var(--color-oxblood)]"
            >
              Contact Studio
            </Link>
            <a
              href="https://wa.me/918555909550"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[var(--color-line)] bg-white px-6 py-3 font-serif text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-charcoal)] hover:border-[var(--color-charcoal)]"
            >
              Message on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
