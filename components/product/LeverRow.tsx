import type { Lever } from "@/lib/fixtures";
import { MISSION_CONTROL_LEVERS } from "@/lib/fixtures";

type LeverRowProps = {
  /** A single next-best-action row. Defaults to the first staged lever. */
  lever?: Lever;
  className?: string;
};

/** "+18" / "-9". Never a bare number — the sign is the point. */
function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : `${delta}`;
}

/**
 * One row of Mission Control's next-best-action list: what the person does,
 * a short qualifier, and the expected CRS movement in accent.
 * Hairline bottom border — the parent clears it on the last row.
 */
export function LeverRow({
  lever = MISSION_CONTROL_LEVERS[0],
  className = "",
}: LeverRowProps) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 border-b border-pw-hairline py-3.5 ${className}`}
    >
      <div className="min-w-0">
        <p className="text-[14px] leading-snug text-pw-text">{lever.label}</p>
        <p className="mt-0.5 text-[12px] leading-snug text-pw-text-dim">
          {lever.note}
        </p>
      </div>
      <p className="pw-figure shrink-0 text-[15px] leading-none text-pw-accent">
        {formatDelta(lever.delta)}
      </p>
    </div>
  );
}
