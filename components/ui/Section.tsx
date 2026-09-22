import type { ElementType, ReactNode } from "react";

type SectionProps = {
  id?: string;
  children: ReactNode;
  as?: ElementType;
  /** "paper" (default), "alt" for a quiet tonal shift, "ink" for the one dark block. */
  bg?: "paper" | "alt" | "ink";
  pad?: "default" | "tight" | "flush";
  /** A rule along the top edge of the band. */
  rule?: "none" | "hair" | "ink";
  grid?: boolean;
  className?: string;
  innerClassName?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

const BG: Record<NonNullable<SectionProps["bg"]>, string> = {
  paper: "",
  alt: "bg-ed-paper-alt",
  ink: "bg-ed-ink text-ed-paper",
};

const PAD: Record<NonNullable<SectionProps["pad"]>, string> = {
  default: "py-16 md:py-24",
  tight: "py-10 md:py-14",
  flush: "py-0",
};

const RULE: Record<NonNullable<SectionProps["rule"]>, string> = {
  none: "",
  hair: "border-t border-ed-rule",
  ink: "border-t border-ed-ink",
};

/**
 * Section owns the band: its tone, its vertical rhythm, the shell width and
 * the grid. There are no cards in this system, so a band is defined by the
 * rule above it and the space around it.
 */
export function Section({
  id,
  children,
  as: Tag = "section",
  bg = "paper",
  pad = "default",
  rule = "none",
  grid = false,
  className = "",
  innerClassName = "",
  ...aria
}: SectionProps) {
  const outer = [
    "relative overflow-x-clip",
    BG[bg],
    PAD[pad],
    RULE[rule],
    className,
  ].join(" ");

  const inner = ["ed-shell", grid ? "ed-grid" : "", innerClassName].join(" ");

  return (
    <Tag id={id} className={outer} {...aria}>
      <div className={inner}>{children}</div>
    </Tag>
  );
}
