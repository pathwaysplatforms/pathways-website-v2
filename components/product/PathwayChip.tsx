import { Check, X } from "lucide-react";

import type { Pathway } from "@/lib/fixtures";

type PathwayChipProps = {
  name: string;
  /** "eliminated" (default) sits recessed; "matched" sits proud and lit. */
  status?: Pathway["status"];
  className?: string;
};

/**
 * One pathway in the funnel, as a physical tab.
 *
 * A matched pathway is a raised enamel tab with a tick; an eliminated one is
 * pressed INTO the surface and dimmed. The state is carried by the depth, not
 * only by the colour — that is the whole argument for doing this in relief.
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
        "sk-chip",
        isMatched ? "sk-chip-on" : "sk-chip-off",
        className,
      ].join(" ")}
    >
      {isMatched ? (
        <Check size={13} strokeWidth={3} aria-hidden="true" />
      ) : (
        <X size={12} strokeWidth={2.5} aria-hidden="true" className="opacity-55" />
      )}
      {name}
    </span>
  );
}
