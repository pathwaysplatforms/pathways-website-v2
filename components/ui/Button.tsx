import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  /** Internal route or external URL. Renders <a> via next/link. */
  href: string;
  /**
   * "primary" — accent fill, white label.
   * "secondary" — white fill, ink label.
   * Both carry the same 2px ink border and the same hard shadow.
   */
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  className?: string;
};

const VARIANT: Record<NonNullable<ButtonProps["variant"]>, string> = {
  // Text on accent is always white — ink on this blue fails contrast.
  primary: "bg-pw-accent text-pw-bg hover:bg-pw-ink",
  secondary: "bg-pw-bg text-pw-ink hover:bg-pw-paper",
};

const SIZE: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "h-12 px-6 text-[13px]",
  lg: "h-14 px-8 text-[15px]",
};

/**
 * The only button on this site.
 *
 * Mechanical motion, 100ms linear (.pw-mech). Pressing it moves the element
 * 3px into its own shadow, which shrinks from --pw-shadow to --pw-shadow-sm
 * (.pw-press). No easing curve, no opacity fade, no scale.
 *
 * Focus ring comes from the global :focus-visible rule — 3px ink, 3px offset,
 * square. Do not re-specify it here.
 */
export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
}: ButtonProps) {
  const isExternal = href.startsWith("http");

  const classes = [
    "pw-mono pw-mech pw-press",
    "inline-flex items-center justify-center gap-3 whitespace-nowrap",
    "border-2 border-pw-ink",
    VARIANT[variant],
    SIZE[size],
    className,
  ].join(" ");

  if (isExternal) {
    return (
      <a href={href} className={classes} rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
