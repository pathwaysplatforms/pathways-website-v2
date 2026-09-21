import type { Pathway } from "@/lib/fixtures";

type PathwayChipProps = {
  name: string;
  /** "eliminated" (default) dims and strikes the label. */
  status?: Pathway["status"];
  className?: string;
};

/**
 * One pathway in the funnel: a small hairline-bordered pill.
 * Matched chips carry a single accent dot — the only accent in the funnel.
 * Accent is scarce; do not add a second accent treatment here.
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
        "inline-flex items-center gap-1.5 rounded-full border border-pw-hairline",
        "px-2.5 py-1 text-[12px] leading-none whitespace-nowrap",
        isMatched ? "text-pw-text" : "text-pw-text-dim line-through",
        className,
      ].join(" ")}
    >
      {isMatched ? (
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-pw-accent"
        />
      ) : null}
      {name}
    </span>
  );
}
