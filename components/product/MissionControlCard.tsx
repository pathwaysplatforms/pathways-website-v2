import { Frame } from "@/components/ui/Frame";
import { MonoLabel } from "@/components/ui/MonoLabel";
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
  className?: string;
};

/** Where the score sits on the gauge, as a share of the track. */
function gaugeFill(score: number, reference: number): number {
  const floor = Math.min(score, reference) - 60;
  const ceiling = Math.max(score, reference) + 30;
  return Math.max(6, Math.min(94, ((score - floor) / (ceiling - floor)) * 100));
}

function gaugeMark(score: number, reference: number): number {
  const floor = Math.min(score, reference) - 60;
  const ceiling = Math.max(score, reference) + 30;
  return Math.max(4, Math.min(96, ((reference - floor) / (ceiling - floor)) * 100));
}

/**
 * The standing panel, built as a piece of hardware: a lit primary readout, a
 * recessed gauge with a machined pointer marking the reference, and the
 * actions on tactile rows beneath.
 */
export function MissionControlCard({
  data = MISSION_CONTROL,
  className = "",
}: MissionControlCardProps) {
  const gap = data.score - data.reference;
  const fill = gaugeFill(data.score, data.reference);
  const mark = gaugeMark(data.score, data.reference);

  return (
    <Frame
      variant="device"
      label="Mission control"
      note={EXAMPLE_PROFILE}
      lamp="green"
      className={className}
      bodyClassName="!p-0"
    >
      {/* Primary readout */}
      <div className="px-5 pt-5 pb-4 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <MonoLabel tone="dim" className="block">{data.scoreLabel}</MonoLabel>
            <div className="sk-well-dark mt-2 inline-flex items-baseline gap-2.5 px-4 py-2.5">
              <span className="sk-readout sk-readout-lit text-[46px] leading-none">
                {data.score}
              </span>
              <span className="sk-readout text-[11px] tracking-[0.08em] text-white/40 uppercase">
                CRS
              </span>
            </div>
          </div>

          <div className="text-right">
            <MonoLabel tone="dim" className="block">Gap</MonoLabel>
            <p className="sk-readout mt-2 text-[26px] leading-none text-pw-accent [text-shadow:0_1px_0_rgba(255,255,255,0.85)]">
              {gap > 0 ? `+${gap}` : gap}
            </p>
          </div>
        </div>

        {/* Gauge: a recessed track with a glossy fill and a milled pointer. */}
        <div className="mt-5">
          <div className="sk-well relative h-3.5 w-full overflow-hidden !rounded-full">
            <div
              className="absolute inset-y-[2px] left-[2px] rounded-full bg-[linear-gradient(180deg,#5C93EE_0%,#2A5FBE_55%,#1B4596_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.25)]"
              style={{ width: `calc(${fill}% - 4px)` }}
            />
          </div>
          <div className="relative mt-1.5 h-4">
            <span
              className="absolute top-0 -translate-x-1/2"
              style={{ left: `${mark}%` }}
            >
              <span
                aria-hidden="true"
                className="mx-auto block h-2 w-[2px] bg-[linear-gradient(180deg,rgba(45,38,28,0.55),rgba(45,38,28,0.15))]"
              />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <MonoLabel tone="dim" className="!text-[10px]">
              {data.referenceLabel}
            </MonoLabel>
            <span className="sk-readout text-[12px] text-pw-ink-soft">
              {data.reference}
            </span>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="sk-groove" />

      {/* Actions */}
      <div className="px-5 py-2 md:px-6">
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
