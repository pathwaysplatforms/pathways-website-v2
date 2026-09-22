import { PathwayChip } from "@/components/product/PathwayChip";
import { Frame } from "@/components/ui/Frame";
import { MonoLabel } from "@/components/ui/MonoLabel";
import type { Pathway } from "@/lib/fixtures";
import { DRAW_SUMMARY_FALLBACK, EXAMPLE_PROFILE, PATHWAYS } from "@/lib/fixtures";

type PathwayFunnelProps = {
  pathways?: readonly Pathway[];
  totalMapped?: number;
  className?: string;
};

/**
 * The matching screen, resolved: every mapped pathway checked at once, three
 * still open. The two counts sit in the rail as instrument readouts; the tabs
 * below carry the result in relief.
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
      bodyClassName="!pt-0"
    >
      <div className="-mx-4 flex items-stretch md:-mx-6">
        <div className="flex-1 px-4 py-4 md:px-6 md:py-5">
          <MonoLabel tone="dim">Mapped</MonoLabel>
          <p className="sk-readout mt-1.5 text-[30px] leading-none text-pw-ink-soft [text-shadow:0_1px_0_rgba(255,255,255,0.85)]">
            {totalMapped}
          </p>
        </div>
        <div
          aria-hidden="true"
          className="w-[2px] bg-[linear-gradient(90deg,rgba(45,38,28,0.14)_0_1px,rgba(255,255,255,0.85)_1px_2px)]"
        />
        <div className="flex-1 px-4 py-4 md:px-6 md:py-5">
          <MonoLabel tone="dim">Open on this profile</MonoLabel>
          <p className="sk-readout mt-1.5 text-[30px] leading-none text-pw-accent [text-shadow:0_1px_0_rgba(255,255,255,0.85)]">
            {matchedCount}
          </p>
        </div>
      </div>

      <div aria-hidden="true" className="sk-groove -mx-4 md:-mx-6" />

      <ul className="mt-5 flex flex-wrap gap-2">
        {pathways.map((pathway) => (
          <li key={pathway.id}>
            <PathwayChip name={pathway.name} status={pathway.status} />
          </li>
        ))}
      </ul>
    </Frame>
  );
}
