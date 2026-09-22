import type { ReactNode } from "react";

import { MonoLabel } from "@/components/ui/MonoLabel";

type FrameProps = {
  children: ReactNode;
  label?: string;
  /**
   * Right side of the header. Every mock showing a figure passes
   * "Example profile" here — illustrative numbers are never presented as
   * real thresholds.
   */
  note?: string;
  /**
   * "card"  — a pane of glass (default)
   * "float" — lifted clear of the page, for the hero
   */
  variant?: "card" | "float";
  /** A status dot in the header, for mocks depicting a live state. */
  dot?: "none" | "green" | "accent";
  className?: string;
  bodyClassName?: string;
};

/**
 * The pane every product mock sits in.
 *
 * The header is divided from the body by a fading hairline rather than a
 * groove — grooves are the retro idiom. Padding is generous; tight padding is
 * what makes a soft-shadow surface look like a cheap widget.
 */
export function Frame({
  children,
  label,
  note,
  variant = "card",
  dot = "none",
  className = "",
  bodyClassName = "",
}: FrameProps) {
  const hasHeader = label !== undefined || note !== undefined || dot !== "none";

  return (
    <div
      className={[
        variant === "float" ? "nx-float" : "nx-card",
        "overflow-hidden",
        className,
      ].join(" ")}
    >
      {hasHeader ? (
        <>
          <div className="flex items-center gap-2.5 px-5 pt-4 pb-3.5 md:px-6">
            {dot !== "none" ? (
              <span
                aria-hidden="true"
                className={`nx-dot shrink-0 ${dot === "accent" ? "nx-dot-accent" : ""}`}
              />
            ) : null}
            {label !== undefined ? <MonoLabel>{label}</MonoLabel> : null}
            {note !== undefined ? (
              <MonoLabel className="ml-auto opacity-70">{note}</MonoLabel>
            ) : null}
          </div>
          <div aria-hidden="true" className="nx-line" />
        </>
      ) : null}

      <div className={`relative p-5 md:p-6 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
