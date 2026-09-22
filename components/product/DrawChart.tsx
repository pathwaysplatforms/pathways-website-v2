import { Frame } from "@/components/ui/Frame";
import { MonoLabel } from "@/components/ui/MonoLabel";
import type { DrawPoint } from "@/lib/fixtures";
import { DRAW_SERIES, EXAMPLE_PROFILE } from "@/lib/fixtures";

type DrawChartProps = {
  series?: readonly DrawPoint[];
  className?: string;
};

/* Plot geometry, in viewBox units. */
const VIEW_W = 640;
const VIEW_H = 240;
const PAD_L = 42;
const PAD_R = 12;
const PAD_T = 14;
const PAD_B = 28;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "2025-10-08" to "Oct 2025". Parsed as text: no Date, no timezone drift. */
function monthYear(iso: string): string {
  const [year, month] = iso.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/**
 * CRS cutoff across recent general rounds, plotted the way a newspaper would
 * plot it: hairline axes, a thin ink trace, mono ticks, and the last three
 * rounds marked in the signal colour. No fill, no glow, no gridlines beyond
 * the two that carry a value.
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

  const coords = series.map((point, index) => ({
    x: PAD_L + (index * (VIEW_W - PAD_L - PAD_R)) / steps,
    y:
      VIEW_H - PAD_B - ((point.cutoff - min) / span) * (VIEW_H - PAD_T - PAD_B),
  }));

  const line = coords
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");

  const first = series[0];
  const latest = series[series.length - 1];
  const markers = coords.slice(-3);

  const label = `Line chart: CRS cutoff across ${series.length} general draws, from ${first.cutoff} in ${monthYear(first.date)} to ${latest.cutoff} in ${monthYear(latest.date)}.`;

  return (
    <Frame
      label="CRS cutoff, general draws"
      note={EXAMPLE_PROFILE}
      className={className}
    >
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-auto w-full"
      >
        {[max, min].map((value) => {
          const y =
            VIEW_H - PAD_B - ((value - min) / span) * (VIEW_H - PAD_T - PAD_B);
          return (
            <g key={value}>
              <line
                x1={PAD_L}
                y1={y}
                x2={VIEW_W - PAD_R}
                y2={y}
                stroke="var(--color-ed-rule)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={PAD_L - 10}
                y={y + 4}
                textAnchor="end"
                className="ed-num"
                fontSize="11"
                fill="var(--color-ed-faint)"
              >
                {value}
              </text>
            </g>
          );
        })}

        <path
          d={line}
          fill="none"
          stroke="var(--color-ed-ink)"
          strokeWidth={1.25}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {markers.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={3}
            fill="var(--color-ed-signal)"
          />
        ))}

        <text
          x={PAD_L}
          y={VIEW_H - 8}
          className="ed-num"
          fontSize="11"
          fill="var(--color-ed-faint)"
        >
          {monthYear(first.date)}
        </text>
        <text
          x={VIEW_W - PAD_R}
          y={VIEW_H - 8}
          textAnchor="end"
          className="ed-num"
          fontSize="11"
          fill="var(--color-ed-faint)"
        >
          {monthYear(latest.date)}
        </text>
      </svg>

      <div className="mt-4 flex items-baseline justify-between border-t border-ed-rule pt-4">
        <MonoLabel>Last {series.length} general rounds</MonoLabel>
        <span className="ed-num text-[13px] text-ed-signal">
          {latest.cutoff}
        </span>
      </div>
    </Frame>
  );
}
