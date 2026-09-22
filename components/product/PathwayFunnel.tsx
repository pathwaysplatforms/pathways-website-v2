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
  /** Total pathways mapped across federal, provincial and territorial. */
  totalMapped?: number;
  className?: string;
};

/**
 * The matching screen, frozen: every mapped pathway checked at once, three
 * still open. Static — the funnel does not animate, it is already resolved.
 *
 * Inside the Frame every divider is a 1px hairline. The one accent value is
 * the count of open pathways; matched chips are ink, eliminated chips are
 * hairline.
 */
export function PathwayFunnel({
  pathways = PATHWAYS,
  totalMapped = DRAW_SUMMARY_FALLBACK.pathwaysMapped,
  className = "",
}: PathwayFunnelProps) {
  const matchedCount = pathways.filter(
    (pathway) => pathway.status === "matched",
  ).length;

  return (
    <Frame
      label="Pathways checked"
      note={EXAMPLE_PROFILE}
      className={className}
    >
      <dl className="flex items-end justify-between gap-6 border-b border-pw-hairline pb-4">
        <div>
          <MonoLabel as="dt" tone="dim">
            Mapped
          </MonoLabel>
          <dd className="pw-num mt-2 text-[32px] text-pw-ink">{totalMapped}</dd>
        </div>
        <div className="text-right">
          <MonoLabel as="dt" tone="dim">
            Open on this profile
          </MonoLabel>
          <dd className="pw-num mt-2 text-[32px] text-pw-accent">
            {matchedCount}
          </dd>
        </div>
      </dl>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {pathways.map((pathway) => (
          <li key={pathway.id}>
            <PathwayChip name={pathway.name} status={pathway.status} />
          </li>
        ))}
      </ul>
    </Frame>
  );
}
