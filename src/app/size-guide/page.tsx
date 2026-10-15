import { SectionHeading } from "@/components/SectionHeading";
import { getSiteContent } from "@/lib/site-content-db";
import Link from "next/link";

export default async function SizeGuidePage() {
  const content = await getSiteContent("size-guide");
  const sizes = [
    {
      size: "S",
      chest: content.sChest || "38",
      waist: content.sWaist || "34",
      shoulder: content.sShoulder || "17.5",
    },
    {
      size: "M",
      chest: content.mChest || "40",
      waist: content.mWaist || "36",
      shoulder: content.mShoulder || "18.0",
    },
    {
      size: "L",
      chest: content.lChest || "42",
      waist: content.lWaist || "38",
      shoulder: content.lShoulder || "18.5",
    },
    {
      size: "XL",
      chest: content.xlChest || "44",
      waist: content.xlWaist || "40",
      shoulder: content.xlShoulder || "19.0",
    },
    {
      size: "XXL",
      chest: content.xxlChest || "46",
      waist: content.xxlWaist || "42",
      shoulder: content.xxlShoulder || "19.5",
    },
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <SectionHeading
        eyebrow={content.eyebrow || "ATELIER PROPORTIONS"}
        title={content.title || "Standard Size & Fit Guide"}
        copy={content.copy || "All measurements are in inches. If you prefer bespoke tailoring to your specific proportions, select Made to Measure on any eligible product."}
      />

      <div className="mt-10 overflow-x-auto border border-[var(--color-line)] bg-[var(--color-parchment)] p-6 shadow-2xs">
        <table className="w-full min-w-[420px] border-collapse font-serif text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line)] text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-oxblood)]">
              <th className="py-3.5">{content.sizeLabel || "Standard Size"}</th>
              <th className="py-3.5">{content.chestLabel || "Chest"}</th>
              <th className="py-3.5">{content.waistLabel || "Waist"}</th>
              <th className="py-3.5">{content.shoulderLabel || "Shoulder"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {sizes.map((row) => (
              <tr key={row.size} className="hover:bg-[var(--color-cotton)]/40 transition-colors">
                <td className="py-3.5 font-bold text-[var(--color-charcoal)]">{row.size}</td>
                <td className="py-3.5 text-[var(--color-charcoal)]/85">{row.chest}&quot;</td>
                <td className="py-3.5 text-[var(--color-charcoal)]/85">{row.waist}&quot;</td>
                <td className="py-3.5 text-[var(--color-charcoal)]/85">{row.shoulder}&quot;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 border border-[var(--color-line)] bg-[var(--color-cotton)]/35 p-6 font-serif text-xs text-[var(--color-charcoal)]">
        <p className="font-semibold uppercase tracking-[0.14em] text-[var(--color-oxblood)]">
          Prefer Custom Measurements?
        </p>
        <p className="mt-1.5 leading-relaxed text-[var(--color-charcoal)]/85">
          We offer individual made-to-measure tailoring for all NAADE jackets at zero surcharge. Simply click &quot;Make It To My Measurements&quot; on the product page.
        </p>
        <div className="mt-4">
          <Link
            href="/made-to-measure"
            className="font-semibold underline underline-offset-4 hover:text-[var(--color-oxblood)]"
          >
            Learn more about Made to Measure &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
