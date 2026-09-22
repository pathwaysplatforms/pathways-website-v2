import { Frame } from "@/components/ui/Frame";
import { MonoLabel } from "@/components/ui/MonoLabel";
import type { DrawPoint } from "@/lib/fixtures";
import { DRAW_SERIES, EXAMPLE_PROFILE } from "@/lib/fixtures";

type DrawChartProps = {
  series?: readonly DrawPoint[];
  className?: string;
};

/* Plot geometry, in viewBox units. */
const VIEW_W = 560;
const VIEW_H = 220;
const PAD_L = 44;
const PAD_R = 14;
const PAD_T = 16;
const PAD_B = 30;

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
 * CRS cutoff across recent general rounds, plotted on an instrument screen:
 * a dark well, etched gridlines, a lit trace with a glow, a soft wash beneath
 * it, and glass beads marking the last three rounds.
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
      VIEW_H - PAD_B -
      ((point.cutoff - min) / span) * (VIEW_H - PAD_T - PAD_B),
  }));

  const line = coords
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");

  const area =
    `${line} L ${coords[coords.length - 1].x} ${VIEW_H - PAD_B}` +
    ` L ${coords[0].x} ${VIEW_H - PAD_B} Z`;

  const first = series[0];
  const latest = series[series.length - 1];
  const markers = coords.slice(-3);

  const gridValues = [max, Math.round((max + min) / 2), min];

  const label = `Line chart: CRS cutoff across ${series.length} general draws, from ${first.cutoff} in ${monthYear(first.date)} to ${latest.cutoff} in ${monthYear(latest.date)}.`;

  return (
    <Frame
      label="CRS cutoff, general draws"
      note={EXAMPLE_PROFILE}
      className={className}
    >
      <div className="nx-well-dark p-3">
        <svg
          role="img"
          aria-label={label}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-auto w-full"
        >
          <defs>
            <linearGradient id="draw-wash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7AA2FF" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#7AA2FF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="draw-trace" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7FB0F5" />
              <stop offset="100%" stopColor="#4C86E8" />
            </linearGradient>
          </defs>

          {/* Etched gridlines and axis figures. */}
          {gridValues.map((value) => {
            const y =
              VIEW_H - PAD_B - ((value - min) / span) * (VIEW_H - PAD_T - PAD_B);
            return (
              <g key={value}>
                <line
                  x1={PAD_L}
                  y1={y}
                  x2={VIEW_W - PAD_R}
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={1}
                />
                <text
                  x={PAD_L - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="nx-readout"
                  fontSize="11"
                  fill="rgba(174,198,255,0.6)"
                >
                  {value}
                </text>
              </g>
            );
          })}

          <path d={area} fill="url(#draw-wash)" />

          <path
            d={line}
            fill="none"
            stroke="url(#draw-trace)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(122,162,255,0.8))" }}
          />

          {/* Glass beads on the last three rounds. */}
          {markers.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r={5}
                fill="#4F7DF3"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth={1.5}
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
              />
              <circle
                cx={point.x - 1.2}
                cy={point.y - 1.6}
                r={1.5}
                fill="rgba(255,255,255,0.8)"
              />
            </g>
          ))}

          <text
            x={PAD_L}
            y={VIEW_H - 8}
            className="nx-readout"
            fontSize="11"
            fill="rgba(174,198,255,0.45)"
          >
            {monthYear(first.date)}
          </text>
          <text
            x={VIEW_W - PAD_R}
            y={VIEW_H - 8}
            textAnchor="end"
            className="nx-readout"
            fontSize="11"
            fill="rgba(174,198,255,0.45)"
          >
            {monthYear(latest.date)}
          </text>
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <MonoLabel tone="dim">Last {series.length} general rounds</MonoLabel>
        <span className="nx-readout text-[13px] text-nx-accent">
          {latest.cutoff}
        </span>
      </div>
    </Frame>
  );
}
