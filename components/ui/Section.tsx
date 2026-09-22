import type { ElementType, ReactNode } from "react";

type SectionProps = {
  id?: string;
  children: ReactNode;
  as?: ElementType;
  /**
   * The material the band is made of.
   *   "paper" — nothing; the document's own stock shows through (default)
   *   "sunk"  — a shallow recess milled into the paper, for alternation
   *   "slate" — dark brushed metal, for instrument readouts
   *   "accent"— the blue enamel block
   */
  bg?: "paper" | "sunk" | "slate" | "accent";
  pad?: "default" | "tight" | "flush";
  /** A milled groove along the top edge of the band. */
  topRule?: boolean;
  /** Lay the inner container out as a 12-column grid (4 below 768px). */
  grid?: boolean;
  className?: string;
  innerClassName?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

const BG: Record<NonNullable<SectionProps["bg"]>, string> = {
  paper: "",
  sunk: "sk-band-sunk",
  slate: "sk-band-slate",
  accent: "sk-band-accent",
};

const PAD: Record<NonNullable<SectionProps["pad"]>, string> = {
  default: "py-16 md:py-28",
  tight: "py-10 md:py-16",
  flush: "py-0",
};

/**
 * Section owns the band: its material, its vertical rhythm and the shell
 * width. Everything else composes it.
 */
export function Section({
  id,
  children,
  as: Tag = "section",
  bg = "paper",
  pad = "default",
  topRule = false,
  grid = false,
  className = "",
  innerClassName = "",
  ...aria
}: SectionProps) {
  const outer = [
    "relative overflow-x-clip",
    BG[bg],
    PAD[pad],
    className,
  ].join(" ");

  const inner = [
    "sk-shell",
    grid ? "grid grid-cols-4 gap-x-4 md:grid-cols-12 md:gap-x-6" : "",
    innerClassName,
  ].join(" ");

  return (
    <Tag id={id} className={outer} {...aria}>
      {topRule ? (
        <div
          aria-hidden="true"
          className="sk-groove absolute inset-x-0 top-0"
        />
      ) : null}
      <div className={inner}>{children}</div>
    </Tag>
  );
}
