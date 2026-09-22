import type { ReactNode } from "react";

import { MonoLabel } from "@/components/ui/MonoLabel";
import { Numeral } from "@/components/ui/Numeral";
import { Section } from "@/components/ui/Section";
import { EXAMPLE_PROFILE, type Specimen as SpecimenData } from "@/lib/fixtures";

type SpecimenProps = {
  specimen: SpecimenData;
  mock: ReactNode;
  /** The leading specimen lights its numeral; the rest stay quiet. */
  lit?: boolean;
};

const SPAN: Record<SpecimenData["layout"], { text: string; mock: string }> = {
  "text-mock": {
    text: "col-span-4 md:col-span-5",
    mock: "col-span-4 md:col-span-7",
  },
  "mock-text": {
    text: "col-span-4 md:col-span-4 md:order-1",
    mock: "col-span-4 md:col-span-8 md:order-2",
  },
  stacked: {
    text: "col-span-4 md:col-span-12",
    mock: "col-span-4 md:col-span-12",
  },
};

/**
 * One specimen block: an index, the claim, one sentence, and the pane the
 * claim refers to.
 *
 * DOM order is always text-then-mock so reading order on a phone and in a
 * screen reader matches the page; "mock-text" only reorders visually.
 */
export function Specimen({ specimen, mock, lit = false }: SpecimenProps) {
  const span = SPAN[specimen.layout];
  const isStacked = specimen.layout === "stacked";

  return (
    <Section
      id={`specimen-${specimen.id}`}
      grid
      innerClassName="items-center gap-y-12"
      aria-labelledby={`specimen-${specimen.id}-heading`}
    >
      <div className={`${span.text} ${isStacked ? "max-w-[44ch]" : ""}`}>
        <div className="flex flex-wrap items-center gap-3">
          <Numeral value={specimen.numeral} variant={lit ? "accent" : "glass"} />
          <MonoLabel>{specimen.label}</MonoLabel>
          {specimen.headlineIsExample ? (
            <MonoLabel className="nx-card-flat !rounded-full px-2.5 py-1 !text-[10px]">
              {EXAMPLE_PROFILE}
            </MonoLabel>
          ) : null}
        </div>

        <h2 id={`specimen-${specimen.id}-heading`} className="nx-heading mt-6">
          {specimen.headline}
        </h2>

        {specimen.caption !== undefined ? (
          <p className="mt-3">
            <MonoLabel>{specimen.caption}</MonoLabel>
          </p>
        ) : null}

        <p className="nx-body mt-5">{specimen.body}</p>
      </div>

      <div className={span.mock}>{mock}</div>
    </Section>
  );
}
