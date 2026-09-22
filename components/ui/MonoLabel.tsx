import type { ElementType, ReactNode } from "react";

type MonoLabelProps = {
  children: ReactNode;
  as?: ElementType;
  tone?: "faint" | "ink" | "signal" | "invert";
  id?: string;
  className?: string;
};

const TONE: Record<NonNullable<MonoLabelProps["tone"]>, string> = {
  faint: "",
  ink: "!text-ed-ink",
  signal: "!text-ed-signal",
  invert: "!text-ed-paper/60",
};

/**
 * The mono caption: 11px, uppercase, wide-tracked. Used for labels,
 * datelines, axis ticks and plate captions — never for reading copy.
 */
export function MonoLabel({
  children,
  as: Tag = "span",
  tone = "faint",
  id,
  className = "",
}: MonoLabelProps) {
  return (
    <Tag id={id} className={`ed-label ${TONE[tone]} ${className}`}>
      {children}
    </Tag>
  );
}
