import type { ReactNode } from "react";

import { MonoLabel } from "@/components/ui/MonoLabel";

type FrameProps = {
  children: ReactNode;
  /** Caption on the left of the plate's head rule. */
  label?: string;
  /**
   * Caption on the right. Every plate showing a figure passes
   * "Example profile" here — illustrative numbers are never presented as
   * real thresholds.
   */
  note?: string;
  className?: string;
  bodyClassName?: string;
};

/**
 * A plate: a product screen reproduced in the page the way a figure is
 * reproduced in an article. Hairline border, captioned head, flat white
 * stock. No shadow, no radius beyond 2px, nothing floating.
 */
export function Frame({
  children,
  label,
  note,
  className = "",
  bodyClassName = "",
}: FrameProps) {
  const hasCaption = label !== undefined || note !== undefined;

  return (
    <figure className={`ed-plate ${className}`}>
      {hasCaption ? (
        <figcaption className="ed-plate-caption">
          {label !== undefined ? <MonoLabel>{label}</MonoLabel> : <span />}
          {note !== undefined ? (
            <MonoLabel tone="signal">{note}</MonoLabel>
          ) : null}
        </figcaption>
      ) : null}
      <div className={`p-5 md:p-7 ${bodyClassName}`}>{children}</div>
    </figure>
  );
}
