import type { Pathway } from "@/lib/fixtures";

type PathwayChipProps = {
  name: string;
  status?: Pathway["status"];
  className?: string;
};

/**
 * One pathway, set as a squared tag in mono — a catalogue entry, not a pill.
 * An open pathway takes the ink border and a signal mark; a closed one stays
 * hairline and faint.
 */
export function PathwayChip({
  name,
  status = "eliminated",
  className = "",
}: PathwayChipProps) {
  const isMatched = status === "matched";

  return (
    <span
      className={["ed-tag", isMatched ? "ed-tag-on" : "", className].join(" ")}
    >
      {isMatched ? <span aria-hidden="true" className="ed-mark" /> : null}
      {name}
    </span>
  );
}
