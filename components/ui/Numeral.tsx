type NumeralProps = {
  /** "01".."05". Always two digits — it is a specimen number, not a count. */
  value: string;
  /**
   * "outline" (default) — transparent fill, 2px ink stroke.
   * "badge" — solid ink square with the numeral reversed out, centred. The
   * only centred text on the entire site.
   */
  variant?: "outline" | "badge";
  className?: string;
};

/**
 * The section numeral. Replaces the uppercase eyebrow that sat above every
 * section in the previous design — this is what tells you where you are.
 */
export function Numeral({
  value,
  variant = "outline",
  className = "",
}: NumeralProps) {
  if (variant === "badge") {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex size-16 shrink-0 items-center justify-center bg-pw-ink text-pw-bg text-[22px] font-extrabold tracking-[-0.02em] ${className}`}
      >
        {value}
      </span>
    );
  }

  return (
    <span aria-hidden="true" className={`pw-numeral block ${className}`}>
      {value}
    </span>
  );
}
