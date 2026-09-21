import type { ReactNode } from "react";

type StickyFrameProps = {
  children: ReactNode;
  /** Extra classes for the card element. */
  className?: string;
};

/**
 * The card the tour visuals sit in: hairline border, page background,
 * the single permitted elevation.
 *
 * It is deliberately dumb — it knows nothing about tour steps, active
 * state, or what is being rendered inside it. Positioning (sticky or not)
 * is the caller's job; this component only draws the frame.
 */
export function StickyFrame({ children, className = "" }: StickyFrameProps) {
  return (
    <div
      className={`rounded-lg border border-pw-hairline bg-pw-bg p-5 lg:p-8 ${className}`}
      style={{ boxShadow: "var(--pw-shadow-raised)" }}
    >
      {children}
    </div>
  );
}
