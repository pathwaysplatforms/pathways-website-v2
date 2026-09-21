import { Fragment } from "react";

import { Hairline } from "@/components/ui/Hairline";
import { Section } from "@/components/ui/Section";
import { formatRelativeTime } from "@/lib/draws";
import type { DrawSummary } from "@/lib/fixtures";

type Figure = {
  /** The accent value. Always short enough to hold one line at 375px. */
  value: string;
  /** Dim descriptor beneath it. */
  label: string;
};

function figures(summary: DrawSummary): readonly Figure[] {
  return [
    { value: String(summary.totalDraws), label: "draws since 2015" },
    { value: String(summary.pathwaysMapped), label: "pathways mapped" },
    { value: String(summary.drawTypes), label: "draw types" },
    { value: formatRelativeTime(summary.lastUpdatedIso), label: "last updated" },
  ];
}

/**
 * The thin strip directly beneath the hero. Presentation only — the page
 * fetches the summary and hands it down; this component never fetches.
 *
 * 2x2 at 375px, split by a horizontal hairline between the rows; 4-across with
 * vertical hairline dividers from 768px up. Each figure is its own <dl> so the
 * dividers remain valid siblings rather than stray children of a list.
 */
export function ProofBar({ summary }: { summary: DrawSummary }) {
  const items = figures(summary);

  return (
    <Section pad="flush" width="content" aria-label="Pathways data coverage">
      <div className="pw-hairline-border flex flex-wrap md:flex-nowrap">
        {items.map((item, index) => (
          <Fragment key={item.label}>
            {index === 2 ? <Hairline className="md:hidden" /> : null}
            {index > 0 ? (
              <Hairline orientation="vertical" className="hidden md:block" />
            ) : null}
            <dl className="w-1/2 px-5 py-5 md:w-auto md:flex-1 md:px-6">
              <dt className="pw-figure text-pw-accent text-[26px] leading-none">
                {item.value}
              </dt>
              <dd className="pw-body mt-2 text-[14px] leading-snug">
                {item.label}
              </dd>
            </dl>
          </Fragment>
        ))}
      </div>
    </Section>
  );
}
