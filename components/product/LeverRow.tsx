import { ChevronRight } from "lucide-react";

import { Frame } from "@/components/ui/Frame";
import type { Lever } from "@/lib/fixtures";
import { EXAMPLE_PROFILE, MISSION_CONTROL_LEVERS } from "@/lib/fixtures";

type LeverRowProps = {
  /** A single next-best-action row. Defaults to the first staged lever. */
  lever?: Lever;
  /** "accent" lights the delta; only the leading row gets it. */
  tone?: "ink" | "accent";
  /** Milled groove beneath the row. The last row in a list passes false. */
  divider?: boolean;
  className?: string;
};

/** "+18" / "-9". Never a bare number — the sign is the point. */
function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : `${delta}`;
}

/**
 * One action row. The delta sits in its own small well, so it reads as a
 * value the instrument is reporting rather than text someone typed.
 */
export function LeverRow({
  lever = MISSION_CONTROL_LEVERS[0],
  tone = "ink",
  divider = true,
  className = "",
}: LeverRowProps) {
  return (
    <>
      <div
        className={`flex items-center justify-between gap-4 py-3.5 ${className}`}
      >
        <div className="min-w-0">
          <p className="text-[14.5px] leading-snug font-medium text-pw-ink [text-shadow:0_1px_0_rgba(255,255,255,0.8)]">
            {lever.label}
          </p>
          <p className="mt-0.5 text-[12.5px] leading-snug text-pw-ink-faint">
            {lever.note}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={[
              "sk-well sk-readout px-2.5 py-1 text-[14px] leading-none",
              tone === "accent" ? "text-pw-accent" : "text-pw-ink-soft",
            ].join(" ")}
          >
            {formatDelta(lever.delta)}
          </span>
          <ChevronRight
            size={15}
            strokeWidth={2.5}
            aria-hidden="true"
            className="text-pw-ink-faint"
          />
        </div>
      </div>
      {divider ? <div aria-hidden="true" className="sk-groove" /> : null}
    </>
  );
}

type LeverListProps = {
  levers?: readonly Lever[];
  className?: string;
};

/** Specimen 04's mock: the actions lifted out of the standing panel. */
export function LeverList({
  levers = MISSION_CONTROL_LEVERS,
  className = "",
}: LeverListProps) {
  return (
    <Frame
      label="Next actions"
      note={EXAMPLE_PROFILE}
      className={className}
      bodyClassName="!py-2"
    >
      <ul>
        {levers.map((lever, index) => (
          <li key={lever.id}>
            <LeverRow
              lever={lever}
              tone={index === 0 ? "accent" : "ink"}
              divider={index < levers.length - 1}
            />
          </li>
        ))}
      </ul>
      <p className="mt-3 pt-3 text-[12.5px] leading-snug text-pw-ink-faint">
        Each figure is what the action would change about this file.
      </p>
    </Frame>
  );
}
