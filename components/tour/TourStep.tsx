import type { ReactNode } from "react";
import type { TourStep as TourStepData } from "@/lib/fixtures";
import { Eyebrow } from "@/components/ui/Eyebrow";

type TourStepProps = {
  /** One entry from TOUR_STEPS. All copy comes from the fixture. */
  step: TourStepData;
  /**
   * DOM id for this copy block. Defaults to step.anchor, which is what
   * PathLine and the tour's IntersectionObserver look for.
   */
  id?: string;
  /**
   * Optional visual, rendered ABOVE the copy. Used for the stacked
   * (sub-1024px) layout, where the sticky column is hidden and each step
   * carries its own frame. The caller decides when it is visible.
   */
  visual?: ReactNode;
  className?: string;
};

/**
 * One copy block of the product tour: eyebrow, heading, two-sentence body.
 * Presentational and stateless — no client directive, no hooks.
 */
export function TourStep({
  step,
  id,
  visual,
  className = "",
}: TourStepProps) {
  const headingId = `${step.anchor}-heading`;

  return (
    <section
      id={id ?? step.anchor}
      aria-labelledby={headingId}
      className={className}
    >
      {visual ? <div className="mb-8">{visual}</div> : null}
      <Eyebrow>{step.eyebrow}</Eyebrow>
      <h2 id={headingId} className="pw-heading mt-4">
        {step.heading}
      </h2>
      <p className="pw-body mt-5">{step.body}</p>
    </section>
  );
}
