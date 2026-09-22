import { ChevronRight } from "lucide-react";

import { Frame } from "@/components/ui/Frame";
import { Rule } from "@/components/ui/Rule";
import type { Lever } from "@/lib/fixtures";
import { EXAMPLE_PROFILE, MISSION_CONTROL_LEVERS } from "@/lib/fixtures";

type LeverRowProps = {
  lever?: Lever;
  /** "accent" lights the delta; only the leading row gets it. */
  tone?: "ink" | "accent";
  divider?: boolean;
  className?: string;
};

/** "+18" / "-9". Never a bare number — the sign is the point. */
function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : `${delta}`;
}

/** One action row. The delta sits on its own small pill. */
export function LeverRow({
  lever = MISSION_CONTROL_LEVERS[0],
  tone = "ink",
  divider = true,
  className = "",
}: LeverRowProps) {
  return (
    <>
      <div
        className={`flex items-center justify-between gap-4 py-4 ${className}`}
      >
        <div className="min-w-0">
          <p className="text-[15px] leading-snug font-medium tracking-[-0.016em] text-nx-ink">
            {lever.label}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-nx-ink-faint">
            {lever.note}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={[
              "nx-chip nx-readout !px-3 !py-1.5 !text-[13px]",
              tone === "accent" ? "nx-chip-on" : "nx-chip-off",
            ].join(" ")}
          >
            {formatDelta(lever.delta)}
          </span>
          <ChevronRight
            size={16}
            strokeWidth={2.25}
            aria-hidden="true"
            className="text-nx-ink-faint"
          />
        </div>
      </div>
      {divider ? <Rule /> : null}
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
      bodyClassName="!py-1"
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
      <p className="pt-4 pb-3 text-[13px] leading-snug text-nx-ink-faint">
        Each figure is what the action would change about this file.
      </p>
    </Frame>
  );
}
