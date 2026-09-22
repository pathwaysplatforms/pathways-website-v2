import { MonoLabel } from "@/components/ui/MonoLabel";
import { Rule } from "@/components/ui/Rule";
import { Section } from "@/components/ui/Section";
import { formatRelativeTime, splitRelativeTime } from "@/lib/draws";
import type { DrawSummary } from "@/lib/fixtures";

type Cell = { value: string; unit: string; label: string };

function buildCells(summary: DrawSummary): readonly Cell[] {
  const updated = splitRelativeTime(formatRelativeTime(summary.lastUpdatedIso));

  return [
    { value: String(summary.totalDraws), unit: "", label: "Draws since 2015" },
    { value: String(summary.pathwaysMapped), unit: "", label: "Pathways mapped" },
    { value: String(summary.drawTypes), unit: "", label: "Draw types" },
    { value: updated.value, unit: updated.unit, label: "Last updated" },
  ];
}

/**
 * The coverage band: a deep indigo field with its own colour bloom, carrying
 * four figures that are lit rather than printed.
 *
 * NEVER FETCHES. app/page.tsx calls getDrawSummary() — which cannot throw —
 * and passes the result down, so the six-hour revalidate window stays with
 * the page that owns it.
 */
export function DataBand({ summary }: { summary: DrawSummary }) {
  const cells = buildCells(summary);

  return (
    <Section bg="dark" pad="tight" aria-label="Data coverage">
      <dl className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-y-0">
        {cells.map((cell, index) => (
          <div
            key={cell.label}
            className="relative flex flex-col gap-3 md:px-8 md:first:pl-0 md:last:pr-0"
          >
            {index > 0 ? (
              <Rule
                orientation="vertical"
                tone="dark"
                className={`absolute inset-y-0 -left-4 md:left-0 ${
                  index === 2 ? "hidden md:block" : ""
                }`}
              />
            ) : null}

            <dd className="order-1 flex items-baseline gap-2">
              <span className="nx-readout nx-lit text-[clamp(34px,4vw,54px)] leading-none">
                {cell.value}
              </span>
              {cell.unit !== "" ? (
                <span className="nx-label nx-label-dark">{cell.unit}</span>
              ) : null}
            </dd>
            <MonoLabel as="dt" tone="dark" className="order-2 block">
              {cell.label}
            </MonoLabel>
          </div>
        ))}
      </dl>
    </Section>
  );
}
