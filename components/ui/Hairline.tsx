type HairlineProps = {
  /** "horizontal" (default) spans width; "vertical" spans height. */
  orientation?: "horizontal" | "vertical";
  className?: string;
};

/**
 * The 1px divider. Always 1px, always solid, always --pw-hairline.
 * Never 2px. Never dashed.
 */
export function Hairline({
  orientation = "horizontal",
  className = "",
}: HairlineProps) {
  const axis =
    orientation === "horizontal"
      ? "h-px w-full border-t"
      : "w-px self-stretch border-l";

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`${axis} border-pw-hairline ${className}`}
    />
  );
}
