import type { ElementType, ReactNode } from "react";

type MonoLabelProps = {
  children: ReactNode;
  as?: ElementType;
  /**
   * "ink" and "dim" engrave into a light material; "dark" and "invert" emboss
   * out of a dark one. Picking the wrong pair is what makes a surface read as
   * flat, so match the tone to the material underneath.
   */
  tone?: "ink" | "dim" | "accent" | "dark" | "invert";
  id?: string;
  className?: string;
};

const TONE: Record<NonNullable<MonoLabelProps["tone"]>, string> = {
  ink: "sk-label",
  dim: "sk-label opacity-75",
  accent: "sk-label text-pw-accent",
  dark: "sk-label sk-label-dark",
  invert: "sk-label sk-label-dark text-white/85",
};

/**
 * The engraved label: 11px, uppercase, wide-tracked, with a 1px light edge
 * beneath it so it reads as stamped into the surface rather than printed on
 * top of it.
 */
export function MonoLabel({
  children,
  as: Tag = "span",
  tone = "ink",
  id,
  className = "",
}: MonoLabelProps) {
  return (
    <Tag id={id} className={`${TONE[tone]} ${className}`}>
      {children}
    </Tag>
  );
}
