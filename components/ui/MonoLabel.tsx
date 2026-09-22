import type { ElementType, ReactNode } from "react";

type MonoLabelProps = {
  children: ReactNode;
  /** Defaults to <span>. Pass "p" or "dt" where the semantics call for it. */
  as?: ElementType;
  /**
   * "ink" (default), "dim" for secondary captions, "accent" for an active
   * value, "invert" for white on an accent block.
   */
  tone?: "ink" | "dim" | "accent" | "invert";
  id?: string;
  className?: string;
};

const TONE: Record<NonNullable<MonoLabelProps["tone"]>, string> = {
  ink: "text-pw-ink",
  dim: "text-pw-ink-dim",
  accent: "text-pw-accent",
  invert: "text-pw-bg",
};

/**
 * JetBrains Mono, 12px / 500 / uppercase / 0.04em.
 *
 * Every label, caption, axis tick and data descriptor on this site is one of
 * these. It is NOT an eyebrow: it does not announce a section (numerals do
 * that), it names a piece of data.
 */
export function MonoLabel({
  children,
  as: Tag = "span",
  tone = "ink",
  id,
  className = "",
}: MonoLabelProps) {
  return (
    <Tag id={id} className={`pw-mono ${TONE[tone]} ${className}`}>
      {children}
    </Tag>
  );
}
