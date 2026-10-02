export function Badge({ children, tone = "dark" }: { children: string; tone?: "dark" | "light" }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
        tone === "dark"
          ? "bg-[var(--color-charcoal)] text-[var(--color-ivory)]"
          : "bg-[var(--color-ivory)] text-[var(--color-charcoal)] border border-[var(--color-charcoal)]/20"
      }`}
    >
      {children}
    </span>
  );
}
