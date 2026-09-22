type RuleProps = {
  orientation?: "horizontal" | "vertical";
  /** "light" grooves into a pale material, "dark" into slate or enamel. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * A milled groove, not a line: one dark pixel with one light pixel beneath
 * it, so the divider reads as a channel cut into the surface. On a dark
 * material the order flips.
 */
export function Rule({
  orientation = "horizontal",
  tone = "light",
  className = "",
}: RuleProps) {
  const base = tone === "light" ? "sk-groove" : "sk-groove-dark";
  const axis =
    orientation === "horizontal"
      ? "w-full"
      : "h-auto w-[2px] self-stretch rotate-180 [writing-mode:vertical-lr]";

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`${base} ${axis} ${className}`}
    />
  );
}
