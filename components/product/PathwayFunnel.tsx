import { PathwayChip } from "@/components/product/PathwayChip";
import { Frame } from "@/components/ui/Frame";
import { MonoLabel } from "@/components/ui/MonoLabel";
import type { Pathway } from "@/lib/fixtures";
import {
  DRAW_SUMMARY_FALLBACK,
  EXAMPLE_PROFILE,
  PATHWAYS,
} from "@/lib/fixtures";

type PathwayFunnelProps = {
  pathways?: readonly Pathway[];
  totalMapped?: number;
  className?: string;
};

/**
 * The matching plate: every mapped pathway checked at once, three still open.
 * The two counts head the plate; the catalogue of tags carries the result.
 */
export function PathwayFunnel({
  pathways = PATHWAYS,
  totalMapped = DRAW_SUMMARY_FALLBACK.pathwaysMapped,
  className = "",
}: PathwayFunnelProps) {
  const matchedCount = pathways.filter((p) => p.status === "matched").length;

  return (
    <Frame
      label="Pathways checked"
      note={EXAMPLE_PROFILE}
      className={className}
      bodyClassName="!p-0"
    >
      <div className="grid grid-cols-2 border-b border-ed-rule">
        <div className="border-r border-ed-rule p-5 md:p-6">
          <MonoLabel className="block">Mapped</MonoLabel>
          <p className="ed-figure-num mt-3 !text-[clamp(32px,3vw,44px)]">
            {totalMapped}
          </p>
        </div>
        <div className="p-5 md:p-6">
          <MonoLabel className="block">Open on this profile</MonoLabel>
          <p className="ed-figure-num mt-3 !text-[clamp(32px,3vw,44px)] !text-ed-signal">
            {matchedCount}
          </p>
        </div>
      </div>

      <ul className="flex flex-wrap gap-1.5 p-5 md:p-6">
        {pathways.map((pathway) => (
          <li key={pathway.id}>
            <PathwayChip name={pathway.name} status={pathway.status} />
          </li>
        ))}
      </ul>
    </Frame>
  );
}
