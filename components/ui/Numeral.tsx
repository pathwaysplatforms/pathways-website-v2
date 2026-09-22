type NumeralProps = {
  value: string;
  /** "glass" is a pale pane; "accent" is the lit one. */
  variant?: "glass" | "accent";
  className?: string;
};

/**
 * The specimen number, on its own small pane. Set in mono so it reads as an
 * index rather than a heading.
 */
export function Numeral({
  value,
  variant = "glass",
  className = "",
}: NumeralProps) {
  const surface =
    variant === "accent"
      ? "nx-chip-on"
      : "nx-card-flat text-nx-ink-faint";

  return (
    <span
      aria-hidden="true"
      className={[
        surface,
        "nx-readout inline-flex h-10 items-center justify-center px-3.5",
        "text-[14px] !rounded-full",
        className,
      ].join(" ")}
    >
      {value}
    </span>
  );
}
