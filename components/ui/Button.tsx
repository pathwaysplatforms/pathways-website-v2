import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  trailing?: ReactNode;
  className?: string;
};

const VARIANT: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "nx-btn-primary",
  secondary: "nx-btn-secondary",
};

const SIZE: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "h-11 px-5 text-[14.5px]",
  lg: "h-[54px] px-8 text-[16px]",
};

/**
 * A pill with a coloured shadow. The lift on hover and the coloured glow
 * beneath are what carry the depth — not a bevel. Pressing it sinks the face
 * into its own inner shadow.
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
  const classes = ["nx-btn", VARIANT[variant], SIZE[size], className].join(" ");

  const content = (
    <>
      {children}
      {trailing ? (
        <span aria-hidden="true" className="-mr-1 flex items-center">
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
