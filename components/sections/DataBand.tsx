import { MonoLabel } from "@/components/ui/MonoLabel";
import { Section } from "@/components/ui/Section";
import { formatRelativeTime, splitRelativeTime } from "@/lib/draws";
import type { DrawSummary } from "@/lib/fixtures";

type Cell = {
  value: string;
  /** Mono qualifier beside the figure. "" when unused. */
  unit: string;
  label: string;
};

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
 * The coverage band, built as an instrument face: a slate chassis carrying
 * four recessed displays, each with its caption engraved into the metal above
 * it and its figure lit inside the well.
 *
 * NEVER FETCHES. app/page.tsx calls getDrawSummary() — which cannot throw —
 * and passes the result down, so the six-hour revalidate window stays with
 * the page that owns it.
 */
export function DataBand({ summary }: { summary: DrawSummary }) {
  const cells = buildCells(summary);

  return (
    <Section bg="slate" pad="tight" aria-label="Data coverage">
      <dl className="relative grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4 md:gap-x-10">
        {cells.map((cell, index) => (
          <div key={cell.label} className="relative">
            {/* Vertical groove between modules, as on a rack panel. */}
            {index > 0 ? (
              <span
                aria-hidden="true"
                className={[
                  "absolute top-1 bottom-1 -left-4 w-[2px] md:-left-5",
                  "bg-[linear-gradient(90deg,rgba(0,0,0,0.5)_0_1px,rgba(255,255,255,0.08)_1px_2px)]",
                  index === 2 ? "hidden md:block" : "",
                ].join(" ")}
              />
            ) : null}

            <MonoLabel as="dt" tone="dark" className="block">
              {cell.label}
            </MonoLabel>

            <dd className="sk-well-dark mt-2.5 flex items-baseline gap-2 px-3.5 py-2.5">
              <span className="sk-readout sk-readout-lit text-[clamp(30px,3.6vw,46px)] leading-none">
                {cell.value}
              </span>
              {cell.unit !== "" ? (
                <span className="sk-readout text-[11px] leading-none tracking-[0.08em] text-white/45 uppercase">
                  {cell.unit}
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
