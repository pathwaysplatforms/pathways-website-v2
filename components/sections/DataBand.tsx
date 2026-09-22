import { MonoLabel } from "@/components/ui/MonoLabel";
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
 * The coverage figures, set as type on the page rather than as tiles. The
 * rule above each figure is what binds it to its caption; there is no box.
 *
 * NEVER FETCHES. app/page.tsx calls getDrawSummary() — which cannot throw —
 * and passes the result down, so the six-hour revalidate window stays with
 * the page that owns it.
 */
export function DataBand({ summary }: { summary: DrawSummary }) {
  const cells = buildCells(summary);

  return (
    <Section bg="alt" pad="tight" rule="hair" aria-label="Data coverage">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-8">
        {cells.map((cell) => (
          <div key={cell.label} className="border-t border-ed-ink pt-4">
            <MonoLabel as="dt" className="block">
              {cell.label}
            </MonoLabel>
            <dd className="mt-3 flex items-baseline gap-2">
              <span className="ed-figure-num">{cell.value}</span>
              {cell.unit !== "" ? (
                <MonoLabel className="!text-ed-muted">{cell.unit}</MonoLabel>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
