import type { ReactNode } from "react";

type FrameProps = {
  children: ReactNode;
  /** Engraved label in the frame's header rail, left side. */
  label?: string;
  /**
   * Right side of the rail. Every mock showing a figure passes
   * "Example profile" here — illustrative numbers are never presented as
   * real thresholds.
   */
  note?: string;
  /**
   * "panel" — warm card stock (default)
   * "device" — a hardware enclosure: darker rail, screws, deeper shadow
   */
  variant?: "panel" | "device";
  /** Small lamp in the rail, for mocks that depict a live state. */
  lamp?: "none" | "green" | "amber";
  className?: string;
  bodyClassName?: string;
};

/**
 * The enclosure every product mock sits in.
 *
 * The rail is separated from the body by a milled groove rather than a
 * border, so the header reads as a machined lip rather than a div with a
 * line under it. The "device" variant adds two screw heads — two, never
 * four, which is the difference between hardware and costume.
 */
export function Frame({
  children,
  label,
  note,
  variant = "panel",
  lamp = "none",
  className = "",
  bodyClassName = "",
}: FrameProps) {
  const hasRail = label !== undefined || note !== undefined || lamp !== "none";
  const isDevice = variant === "device";

  return (
    <div
      className={[
        isDevice ? "sk-metal" : "sk-panel",
        "overflow-hidden",
        className,
      ].join(" ")}
    >
      {hasRail ? (
        <div className="relative">
          <div
            className={[
              "flex items-center gap-3 px-4 py-3",
              isDevice
                ? "bg-[linear-gradient(180deg,#E9E5DB_0%,#D8D3C6_100%)]"
                : "bg-[linear-gradient(180deg,#FFFDF9_0%,#F2EFE7_100%)]",
            ].join(" ")}
          >
            {isDevice ? (
              <span aria-hidden="true" className="sk-screw shrink-0" />
            ) : null}

            {lamp !== "none" ? (
              <span
                aria-hidden="true"
                className={`sk-led shrink-0 ${lamp === "amber" ? "sk-led-amber" : ""}`}
              />
            ) : null}

            {label !== undefined ? (
              <span className="sk-label">{label}</span>
            ) : null}

            <span className="ml-auto flex items-center gap-3">
              {note !== undefined ? (
                <span className="sk-label opacity-80">{note}</span>
              ) : null}
              {isDevice ? (
                <span aria-hidden="true" className="sk-screw shrink-0" />
              ) : null}
            </span>
          </div>
          <div aria-hidden="true" className="sk-groove" />
        </div>
      ) : null}

      <div
        className={[
          "relative p-4 md:p-6",
          isDevice
            ? "bg-[linear-gradient(180deg,#FBF9F5_0%,#F1EEE6_100%)]"
            : "",
          bodyClassName,
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
