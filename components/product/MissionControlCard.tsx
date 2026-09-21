import { Hairline } from "@/components/ui/Hairline";
import { LeverRow } from "@/components/product/LeverRow";
import type { Lever } from "@/lib/fixtures";
import { MISSION_CONTROL } from "@/lib/fixtures";

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
 * The Mission Control panel, as it appears in the app: the score, the number
 * it is measured against, and the three actions that would move it.
 * A single 1px hairline border. No shadow — this sits inside StickyFrame.
 */
export function MissionControlCard({
  data = MISSION_CONTROL,
  className = "",
}: MissionControlCardProps) {
  return (
    <div
      className={`w-full rounded-lg border border-pw-hairline bg-pw-bg ${className}`}
    >
      <div className="px-5 pb-4 pt-5">
        <p className="pw-eyebrow">{data.scoreLabel}</p>
        <p className="pw-figure mt-2 text-[44px] leading-none">{data.score}</p>
        <p className="mt-3 text-[13px] leading-none text-pw-text-dim">
          {data.referenceLabel}{" "}
          <span className="pw-figure text-pw-text-dim">{data.reference}</span>
        </p>
      </div>

      <Hairline />

      <div className="px-5 [&>*:last-child]:border-b-0">
        {data.levers.map((lever) => (
          <LeverRow key={lever.id} lever={lever} />
        ))}
      </div>
    </div>
  );
}
