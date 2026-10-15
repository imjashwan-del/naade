import { SectionHeading } from "@/components/SectionHeading";
import { getSiteContent } from "@/lib/site-content-db";

export default async function ContactPage() {
  const content = await getSiteContent("contact");

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <SectionHeading
        eyebrow={content.eyebrow || "ATELIER DIRECT"}
        title={content.title || "Contact Our Studio"}
        copy={content.intro || "For bespoke measurements, orders, or weaving archive inquiries, please connect with our Pochampally studio."}
      />

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {/* Contact Info Card */}
        <div className="border border-[var(--color-line)] bg-[var(--color-parchment)] p-8 shadow-2xs">
          <p className="font-serif text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-oxblood)]">
            POCHAMPALLY STUDIO
          </p>
          <div className="mt-5 space-y-4 font-serif text-[15px] leading-relaxed text-[var(--color-charcoal)]">
            <div>
              <span className="block text-[11px] uppercase tracking-[0.14em] text-[var(--color-charcoal)]/60">
                Email
              </span>
              <a
                href={`mailto:${content.email || "hello@naade.in"}`}
                className="hover:text-[var(--color-oxblood)] underline underline-offset-4"
              >
                {content.email || "hello@naade.in"}
              </a>
            </div>

            <div>
              <span className="block text-[11px] uppercase tracking-[0.14em] text-[var(--color-charcoal)]/60">
                WhatsApp &amp; Phone
              </span>
              <a
                href="https://wa.me/918555909550"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--color-oxblood)] underline underline-offset-4"
              >
                {content.phone || "+91 8555909550"}
              </a>
            </div>

            <div>
              <span className="block text-[11px] uppercase tracking-[0.14em] text-[var(--color-charcoal)]/60">
                Atelier Location
              </span>
              <p>{content.studio || "Pochampally, Yadadri Bhuvanagiri District, Telangana 508284, India"}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-[var(--color-line)] pt-4 font-serif text-xs text-[var(--color-charcoal)]/70">
            {content.response || "Our studio artisans and tailoring team respond within one business day."}
          </div>
        </div>

        {/* Direct WhatsApp Concierge Card */}
        <div className="flex flex-col justify-between border border-[var(--color-line)] bg-[var(--color-cotton)]/40 p-8 shadow-2xs">
          <div>
            <p className="font-serif text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-oxblood)]">
              DIRECT WHATSAPP CONCIERGE
            </p>
            <h3 className="mt-2 font-serif-display text-xl text-[var(--color-charcoal)]">
              Connect Directly with Our Weaver Studio
            </h3>
            <p className="mt-4 font-serif text-sm leading-relaxed text-[var(--color-charcoal)]/80">
              Need assistance measuring chest, shoulder, or length for a made-to-measure jacket? Or prefer ordering directly via WhatsApp UPI? Reach out to our team instantly.
            </p>
          </div>

          <div className="mt-8">
            <a
              href="https://wa.me/918555909550"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-full sm:w-auto sm:inline-flex items-center justify-center border border-[var(--color-charcoal)] bg-[var(--color-charcoal)] px-8 font-serif text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ivory)] transition-all hover:border-[var(--color-oxblood)] hover:bg-[var(--color-oxblood)]"
            >
              Message on WhatsApp &rarr;
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
