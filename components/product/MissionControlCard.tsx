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

/**
 * The Mission Control panel: the score, the published figure it is measured
 * against, the distance between them, and the actions that would move it.
 *
 * The score is the one accent value in this mock, so the lever deltas stay
 * ink — one accent per mock is the budget. Every divider inside the Frame is
 * a 1px hairline.
 */
export function MissionControlCard({
  data = MISSION_CONTROL,
  className = "",
}: MissionControlCardProps) {
  const gap = data.reference - data.score;

  return (
    <Frame label="Mission control" note={EXAMPLE_PROFILE} className={className}>
      <dl className="grid grid-cols-3 gap-4 border-b border-pw-hairline pb-5">
        <div>
          <MonoLabel as="dt" tone="dim">
            {data.scoreLabel}
          </MonoLabel>
          <dd className="pw-num mt-3 text-[30px] md:text-[44px] text-pw-accent">
            {data.score}
          </dd>
        </div>
        <div className="border-l border-pw-hairline pl-4">
          <MonoLabel as="dt" tone="dim">
            {data.referenceLabel}
          </MonoLabel>
          <dd className="pw-num mt-3 text-[30px] md:text-[44px] text-pw-ink">
            {data.reference}
          </dd>
        </div>
        <div className="border-l border-pw-hairline pl-4">
          <MonoLabel as="dt" tone="dim">
            Gap
          </MonoLabel>
          <dd className="pw-num mt-3 text-[30px] md:text-[44px] text-pw-ink">{gap}</dd>
        </div>
      </dl>

      <ul className="mt-1">
        {data.levers.map((lever, position) => (
          <li key={lever.id}>
            <LeverRow
              lever={lever}
              index={position + 1}
              divider={position < data.levers.length - 1}
            />
          </li>
        ))}
      </ul>
    </Frame>
  );
}
