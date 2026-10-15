import type { Measurements } from "@/lib/cart-types";

const FIELDS: { key: keyof Measurements; label: string }[] = [
  { key: "chest", label: "Chest" },
  { key: "waist", label: "Waist" },
  { key: "shoulder", label: "Shoulder" },
  { key: "sleeveLength", label: "Sleeve Length" },
  { key: "garmentLength", label: "Garment Length" },
  { key: "neck", label: "Neck" },
];

export function MeasurementForm({
  values,
  onChange,
  errors,
}: {
  values: Measurements;
  onChange: (key: keyof Measurements, value: string) => void;
  errors?: Partial<Record<keyof Measurements, string>>;
}) {
  return (
    <div className="border border-[var(--color-line)] bg-[var(--color-offwhite)] p-5">
      <p className="text-xs leading-relaxed text-[var(--color-charcoal)]/70">
        Please enter your measurements carefully. Made-to-measure pieces are created
        specifically for you.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-4">
        {FIELDS.map((field) => (
          <label key={field.key} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)]/70">
              {field.label}
            </span>
            <div className="flex items-center border border-[var(--color-charcoal)]/25 bg-white focus-within:border-[var(--color-charcoal)]">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={0.1}
                value={values[field.key]}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="w-full bg-transparent px-3 py-2.5 text-base sm:text-sm text-[var(--color-charcoal)] outline-none"
                aria-label={`${field.label} in inches`}
              />
              <span className="pr-3 text-[11px] uppercase text-[var(--color-charcoal)]/45">in</span>
            </div>
            {errors?.[field.key] ? (
              <span className="text-[11px] text-[var(--color-maroon)]">{errors[field.key]}</span>
            ) : null}
          </label>
        ))}
      </div>
    </div>
  );
}
