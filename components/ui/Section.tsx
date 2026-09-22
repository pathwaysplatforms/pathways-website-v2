import type { ElementType, ReactNode } from "react";

type SectionProps = {
  id?: string;
  children: ReactNode;
  /** Semantic element. Defaults to <section>. */
  as?: ElementType;
  /**
   * Background band. "accent" also sets the text colour to white, because
   * ink on the accent blue fails contrast — never override that.
   */
  bg?: "bg" | "paper" | "accent";
  /** "default" is 128px desktop / 64px mobile. "flush" removes it. */
  pad?: "default" | "flush";
  /** Draws the 2px ink rule along the top edge of the block. */
  topRule?: boolean;
  /** Lay the inner container out as the 12/4 column grid. */
  grid?: boolean;
  /** Extra classes for the OUTER element. Never re-specify padding here. */
  className?: string;
  /** Extra classes for the inner container. Never re-specify width here. */
  innerClassName?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

const BG: Record<NonNullable<SectionProps["bg"]>, string> = {
  // Transparent, NOT bg-pw-bg. <body> already paints --pw-bg, and an opaque
  // white here would sit inside the z-2 content wrapper and hide the fixed
  // GridOverlay underneath it. The paper and accent bands are opaque on
  // purpose: a coloured block is meant to interrupt the grid.
  bg: "",
  paper: "bg-pw-paper",
  accent: "bg-pw-accent text-pw-bg",
};

const PAD: Record<NonNullable<SectionProps["pad"]>, string> = {
  default: "py-16 md:py-32",
  flush: "py-0",
};

/**
 * Section owns ALL vertical rhythm, the outer margins and the column grid.
 * Every block composes it. Nothing else sets py-*, max-w-* or the grid at the
 * page level — if you want to, change this file instead.
 *
 * overflow-x is clipped per section so Display type may crop off the right
 * viewport edge on purpose without the page ever scrolling sideways.
 */
export function Section({
  id,
  children,
  as: Tag = "section",
  bg = "bg",
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
    topRule ? "border-t-2 border-pw-ink" : "",
    className,
  ].join(" ");

  return (
    <Tag id={id} className={outer} {...aria}>
      <div className={`pw-shell ${grid ? "pw-grid" : ""} ${innerClassName}`}>
        {children}
      </div>
    </Tag>
  );
}
