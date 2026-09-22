import type { ReactNode } from "react";

import { MonoLabel } from "@/components/ui/MonoLabel";
import { Numeral } from "@/components/ui/Numeral";
import { Section } from "@/components/ui/Section";
import { EXAMPLE_PROFILE, type Specimen as SpecimenData } from "@/lib/fixtures";

type SpecimenProps = {
  specimen: SpecimenData;
  mock: ReactNode;
};

/**
 * Column spans per composition. Uneven on purpose, with a column of air
 * between the text and the plate. Never 6/6.
 */
const SPAN: Record<SpecimenData["layout"], { text: string; mock: string }> = {
  "text-mock": {
    text: "col-span-4 md:col-span-4",
    mock: "col-span-4 md:col-span-7 md:col-start-6",
  },
  "mock-text": {
    text: "col-span-4 md:col-span-4 md:col-start-9 md:order-2",
    mock: "col-span-4 md:col-span-7 md:order-1",
  },
  stacked: {
    text: "col-span-4 md:col-span-7",
    mock: "col-span-4 md:col-span-12 md:mt-12",
  },
};

/**
 * One specimen: an index line, the claim, one sentence, and the plate the
 * claim refers to.
 *
 * DOM order is always text-then-plate so reading order on a phone and in a
 * screen reader matches the page; "mock-text" only reorders visually.
 */
export function Specimen({ specimen, mock }: SpecimenProps) {
  return (
    <Section
      id={`specimen-${specimen.id}`}
      grid
      rule="hair"
      innerClassName="items-start gap-y-10"
      aria-labelledby={`specimen-${specimen.id}-heading`}
    >
      <div className={SPAN[specimen.layout].text}>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <Numeral value={specimen.numeral} />
          <MonoLabel>{specimen.label}</MonoLabel>
          {specimen.headlineIsExample ? (
            <MonoLabel tone="signal">{EXAMPLE_PROFILE}</MonoLabel>
          ) : null}
        </div>

        <h2
          id={`specimen-${specimen.id}-heading`}
          className="ed-heading mt-6 max-w-[18ch]"
        >
          {specimen.headline}
        </h2>

        {specimen.caption !== undefined ? (
          <p className="mt-4">
            <MonoLabel>{specimen.caption}</MonoLabel>
          </p>
        ) : null}

        <p className="ed-body mt-5">{specimen.body}</p>
      </div>

      <div className={SPAN[specimen.layout].mock}>{mock}</div>
    </Section>
  );
}
