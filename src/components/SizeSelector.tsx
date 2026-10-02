export function SizeSelector({
  sizes,
  selected,
  onSelect,
  disabled = false,
}: {
  sizes: string[];
  selected: string | null;
  onSelect: (size: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${disabled ? "pointer-events-none opacity-40" : ""}`}>
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onSelect(size)}
          aria-pressed={selected === size}
          className={`h-11 min-w-[44px] px-3 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
            selected === size
              ? "bg-[var(--color-charcoal)] text-[var(--color-ivory)]"
              : "border border-[var(--color-charcoal)]/30 text-[var(--color-charcoal)] hover:border-[var(--color-charcoal)]"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
