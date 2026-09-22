type NumeralProps = {
  /** "01".."05". A specimen number, not a count. */
  value: string;
  /**
   * "brass" — a stamped plaque (default)
   * "steel" — a machined disc, for darker surroundings
   */
  variant?: "brass" | "steel";
  className?: string;
};

/**
 * The specimen number, as a physical tag fixed to the block. Centred inside
 * its own plate — the one place centred text is right, because the plate is
 * the thing being centred in, not the page.
 */
export function Numeral({
  value,
  variant = "brass",
  className = "",
}: NumeralProps) {
  const surface =
    variant === "brass"
      ? "sk-brass"
      : "sk-metal text-pw-ink [text-shadow:0_1px_0_rgba(255,255,255,0.85)]";

  return (
    <span
      aria-hidden="true"
      className={[
        surface,
        "inline-flex h-12 w-12 shrink-0 items-center justify-center",
        "font-mono text-[17px] font-medium tabular-nums tracking-tight",
        className,
      ].join(" ")}
    >
      {value}
    </span>
  );
}
