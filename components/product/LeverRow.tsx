import { Frame } from "@/components/ui/Frame";
import { MonoLabel } from "@/components/ui/MonoLabel";
import type { Lever } from "@/lib/fixtures";
import { EXAMPLE_PROFILE, MISSION_CONTROL_LEVERS } from "@/lib/fixtures";

type LeverRowProps = {
  /** A single next-best-action row. Defaults to the first staged lever. */
  lever?: Lever;
  /** 1-based position, rendered as a two-digit mono index. */
  index?: number;
  /** "accent" marks the single highlighted figure in a mock. */
  tone?: "ink" | "accent";
  /** Hairline divider below the row. The last row in a list passes false. */
  divider?: boolean;
  className?: string;
};

/** "+18" / "-9". Never a bare number — the sign is the point. */
function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : `${delta}`;
}

/** "1" → "01". The index is a label, not a count. */
function formatIndex(index: number): string {
  return index < 10 ? `0${index}` : `${index}`;
}

/**
 * One row of the next-action list: a mono index, what the person does, a
 * short mono qualifier, and the modelled CRS movement.
 *
 * Divider is a 1px hairline — the 2px rule belongs to the outside of the
 * Frame, never to a row inside it.
 */
export function LeverRow({
  lever = MISSION_CONTROL_LEVERS[0],
  index,
  tone = "ink",
  divider = true,
  className = "",
}: LeverRowProps) {
  return (
    <div
      className={[
        "flex items-start justify-between gap-4 py-4",
        divider ? "border-b border-pw-hairline" : "",
        className,
      ].join(" ")}
    >
      <div className="flex min-w-0 gap-4">
        {index !== undefined ? (
          <MonoLabel tone="dim" className="shrink-0 pt-1">
            {formatIndex(index)}
          </MonoLabel>
        ) : null}
        <div className="min-w-0">
          <p className="text-[15px] leading-snug text-pw-ink">{lever.label}</p>
          <MonoLabel as="p" tone="dim" className="mt-2 block">
            {lever.note}
          </MonoLabel>
        </div>
      </div>
      <p
        className={`pw-num shrink-0 text-[18px] ${
          tone === "accent" ? "text-pw-accent" : "text-pw-ink"
        }`}
      >
        {formatDelta(lever.delta)}
      </p>
    </div>
  );
}

type LeverListProps = {
  levers?: readonly Lever[];
  className?: string;
};

/**
 * The next-action list on its own, as specimen 04 shows it. The first row
 * carries the one accent figure in the mock; the rest are ink.
 */
export function LeverList({
  levers = MISSION_CONTROL_LEVERS,
  className = "",
}: LeverListProps) {
  return (
    <Frame label="Next actions" note={EXAMPLE_PROFILE} className={className}>
      <ul>
        {levers.map((lever, position) => (
          <li key={lever.id}>
            <LeverRow
              lever={lever}
              index={position + 1}
              tone={position === 0 ? "accent" : "ink"}
              divider={position < levers.length - 1}
              className={position === 0 ? "pt-0" : ""}
            />
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-pw-hairline pt-4 text-[13px] leading-snug text-pw-ink-dim">
        Each figure is what the action would change about this file.
      </p>
    </Frame>
  );
}
