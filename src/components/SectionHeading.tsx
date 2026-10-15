export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow ? (
        <div
          className={`flex items-center gap-2 text-[var(--color-oxblood)] mb-3 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="inline-block h-1.5 w-1.5 rotate-45 bg-[var(--color-oxblood)]" />
          <p className="font-serif text-[11px] font-semibold uppercase tracking-[0.24em]">
            {eyebrow}
          </p>
          <span className="inline-block h-1.5 w-1.5 rotate-45 bg-[var(--color-oxblood)]" />
        </div>
      ) : null}
      <h2 className="font-serif-display text-[clamp(1.9rem,4vw,2.85rem)] font-normal uppercase tracking-[0.04em] text-[var(--color-charcoal)] leading-[1.08]">
        {title}
      </h2>
      {copy ? (
        <p
          className={`mt-4 max-w-xl font-serif text-[15px] leading-relaxed text-[var(--color-charcoal)]/80 ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {copy}
        </p>
      ) : null}
    </div>
  );
}
