import type { ElementType, ReactNode } from "react";

type SectionProps = {
  id?: string;
  children: ReactNode;
  as?: ElementType;
  /**
   * "canvas" — the page's own ambient light shows through (default)
   * "dark"   — a deep indigo band with its own colour bloom
   * "accent" — the blue band
   */
  bg?: "canvas" | "dark" | "accent";
  pad?: "default" | "tight" | "flush";
  /** Hairline along the top edge of the band. */
  topRule?: boolean;
  grid?: boolean;
  className?: string;
  innerClassName?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

const BG: Record<NonNullable<SectionProps["bg"]>, string> = {
  canvas: "",
  dark: "nx-band-dark",
  accent: "nx-band-accent",
};

const PAD: Record<NonNullable<SectionProps["pad"]>, string> = {
  default: "py-20 md:py-32",
  tight: "py-12 md:py-20",
  flush: "py-0",
};

/**
 * Section owns the band: its material, its vertical rhythm and the shell
 * width. Bands are edge to edge; the rounding lives on the surfaces inside
 * them, never on the band itself.
 */
export function Section({
  id,
  children,
  as: Tag = "section",
  bg = "canvas",
  pad = "default",
  topRule = false,
  grid = false,
  className = "",
  innerClassName = "",
  ...aria
}: SectionProps) {
  const outer = ["relative overflow-x-clip", BG[bg], PAD[pad], className].join(
    " ",
  );

  const inner = [
    "nx-shell",
    grid ? "grid grid-cols-4 gap-x-5 md:grid-cols-12 md:gap-x-6" : "",
    innerClassName,
  ].join(" ");

  return (
    <Tag id={id} className={outer} {...aria}>
      {topRule ? (
        <div aria-hidden="true" className="nx-line absolute inset-x-0 top-0" />
      ) : null}
      <div className={inner}>{children}</div>
    </Tag>
  );
}
