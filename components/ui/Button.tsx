import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  /** Internal route or external URL. Renders <a> via next/link. */
  href: string;
  /**
   * "primary" — solid accent. The only accent-filled element on the site.
   * "quiet"   — hairline-bordered, text-coloured. For secondary destinations.
   */
  variant?: "primary" | "quiet";
  size?: "md" | "lg";
  className?: string;
};

const VARIANT: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-pw-accent text-pw-bg hover:opacity-90",
  quiet: "border border-pw-hairline text-pw-text hover:border-pw-text",
};

const SIZE: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-[17px]",
};

/**
 * The only button on this site. Accent fill is reserved for `primary`, which
 * should appear at most once per viewport (nav, hero, closing CTA).
 * Transition is opacity/border-colour only, on var(--pw-ease).
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
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold",
    "whitespace-nowrap tracking-[-0.01em] transition-[opacity,border-color]",
    "duration-200 ease-pw",
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
