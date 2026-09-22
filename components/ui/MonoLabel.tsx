import type { ElementType, ReactNode } from "react";

type MonoLabelProps = {
  children: ReactNode;
  as?: ElementType;
  tone?: "ink" | "dim" | "accent" | "dark" | "invert";
  id?: string;
  className?: string;
};

const TONE: Record<NonNullable<MonoLabelProps["tone"]>, string> = {
  ink: "nx-label text-nx-ink-soft",
  dim: "nx-label",
  accent: "nx-label text-nx-accent",
  dark: "nx-label nx-label-dark",
  invert: "nx-label text-white/75",
};

/**
 * The small caption: 11.5px, uppercase, wide-tracked. Flat — no text shadow.
 * Depth in this system belongs to surfaces and light, never to type.
 */
export function MonoLabel({
  children,
  as: Tag = "span",
  tone = "dim",
  id,
  className = "",
}: MonoLabelProps) {
  return (
    <Tag id={id} className={`${TONE[tone]} ${className}`}>
      {children}
    </Tag>
  );
}
