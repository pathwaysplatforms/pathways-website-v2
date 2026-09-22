import type { ReactNode } from "react";

import { MonoLabel } from "@/components/ui/MonoLabel";
import { Numeral } from "@/components/ui/Numeral";
import { Section } from "@/components/ui/Section";
import { EXAMPLE_PROFILE, type Specimen as SpecimenData } from "@/lib/fixtures";

type SpecimenProps = {
  specimen: SpecimenData;
  mock: ReactNode;
  /** Alternates down the run so no two neighbouring blocks share a surface. */
  bg?: "paper" | "sunk";
};

/** Desktop column spans per composition. Mobile always stacks on 4 columns. */
const SPAN: Record<
  SpecimenData["layout"],
  { text: string; mock: string; order: string }
> = {
  "text-mock": {
    text: "col-span-4 md:col-span-5",
    mock: "col-span-4 md:col-span-7",
    order: "",
  },
  "mock-text": {
    text: "col-span-4 md:col-span-4 md:order-1",
    mock: "col-span-4 md:col-span-8 md:order-2",
    order: "md:[&>*:first-child]:order-2",
  },
  stacked: {
    text: "col-span-4 md:col-span-12",
    mock: "col-span-4 md:col-span-12",
    order: "",
  },
};

/**
 * One specimen block: a numbered plate, the claim, one sentence, and the
 * product enclosure it refers to.
 *
 * DOM order is always text-then-mock so the reading order on a phone and in a
 * screen reader matches the page; "mock-text" only reorders visually.
 */
export function Specimen({ specimen, mock, bg = "paper" }: SpecimenProps) {
  const span = SPAN[specimen.layout];
  const isStacked = specimen.layout === "stacked";

  return (
    <Section
      id={`specimen-${specimen.id}`}
      bg={bg}
      topRule={bg === "paper"}
      grid
      innerClassName="items-center gap-y-10"
      aria-labelledby={`specimen-${specimen.id}-heading`}
    >
      <div className={`${span.text} ${isStacked ? "max-w-[46ch]" : ""}`}>
        <div className="flex items-center gap-4">
          <Numeral value={specimen.numeral} />
          <span className="flex flex-col gap-1">
            <MonoLabel>{specimen.label}</MonoLabel>
            {specimen.headlineIsExample ? (
              <MonoLabel tone="dim" className="!text-[10px]">
                {EXAMPLE_PROFILE}
              </MonoLabel>
            ) : null}
          </span>
        </div>

        <h2
          id={`specimen-${specimen.id}-heading`}
          className="sk-heading mt-6"
        >
          {specimen.headline}
        </h2>

        {specimen.caption !== undefined ? (
          <p className="mt-3">
            <MonoLabel tone="dim">{specimen.caption}</MonoLabel>
          </p>
        ) : null}

        <p className="sk-body mt-4">{specimen.body}</p>
      </div>

      <div className={span.mock}>{mock}</div>
    </Section>
  );
}
