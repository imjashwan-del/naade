import { SectionHeading } from "@/components/SectionHeading";
import { getSiteContent } from "@/lib/site-content-db";

export default async function SizeGuidePage() {
  const content = await getSiteContent("size-guide");
  const sizes = [
    {
      size: "S",
      chest: content.sChest,
      waist: content.sWaist,
      shoulder: content.sShoulder,
    },
    {
      size: "M",
      chest: content.mChest,
      waist: content.mWaist,
      shoulder: content.mShoulder,
    },
    {
      size: "L",
      chest: content.lChest,
      waist: content.lWaist,
      shoulder: content.lShoulder,
    },
    {
      size: "XL",
      chest: content.xlChest,
      waist: content.xlWaist,
      shoulder: content.xlShoulder,
    },
    {
      size: "XXL",
      chest: content.xxlChest,
      waist: content.xxlWaist,
      shoulder: content.xxlShoulder,
    },
  ];
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-10">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        copy={content.copy}
      />
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line)] text-left text-[11px] uppercase tracking-[0.1em] text-[var(--color-charcoal)]/50">
              <th className="py-3">{content.sizeLabel}</th>
              <th className="py-3">{content.chestLabel}</th>
              <th className="py-3">{content.waistLabel}</th>
              <th className="py-3">{content.shoulderLabel}</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((row) => (
              <tr
                key={row.size}
                className="border-b border-[var(--color-line)]"
              >
                <td className="py-3 font-medium">{row.size}</td>
                <td className="py-3">{row.chest}&quot;</td>
                <td className="py-3">{row.waist}&quot;</td>
                <td className="py-3">{row.shoulder}&quot;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
