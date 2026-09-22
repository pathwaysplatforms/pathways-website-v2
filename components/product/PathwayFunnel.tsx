import { PathwayChip } from "@/components/product/PathwayChip";
import type { Pathway } from "@/lib/fixtures";
import { DRAW_SUMMARY_FALLBACK, PATHWAYS } from "@/lib/fixtures";

type PathwayFunnelProps = {
  pathways?: readonly Pathway[];
  /** Total pathways mapped across federal, provincial and territorial. */
  totalMapped?: number;
  className?: string;
};

/**
 * The matching screen, frozen: every mapped pathway checked at once, three
 * still open. Static — the funnel does not animate, it is already resolved.
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
    <div className={`w-full ${className}`}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="pw-mono">Pathways checked</p>
        <p className="text-[12px] leading-none text-pw-ink-dim">
          <span className="pw-num">{totalMapped}</span> mapped{" "}
          <span aria-hidden="true">·</span>{" "}
          <span className="pw-num">{matchedCount}</span> open
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {pathways.map((pathway) => (
          <PathwayChip
            key={pathway.id}
            name={pathway.name}
            status={pathway.status}
          />
        ))}
      </div>
    </div>
  );
}
