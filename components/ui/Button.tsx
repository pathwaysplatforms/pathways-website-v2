import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href: string;
  /** "primary" is blue enamel; "secondary" is the same button in bone. */
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  /** Optional glyph rendered to the right of the label. */
  trailing?: ReactNode;
  className?: string;
};

const VARIANT: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "sk-btn-primary",
  secondary: "sk-btn-secondary",
};

const SIZE: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "h-11 px-5 text-[14.5px]",
  lg: "h-[52px] px-7 text-[16px]",
};

/**
 * A real button: gradient face, 1px highlight along the top lip, contact and
 * ambient shadows beneath. Pressing it drops the face 1px and flips the
 * gradient so the light now falls on the bottom of a dished surface.
 *
 * All of that lives in .sk-btn-* in globals.css, so a button and a chip and a
 * plaque all agree about where the light is coming from.
 */
export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  trailing,
  className = "",
}: ButtonProps) {
  const isExternal = href.startsWith("http");

  const classes = [
    "sk-btn",
    VARIANT[variant],
    SIZE[size],
    className,
  ].join(" ");

  const content = (
    <>
      {children}
      {trailing ? (
        <span aria-hidden="true" className="-mr-0.5 flex items-center">
          {trailing}
        </span>
      ) : null}
    </>
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
