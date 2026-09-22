import { LeverRow } from "@/components/product/LeverRow";
import { Frame } from "@/components/ui/Frame";
import { MonoLabel } from "@/components/ui/MonoLabel";
import type { Lever } from "@/lib/fixtures";
import { EXAMPLE_PROFILE, MISSION_CONTROL } from "@/lib/fixtures";

export type MissionControlData = {
  scoreLabel: string;
  score: number;
  referenceLabel: string;
  reference: number;
  levers: readonly Lever[];
};

type MissionControlCardProps = {
  data?: MissionControlData;
  className?: string;
};

/** Where a value sits on the scale, as a percentage of the track. */
function position(value: number, score: number, reference: number): number {
  const floor = Math.min(score, reference) - 55;
  const ceiling = Math.max(score, reference) + 25;
  return Math.max(3, Math.min(97, ((value - floor) / (ceiling - floor)) * 100));
}

/**
 * The standing plate: the score and the published cutoff on one scale, with
 * the distance between them stated rather than implied, and the actions
 * listed underneath as rows in a table.
 */
export function MissionControlCard({
  data = MISSION_CONTROL,
  className = "",
}: MissionControlCardProps) {
  const gap = data.score - data.reference;
  const scoreAt = position(data.score, data.score, data.reference);
  const refAt = position(data.reference, data.score, data.reference);

  return (
    <Frame
      label="Mission control"
      note={EXAMPLE_PROFILE}
      className={className}
      bodyClassName="!p-0"
    >
      <div className="grid grid-cols-3 border-b border-ed-rule">
        <div className="border-r border-ed-rule p-5 md:p-6">
          <MonoLabel className="block">{data.scoreLabel}</MonoLabel>
          <p className="ed-figure-num mt-3 !text-[clamp(34px,3.4vw,50px)]">
            {data.score}
          </p>
        </div>
        <div className="border-r border-ed-rule p-5 md:p-6">
          <MonoLabel className="block">{data.referenceLabel}</MonoLabel>
          <p className="ed-figure-num mt-3 !text-[clamp(34px,3.4vw,50px)] !text-ed-muted">
            {data.reference}
          </p>
        </div>
        <div className="p-5 md:p-6">
          <MonoLabel className="block">Gap</MonoLabel>
          <p className="ed-figure-num mt-3 !text-[clamp(34px,3.4vw,50px)] !text-ed-signal">
            {gap > 0 ? `+${gap}` : gap}
          </p>
        </div>
      </div>

      {/* The scale. A rule carrying two marks — the profile and the published
          cutoff — rather than a progress bar, which would imply the gap is
          something being filled in. */}
      <div className="border-b border-ed-rule px-5 pt-8 pb-6 md:px-6">
        <div className="relative h-px w-full bg-ed-rule-strong">
          <span
            className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-ed-muted"
            style={{ left: `${refAt}%` }}
            aria-hidden="true"
          />
          <span
            className="absolute top-1/2 h-4 w-[2px] -translate-y-1/2 bg-ed-signal"
            style={{ left: `${scoreAt}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <MonoLabel>Your profile</MonoLabel>
          <MonoLabel>Last cutoff</MonoLabel>
        </div>
      </div>

      <ul>
        {data.levers.map((lever, index) => (
          <li key={lever.id}>
            <LeverRow
              lever={lever}
              lead={index === 0}
              divider={index < data.levers.length - 1}
            />
          </li>
        ))}
      </ul>
    </Frame>
  );
}
