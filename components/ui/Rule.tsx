type RuleProps = {
  /** "horizontal" (default) spans width; "vertical" spans height. */
  orientation?: "horizontal" | "vertical";
  /**
   * "ink" (default) — 2px structural rule, var(--pw-rule).
   * "invert" — the same 2px rule in white, for use on an accent block.
   */
  tone?: "ink" | "invert";
  className?: string;
};

/**
 * The structural rule: 2px, solid, ink. This is what separates BLOCKS.
 *
 * Data inside a component is separated by a 1px hairline instead — write
 * that as `border-pw-hairline` on the element itself, not with this
 * component. Thick outside, thin inside.
 */
export function Rule({
  orientation = "horizontal",
  tone = "ink",
  className = "",
}: RuleProps) {
  const colour = tone === "ink" ? "border-pw-ink" : "border-pw-bg";

  const axis =
    orientation === "horizontal"
      ? "w-full border-t-2"
      : "self-stretch border-l-2";

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`${axis} ${colour} ${className}`}
    />
  );
}
