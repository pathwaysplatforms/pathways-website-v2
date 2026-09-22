import { Frame } from "@/components/ui/Frame";
import { MonoLabel } from "@/components/ui/MonoLabel";
import type { Lever } from "@/lib/fixtures";
import { EXAMPLE_PROFILE, MISSION_CONTROL_LEVERS } from "@/lib/fixtures";

type LeverRowProps = {
  lever?: Lever;
  /** The leading row carries the signal colour; the rest stay in ink. */
  lead?: boolean;
  divider?: boolean;
  className?: string;
};

/** "+18" / "-9". Never a bare number — the sign is the point. */
function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : `${delta}`;
}

/** One action, set as a row in a table rather than as a card. */
export function LeverRow({
  lever = MISSION_CONTROL_LEVERS[0],
  lead = false,
  divider = true,
  className = "",
}: LeverRowProps) {
  return (
    <div
      className={[
        "flex items-baseline justify-between gap-6 px-5 py-4 md:px-6",
        divider ? "border-b border-ed-rule" : "",
        className,
      ].join(" ")}
    >
      <div className="min-w-0">
        <p className="text-[15.5px] leading-snug text-ed-ink">{lever.label}</p>
        <p className="mt-1 text-[13.5px] leading-snug text-ed-faint">
          {lever.note}
        </p>
      </div>
      <span
        className={`ed-num shrink-0 text-[16px] ${lead ? "text-ed-signal" : "text-ed-ink"}`}
      >
        {formatDelta(lever.delta)}
      </span>
    </div>
  );
}

type LeverListProps = {
  levers?: readonly Lever[];
  className?: string;
};

/** Specimen 04's plate: the actions lifted out of the standing plate. */
export function LeverList({
  levers = MISSION_CONTROL_LEVERS,
  className = "",
}: LeverListProps) {
  return (
    <Frame
      label="Next actions"
      note={EXAMPLE_PROFILE}
      className={className}
      bodyClassName="!p-0"
    >
      <ul>
        {levers.map((lever, index) => (
          <li key={lever.id}>
            <LeverRow lever={lever} lead={index === 0} />
          </li>
        ))}
      </ul>
      <p className="px-5 py-4 md:px-6">
        <MonoLabel>
          Each figure is what the action would change about this file
        </MonoLabel>
      </p>
    </Frame>
  );
}
