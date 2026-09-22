import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href: string;
  /**
   * "primary" is the solid ink block; "secondary" is the hairline outline;
   * "link" is a text link with an arrow and an underline on hover.
   */
  variant?: "primary" | "secondary" | "link";
  size?: "md" | "lg";
  className?: string;
};

const SIZE: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "h-10 px-4",
  lg: "h-12 px-6",
};

/**
 * Solid ink, square to 2px, turning vermilion on hover. No gradient, no
 * shadow, no lift — the colour change is the whole interaction.
 */
export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
}: ButtonProps) {
  const isExternal = href.startsWith("http");

  const classes =
    variant === "link"
      ? `ed-link ${className}`
      : [
          "ed-btn",
          variant === "primary" ? "ed-btn-primary" : "ed-btn-secondary",
          SIZE[size],
          className,
        ].join(" ");

  const content =
    variant === "link" ? (
      <>
        {children}
        <span aria-hidden="true">&#8594;</span>
      </>
    ) : (
      children
    );

  if (isExternal) {
    return (
      <a href={href} className={classes} rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
