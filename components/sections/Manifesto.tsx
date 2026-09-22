import { Check } from "lucide-react";

import { MonoLabel } from "@/components/ui/MonoLabel";
import { Section } from "@/components/ui/Section";
import { MANIFESTO } from "@/lib/fixtures";

/**
 * Three statements, engraved into a single brushed plate rather than set as
 * three cards. The plate is one object; the grooves between the statements
 * are milled into it, which is why they run edge to edge.
 */
export function Manifesto() {
  return (
    <Section
      id="manifesto"
      bg="sunk"
      topRule
      aria-label="How Pathways handles information"
    >
      <div className="sk-panel-lg relative mx-auto max-w-[900px] overflow-hidden">
        <div className="flex items-center gap-3 bg-[linear-gradient(180deg,#FFFDF9_0%,#F2EFE7_100%)] px-6 py-4">
          <span aria-hidden="true" className="sk-screw shrink-0" />
          <MonoLabel>How this works</MonoLabel>
          <span aria-hidden="true" className="sk-screw ml-auto shrink-0" />
        </div>
        <div aria-hidden="true" className="sk-groove" />

        <ol>
          {MANIFESTO.map((statement, index) => (
            <li key={statement}>
              {index > 0 ? (
                <div aria-hidden="true" className="sk-groove" />
              ) : null}
              <div className="flex items-center gap-5 px-6 py-7 md:gap-7 md:px-10 md:py-9">
                <span
                  aria-hidden="true"
                  className="sk-well flex h-11 w-11 shrink-0 items-center justify-center text-pw-accent"
                >
                  <Check size={20} strokeWidth={2.75} />
                </span>
                <p className="font-display text-[clamp(21px,2.4vw,32px)] leading-[1.15] font-semibold tracking-[-0.015em] text-pw-ink [text-shadow:0_1px_0_rgba(255,255,255,0.85)]">
                  {statement}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
