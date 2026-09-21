import type { ElementType, ReactNode } from "react";

type SectionProps = {
  /** Anchor id — PathLine observes these. */
  id?: string;
  children: ReactNode;
  /** Semantic element. Defaults to <section>. */
  as?: ElementType;
  /**
   * "content" (default) caps the inner column at 1120px.
   * "shell" caps at 1440px, for edge-to-edge layouts like the tour.
   * "prose" caps at 720px, for legal and long-form copy.
   */
  width?: "content" | "shell" | "prose";
  /**
   * Vertical rhythm. "default" is the contract's 120px desktop / 64px mobile.
   * "closing" is the 200px block reserved for the final CTA.
   * "flush" removes vertical padding for strips that sit against a neighbour.
   */
  pad?: "default" | "closing" | "flush";
  /** Extra classes for the OUTER element only. Never re-specify padding here. */
  className?: string;
  /** Extra classes for the inner container. Never re-specify max-width here. */
  innerClassName?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

const WIDTH: Record<NonNullable<SectionProps["width"]>, string> = {
  content: "max-w-pw-content",
  shell: "max-w-pw-shell",
  prose: "max-w-pw-prose",
};

const PAD: Record<NonNullable<SectionProps["pad"]>, string> = {
  default: "py-16 lg:py-30",
  closing: "py-30 lg:py-50",
  flush: "py-0",
};

/**
 * Section owns ALL vertical padding and container widths on this site.
 * Every other section composes it. Nothing else sets py-* or max-w-* at the
 * page level — if you find yourself wanting to, change this file instead.
 */
export function Section({
  id,
  children,
  as: Tag = "section",
  width = "content",
  pad = "default",
  className = "",
  innerClassName = "",
  ...aria
}: SectionProps) {
  return (
    <Tag id={id} className={`px-6 lg:px-10 ${PAD[pad]} ${className}`} {...aria}>
      <div className={`mx-auto w-full ${WIDTH[width]} ${innerClassName}`}>
        {children}
      </div>
    </Tag>
  );
}
