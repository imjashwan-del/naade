export function Badge({
  children,
  tone = "oxblood",
}: {
  children: string;
  tone?: "oxblood" | "dark" | "light";
}) {
  let toneClass = "bg-[var(--color-oxblood)] text-[#f5efe6] border border-[#742226]";

  if (tone === "dark") {
    toneClass = "bg-[var(--color-charcoal)] text-[var(--color-ivory)] border border-[var(--color-charcoal)]";
  } else if (tone === "light") {
    toneClass = "bg-[var(--color-ivory)] text-[var(--color-charcoal)] border border-[var(--color-line)]";
  }

  return (
    <span
      className={`inline-block px-2.5 py-0.5 font-serif text-[9px] font-semibold uppercase tracking-[0.2em] shadow-xs ${toneClass}`}
    >
      {children}
    </span>
  );
}
