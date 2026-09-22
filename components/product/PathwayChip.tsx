import type { Pathway } from "@/lib/fixtures";

type PathwayChipProps = {
  name: string;
  /** "eliminated" (default) drops the chip to a hairline box and dim text. */
  status?: Pathway["status"];
  className?: string;
};

/**
 * One pathway in the funnel. A SQUARE box — no pill, no radius, no dot.
 *
 * matched    — 1px ink border, ink label.
 * eliminated — 1px hairline border, dim label.
 *
 * Accent never appears here. The funnel spends its single accent on the count
 * of open pathways in the header, and one accent per mock is the budget.
 */
export function PathwayChip({
  name,
  status = "eliminated",
  className = "",
}: PathwayChipProps) {
  const isMatched = status === "matched";

  return (
    <span
      className={[
        "pw-mono inline-flex items-center border px-2 py-1.5 whitespace-nowrap",
        isMatched
          ? "border-pw-ink text-pw-ink"
          : "border-pw-hairline text-pw-ink-dim",
        className,
      ].join(" ")}
    >
      {name}
    </span>
  );
}
