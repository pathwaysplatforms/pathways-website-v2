import { Frame } from "@/components/ui/Frame";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Rule } from "@/components/ui/Rule";
import type { Lever } from "@/lib/fixtures";
import { EXAMPLE_PROFILE, MISSION_CONTROL } from "@/lib/fixtures";
import { LeverRow } from "@/components/product/LeverRow";

export type MissionControlData = {
  scoreLabel: string;
  score: number;
  referenceLabel: string;
  reference: number;
  levers: readonly Lever[];
};

type MissionControlCardProps = {
  data?: MissionControlData;
  /** Lifts the pane clear of the page. Used once, in the hero. */
  floating?: boolean;
  className?: string;
};

/** Where a value sits on the track, as a percentage. */
function position(value: number, score: number, reference: number): number {
  const floor = Math.min(score, reference) - 55;
  const ceiling = Math.max(score, reference) + 25;
  return Math.max(4, Math.min(96, ((value - floor) / (ceiling - floor)) * 100));
}

/**
 * The standing panel: the score lit inside a dark well, the distance to the
 * reference on a recessed track, and the actions beneath.
 */
export function MissionControlCard({
  data = MISSION_CONTROL,
  floating = false,
  className = "",
}: MissionControlCardProps) {
  const gap = data.score - data.reference;
  const fill = position(data.score, data.score, data.reference);
  const mark = position(data.reference, data.score, data.reference);

  return (
    <Frame
      variant={floating ? "float" : "card"}
      label="Mission control"
      note={EXAMPLE_PROFILE}
      dot="green"
      className={className}
      bodyClassName="!p-0"
    >
      <div className="p-5 md:p-6">
        {/* Primary readout, lit in its own well. */}
        <div className="nx-well-dark flex items-end justify-between gap-4 px-5 py-4">
          <div>
            <MonoLabel tone="dark" className="block">
              {data.scoreLabel}
            </MonoLabel>
            <p className="nx-readout nx-lit mt-2 text-[44px] leading-none">
              {data.score}
            </p>
          </div>
          <div className="text-right">
            <MonoLabel tone="dark" className="block">
              Gap
            </MonoLabel>
            <p className="nx-readout mt-2 text-[24px] leading-none text-white/80">
              {gap > 0 ? `+${gap}` : gap}
            </p>
          </div>
        </div>

        {/* Track: the score as a lit bar, the reference as a tick. */}
        <div className="mt-5">
          <div className="nx-well relative h-2.5 w-full !rounded-full">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#7AA2FF_0%,#4F7DF3_100%)] shadow-[0_0_14px_rgba(79,125,243,0.65),inset_0_1px_0_rgba(255,255,255,0.45)]"
              style={{ width: `${fill}%` }}
            />
            <span
              aria-hidden="true"
              className="absolute top-1/2 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-nx-ink/35"
              style={{ left: `${mark}%` }}
            />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <MonoLabel>{data.referenceLabel}</MonoLabel>
            <span className="nx-readout text-[13px] text-nx-ink-soft">
              {data.reference}
            </span>
          </div>
        </div>
      </div>

      <Rule />

      <div className="px-5 py-1 md:px-6">
        <ul>
          {data.levers.map((lever, index) => (
            <li key={lever.id}>
              <LeverRow
                lever={lever}
                tone={index === 0 ? "accent" : "ink"}
                divider={index < data.levers.length - 1}
              />
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}
