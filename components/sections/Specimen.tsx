import type { ReactNode } from "react";

import { MonoLabel } from "@/components/ui/MonoLabel";
import { Numeral } from "@/components/ui/Numeral";
import { Section } from "@/components/ui/Section";
import type { Specimen as SpecimenData, SpecimenLayout } from "@/lib/fixtures";
import { EXAMPLE_PROFILE } from "@/lib/fixtures";

type SpecimenProps = {
  specimen: SpecimenData;
  /**
   * The product mock. It supplies its own Frame — every component in
   * components/product wraps itself so it can pass the EXAMPLE_PROFILE note
   * into the Frame header beside its own label.
   */
  mock: ReactNode;
  /** Alternates down the run. Supplied by Specimens, never chosen here. */
  bg?: "bg" | "paper";
};

/**
 * Column spans, desktop only. Below 768px the grid is four columns wide and
 * every child takes all four, so the block stacks with no extra rules.
 *
 *   text-mock  text 5 / mock 7
 *   mock-text  mock 8 / text 4, mock first on the desktop row
 *   stacked    text 12 / mock 12
 *
 * DOM order is always text then mock, so the reading order on a phone and for
 * a screen reader is the same everywhere; "mock-text" only reorders visually.
 */
const SPANS: Record<SpecimenLayout, { text: string; mock: string }> = {
  "text-mock": {
    text: "col-span-4 md:col-span-5",
    mock: "col-span-4 md:col-span-7",
  },
  "mock-text": {
    text: "col-span-4 md:order-2",
    mock: "col-span-4 md:col-span-8 md:order-1",
  },
  stacked: {
    text: "col-span-4 md:col-span-12",
    mock: "col-span-4 md:col-span-12",
  },
};

/**
 * One specimen block: a full-width band with a 2px ink top rule, an outlined
 * numeral and mono label at the top left, the headline, one sentence of body,
 * and the product mock in its Frame.
 *
 * "stacked" gets the headline at Display size, capped at 14ch so it wraps
 * into a full-bleed block of type rather than cropping off the right edge.
 * The side-by-side layouts use Heading, which fits their narrower column.
 */
export function Specimen({ specimen, mock, bg = "bg" }: SpecimenProps) {
  const spans = SPANS[specimen.layout];
  const isStacked = specimen.layout === "stacked";
  const headingId = `specimen-${specimen.id}-heading`;

  return (
    <Section
      id={`specimen-${specimen.id}`}
      bg={bg}
      topRule
      grid
      aria-labelledby={headingId}
      innerClassName="gap-y-10 md:gap-y-14"
    >
      <header className="col-span-4 flex items-end gap-4 md:col-span-12">
        <Numeral value={specimen.numeral} />
        <MonoLabel tone="dim" className="mb-2">
          {specimen.label}
        </MonoLabel>
      </header>

      <div className={spans.text}>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-3">
          <h2
            id={headingId}
            className={isStacked ? "pw-display max-w-[14ch]" : "pw-heading"}
          >
            {specimen.headline}
          </h2>
          {/* The headline carries a figure from the example profile, not from
              a published source. Say so next to it, not only in the Frame. */}
          {specimen.headlineIsExample ? (
            <MonoLabel tone="dim" className="border-2 border-pw-ink px-2 py-1.5">
              {EXAMPLE_PROFILE}
            </MonoLabel>
          ) : null}
        </div>

        {specimen.caption !== undefined ? (
          <MonoLabel as="p" tone="dim" className="mt-5 block">
            {specimen.caption}
          </MonoLabel>
        ) : null}

        <p className="pw-body mt-6">{specimen.body}</p>
      </div>

      <div className={spans.mock}>{mock}</div>
    </Section>
  );
}
