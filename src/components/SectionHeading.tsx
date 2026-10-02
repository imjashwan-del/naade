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
          className={`ikat-diamonds text-[var(--color-maroon)] mb-3 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span />
          <span />
          <span />
        </div>
      ) : null}
      <h2 className="font-serif-display text-[clamp(1.8rem,4vw,2.75rem)] leading-[1.1] text-[var(--color-charcoal)]">
        {title}
      </h2>
      {copy ? (
        <p
          className={`mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--color-charcoal)]/70 ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {copy}
        </p>
      ) : null}
    </div>
  );
}
