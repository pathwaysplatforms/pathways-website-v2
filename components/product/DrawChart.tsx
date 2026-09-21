import type { DrawPoint } from "@/lib/fixtures";
import { DRAW_SERIES } from "@/lib/fixtures";

type DrawChartProps = {
  series?: readonly DrawPoint[];
  className?: string;
};

/* Chart geometry, in viewBox units. The viewBox height equals the rendered
   pixel height, so the y axis maps 1:1 and the tick labels can sit on the
   same coordinates. */
const VIEW_W = 520;
const VIEW_H = 160;
const PLOT_LEFT = 8;
const PLOT_RIGHT = 512;
const PLOT_TOP = 12;
const PLOT_BOTTOM = 148;
const AXIS_X = 1;
const AXIS_Y = 159;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "2025-10-08" → "Oct 2025". Parsed as text: no Date, no timezone drift. */
function monthYear(iso: string): string {
  const [year, month] = iso.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/**
 * CRS cutoff across recent general rounds. Hand-rolled SVG: one accent
 * polyline, hairline axes, no fill, no grid, no dots, no tooltip, no
 * animation. The only marker is the accent point on the latest draw.
 */
export function DrawChart({
  series = DRAW_SERIES,
  className = "",
}: DrawChartProps) {
  const cutoffs = series.map((point) => point.cutoff);
  const min = Math.min(...cutoffs);
  const max = Math.max(...cutoffs);
  const span = max - min || 1;
  const steps = Math.max(1, series.length - 1);

  const coords = series.map((point, index) => {
    const x = PLOT_LEFT + (index * (PLOT_RIGHT - PLOT_LEFT)) / steps;
    const y =
      PLOT_BOTTOM - ((point.cutoff - min) / span) * (PLOT_BOTTOM - PLOT_TOP);
    return { x, y };
  });

  const path = coords
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");

  const last = coords[coords.length - 1];
  const first = series[0];
  const latest = series[series.length - 1];

  const label = `Line chart: CRS cutoff across ${series.length} general draws, from ${first.cutoff} in ${monthYear(first.date)} to ${latest.cutoff} in ${monthYear(latest.date)}.`;

  return (
    <figure className={`w-full ${className}`}>
      <figcaption className="pw-eyebrow">CRS cutoff — general draws</figcaption>

      <div className="mt-4 flex items-start gap-2">
        <div className="relative h-40 w-9 shrink-0">
          <span
            className="pw-figure absolute right-0 -translate-y-1/2 text-[11px] leading-none text-pw-text-dim"
            style={{ top: PLOT_TOP }}
          >
            {max}
          </span>
          <span
            className="pw-figure absolute right-0 -translate-y-1/2 text-[11px] leading-none text-pw-text-dim"
            style={{ top: PLOT_BOTTOM }}
          >
            {min}
          </span>
        </div>

        <svg
          role="img"
          aria-label={label}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          className="h-40 w-full"
        >
          <path
            d={`M ${AXIS_X} ${PLOT_TOP - 6} L ${AXIS_X} ${AXIS_Y} L ${VIEW_W - AXIS_X} ${AXIS_Y}`}
            fill="none"
            stroke="var(--pw-hairline)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={path}
            fill="none"
            stroke="var(--pw-accent)"
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={`M ${last.x} ${last.y} L ${last.x} ${last.y}`}
            stroke="var(--pw-accent)"
            strokeWidth={4}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="pw-figure mt-2 flex justify-between pl-11 text-[11px] leading-none text-pw-text-dim">
        <span>{monthYear(first.date)}</span>
        <span>{monthYear(latest.date)}</span>
      </div>
    </figure>
  );
}
