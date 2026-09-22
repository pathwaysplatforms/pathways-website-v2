import type { ReactNode } from "react";

import { MonoLabel } from "@/components/ui/MonoLabel";

type FrameProps = {
  children: ReactNode;
  /** Mono label in the frame's header bar, left side. */
  label?: string;
  /**
   * Mono label on the right of the header bar. Every product mock that shows
   * a number passes "EXAMPLE PROFILE" here — illustrative figures are never
   * presented as real thresholds.
   */
  note?: string;
  className?: string;
  /** Extra classes for the body area only. */
  bodyClassName?: string;
};

/**
 * The container every product mock sits in: white, 2px ink border, one hard
 * 6px shadow, no radius, no blur.
 *
 * The header bar is divided from the body by a 1px HAIRLINE, not a rule —
 * the 2px border is the outside of the component, everything within it is
 * thin. That contrast is the signature of the system.
 */
export function Frame({
  children,
  label,
  note,
  className = "",
  bodyClassName = "",
}: FrameProps) {
  const hasHeader = label !== undefined || note !== undefined;

  return (
    <div
      className={`bg-pw-bg border-2 border-pw-ink shadow-[var(--pw-shadow)] ${className}`}
    >
      {hasHeader ? (
        <div className="flex items-center justify-between gap-4 border-b border-pw-hairline px-4 py-3">
          {label !== undefined ? <MonoLabel>{label}</MonoLabel> : <span />}
          {note !== undefined ? <MonoLabel tone="dim">{note}</MonoLabel> : null}
        </div>
      ) : null}
      <div className={`p-4 md:p-6 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
