"use client";

import { useEffect, useState, type ReactNode } from "react";
import { TOUR_STEPS, type TourStepId } from "@/lib/fixtures";
import { Section } from "@/components/ui/Section";
import { StickyFrame } from "./StickyFrame";
import { TourStep } from "./TourStep";

type TourSectionProps = {
  /**
   * One visual per tour step, keyed by TourStepId. Built by the page and
   * passed in — this component never imports product mocks itself.
   * Every entry is rendered once into the sticky frame (desktop) and once
   * inline above its copy block (stacked layout).
   */
  visuals: Record<TourStepId, ReactNode>;
};

/**
 * Band across the middle of the viewport. A copy block is "active" while it
 * intersects this band. No scroll listeners — IntersectionObserver only.
 */
const ACTIVE_BAND = "-45% 0px -45% 0px";

export function TourSection({ visuals }: TourSectionProps) {
  const [activeId, setActiveId] = useState<TourStepId>(TOUR_STEPS[0].id);

  useEffect(() => {
    const blocks = TOUR_STEPS.map((step) =>
      document.getElementById(step.anchor),
    ).filter((node): node is HTMLElement => node !== null);

    if (blocks.length === 0) return;

    // Anchors currently inside the band. When two overlap, the earliest
    // step in document order wins, so the sequence never runs backwards.
    const inBand = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            inBand.add(entry.target.id);
          } else {
            inBand.delete(entry.target.id);
          }
        }

        const next = TOUR_STEPS.find((step) => inBand.has(step.anchor));
        if (next) setActiveId(next.id);
      },
      { rootMargin: ACTIVE_BAND, threshold: 0 },
    );

    for (const block of blocks) observer.observe(block);

    return () => observer.disconnect();
  }, []);

  return (
    <Section id="tour" width="content" aria-label="Product tour">
      <div className="grid grid-cols-1 items-start gap-x-16 lg:grid-cols-2">
        {/* Left column: the scrolling copy. Below lg each block carries its
            own visual, rendered above the copy by TourStep. */}
        <div className="flex flex-col gap-y-20 lg:gap-y-56">
          {TOUR_STEPS.map((step) => (
            <TourStep
              key={step.id}
              step={step}
              id={step.anchor}
              visual={
                <div className="lg:hidden">
                  <StickyFrame>{visuals[step.id]}</StickyFrame>
                </div>
              }
            />
          ))}
        </div>

        {/* Right column: one frame, stuck and centred in the viewport, with
            all five visuals stacked inside it. Hidden below lg, where the
            per-step visuals above take over. */}
        <div className="sticky top-0 hidden h-screen self-start lg:block">
          <div className="flex h-full items-center">
            <StickyFrame className="w-full">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                {TOUR_STEPS.map((step) => {
                  const isActive = step.id === activeId;

                  return (
                    <div
                      key={step.id}
                      aria-hidden={!isActive}
                      className={`absolute inset-0 transition-opacity duration-300 ease-pw ${
                        isActive
                          ? "opacity-100"
                          : "pointer-events-none opacity-0"
                      }`}
                    >
                      {visuals[step.id]}
                    </div>
                  );
                })}
              </div>
            </StickyFrame>
          </div>
        </div>
      </div>
    </Section>
  );
}
