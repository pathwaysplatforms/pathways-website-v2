import { Check } from "lucide-react";

import type { Pathway } from "@/lib/fixtures";

type PathwayChipProps = {
  name: string;
  status?: Pathway["status"];
  className?: string;
};

/**
 * One pathway as a pill.
 *
 * A matched pathway is lit — accent fill with a coloured glow under it. An
 * eliminated one is quiet glass with a hairline rim. The state is carried by
 * light rather than by depth, which is the whole difference between this and
 * the extruded version.
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
        "nx-chip",
        isMatched ? "nx-chip-on" : "nx-chip-off",
        className,
      ].join(" ")}
    >
      {isMatched ? (
        <Check size={13} strokeWidth={2.75} aria-hidden="true" />
      ) : null}
      {name}
    </span>
  );
}
