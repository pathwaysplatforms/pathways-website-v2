import { PathwayChip } from "@/components/product/PathwayChip";
import { Frame } from "@/components/ui/Frame";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Rule } from "@/components/ui/Rule";
import type { Pathway } from "@/lib/fixtures";
import { DRAW_SUMMARY_FALLBACK, EXAMPLE_PROFILE, PATHWAYS } from "@/lib/fixtures";

type PathwayFunnelProps = {
  pathways?: readonly Pathway[];
  totalMapped?: number;
  className?: string;
};

/**
 * The matching screen, resolved: every mapped pathway checked at once, three
 * still open. The two counts sit above the result; the pills below carry it.
 */
export function PathwayFunnel({
  pathways = PATHWAYS,
  totalMapped = DRAW_SUMMARY_FALLBACK.pathwaysMapped,
  className = "",
}: PathwayFunnelProps) {
  const matchedCount = pathways.filter((p) => p.status === "matched").length;

  return (
    <Frame label="Pathways checked" note={EXAMPLE_PROFILE} className={className}>
      <div className="flex items-stretch gap-6">
        <div className="flex-1">
          <MonoLabel>Mapped</MonoLabel>
          <p className="nx-readout mt-2 text-[34px] leading-none text-nx-ink">
            {totalMapped}
          </p>
        </div>
        <Rule orientation="vertical" />
        <div className="flex-1">
          <MonoLabel>Open on this profile</MonoLabel>
          <p className="nx-readout mt-2 text-[34px] leading-none text-nx-accent">
            {matchedCount}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Rule />
      </div>

      <ul className="mt-6 flex flex-wrap gap-2">
        {pathways.map((pathway) => (
          <li key={pathway.id}>
            <PathwayChip name={pathway.name} status={pathway.status} />
          </li>
        ))}
      </ul>
    </Frame>
  );
}
