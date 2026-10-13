import { getSiteContent } from "@/lib/site-content-db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Frequently Asked Questions — NAADE Handloom Fashion",
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
      {/* Header */}
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-10 text-center sm:px-6 lg:px-8 sm:pt-24 sm:pb-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--color-maroon)]">
          {content.eyebrow}
        </p>
        <h1 className="mt-4 font-serif-display text-[clamp(2.2rem,4.5vw,3.5rem)] text-[var(--color-charcoal)]">
          {content.title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-[var(--color-charcoal)]/75">
          {content.subtitle}
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
                <h3 className="font-serif-display text-lg text-[var(--color-charcoal)] transition-colors group-hover:text-[var(--color-maroon)] sm:text-xl">
                  {faq.q}
                </h3>
                <span className="shrink-0 text-xl font-light text-[var(--color-charcoal)]/50 transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="mt-4 pr-6 text-[15px] leading-relaxed text-[var(--color-charcoal)]/80">
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>

        {/* Contact fallback */}
        <div className="mt-14 rounded-sm border border-[var(--color-line)] bg-[var(--color-offwhite)]/60 p-8 text-center">
          <h4 className="font-serif-display text-xl text-[var(--color-charcoal)]">
            Have a personal question regarding fit or cloth?
          </h4>
          <p className="mt-2 text-sm text-[var(--color-charcoal)]/70">
            Our atelier team in Pochampally is available to answer questions on sizing, custom measurements, and orders.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="border border-[var(--color-charcoal)] bg-[var(--color-charcoal)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)] hover:bg-black"
            >
              Contact Studio
            </Link>
            <a
              href="https://wa.me/918555909550"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[var(--color-charcoal)]/30 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)] hover:bg-black/5"
            >
              Message on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
