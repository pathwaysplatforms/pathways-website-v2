type RuleProps = {
  orientation?: "horizontal" | "vertical";
  tone?: "hair" | "strong" | "ink" | "invert";
  className?: string;
};

const TONE: Record<NonNullable<RuleProps["tone"]>, string> = {
  hair: "border-ed-rule",
  strong: "border-ed-rule-strong",
  ink: "border-ed-ink",
  invert: "border-ed-paper/25",
};

/** A single hairline. The only divider in the system. */
export function Rule({
  orientation = "horizontal",
  tone = "hair",
  className = "",
}: RuleProps) {
  const axis =
    orientation === "horizontal"
      ? "w-full border-t"
      : "self-stretch border-l";

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`${axis} ${TONE[tone]} ${className}`}
    />
  );
}
