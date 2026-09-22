import { MonoLabel } from "@/components/ui/MonoLabel";
import { Rule } from "@/components/ui/Rule";
import { Section } from "@/components/ui/Section";
import { formatRelativeTime, splitRelativeTime } from "@/lib/draws";
import type { DrawSummary } from "@/lib/fixtures";

type Cell = {
  /** The figure, set at Display size in Urbanist 900. */
  value: string;
  /** Mono qualifier baseline-aligned beside the figure. "" when unused. */
  unit: string;
  /** Mono label underneath. .pw-mono uppercases it, so write it in sentence case. */
  label: string;
  /**
   * Per-cell inline padding. The grid has no column gap — the white rules have
   * to touch the cells they divide — so the breathing room is declared here,
   * and a cell sitting against a shell margin gets none on that side.
   *
   * Below 768px the row folds to 2x2, which puts cells 1 and 3 in the left
   * column and cells 2 and 4 in the right; the md: overrides restore the
   * one-row padding above that.
   */
  pad: string;
};

function buildCells(summary: DrawSummary): readonly [Cell, Cell, Cell, Cell] {
  const updated = splitRelativeTime(formatRelativeTime(summary.lastUpdatedIso));

  return [
    {
      value: String(summary.totalDraws),
      unit: "",
      label: "Draws since 2015",
      pad: "pr-4 md:pr-6",
    },
    {
      value: String(summary.pathwaysMapped),
      unit: "",
      label: "Pathways mapped",
      pad: "pl-4 md:pl-6 md:pr-6",
    },
    {
      value: String(summary.drawTypes),
      unit: "",
      label: "Draw types",
      pad: "pr-4 md:pl-6 md:pr-6",
    },
    {
      value: updated.value,
      unit: updated.unit,
      label: "Last updated",
      pad: "pl-4 md:pl-6",
    },
  ];
}

/**
 * The coverage band: four figures on full-bleed accent.
 *
 * NEVER FETCHES. app/page.tsx calls getDrawSummary() — which cannot throw —
 * and passes the result down, so this stays a pure render and the six-hour
 * revalidate window stays with the page that owns it.
 *
 * Colour: Section bg="accent" reverses the text to white. .pw-display sets
 * `color: var(--pw-ink)` of its own accord, so every figure re-states
 * text-pw-bg — ink on the accent blue fails contrast and is never allowed here.
 *
 * Layout: an explicit-track grid rather than a gap, because the 2px white
 * rules are content, not spacing.
 *   >=768px  1fr auto 1fr auto 1fr auto 1fr — one row, three vertical rules
 *   <768px   1fr auto 1fr                  — 2x2, the middle divide turning
 *                                            horizontal across both columns
 * The swap renders both a horizontal and a vertical rule for that middle
 * divide and hides whichever does not apply. Because the hidden one leaves
 * the flow entirely, the remaining children fall into the seven tracks
 * (desktop) or the three (mobile) unaided — no explicit grid placement.
 */
export function DataBand({ summary }: { summary: DrawSummary }) {
  const [first, second, third, fourth] = buildCells(summary);

  return (
    <Section bg="accent" pad="flush" aria-label="Data coverage">
      <dl className="m-0 grid grid-cols-[1fr_auto_1fr] md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
        <DataCell cell={first} />
        <Rule orientation="vertical" tone="invert" />
        <DataCell cell={second} />

        {/* The middle divide: horizontal while the band is 2x2... */}
        <Rule tone="invert" className="col-span-3 md:hidden" />
        {/* ...vertical once the four cells share one row. */}
        <Rule orientation="vertical" tone="invert" className="hidden md:block" />

        <DataCell cell={third} />
        <Rule orientation="vertical" tone="invert" />
        <DataCell cell={fourth} />
      </dl>
    </Section>
  );
}

/**
 * flex-col-reverse with <dt> FIRST in the DOM: a screen reader announces
 * "Draws since 2015: 419" in the order a <dl> requires, while the figure
 * paints above the label, which is the order the contract specifies.
 *
 * The figure is allowed to wrap. Display type may crop off the page edge, but
 * a figure may not, and a quarter-width cell on a 320px phone is narrower than
 * the widest string this band can hold.
 */
function DataCell({ cell }: { cell: Cell }) {
  return (
    <div
      className={`flex flex-col-reverse gap-3 py-10 md:gap-4 md:py-16 ${cell.pad}`}
    >
      <MonoLabel as="dt" tone="invert">
        {cell.label}
      </MonoLabel>
      <dd className="m-0 flex flex-wrap items-baseline gap-x-3">
        <span className="pw-display font-black break-words text-pw-bg">
          {cell.value}
        </span>
        {cell.unit !== "" ? (
          <MonoLabel tone="invert">{cell.unit}</MonoLabel>
        ) : null}
      </dd>
    </div>
  );
}
