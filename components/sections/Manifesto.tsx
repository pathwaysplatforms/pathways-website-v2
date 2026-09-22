import { FileText, RefreshCw, HelpCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { MonoLabel } from "@/components/ui/MonoLabel";
import { Section } from "@/components/ui/Section";
import { MANIFESTO } from "@/lib/fixtures";

/** One glyph per statement, in fixture order. */
const ICONS: readonly LucideIcon[] = [FileText, RefreshCw, HelpCircle];

/**
 * Three statements, each on its own pane. Laid out as three columns rather
 * than one tall panel: the previous version left a lot of dead space around a
 * single block, and three panes give the ambient light something to fall on.
 */
export function Manifesto() {
  return (
    <Section
      id="manifesto"
      grid
      innerClassName="gap-y-10"
      aria-label="How Pathways handles information"
    >
      <div className="col-span-4 md:col-span-12">
        <MonoLabel>How this works</MonoLabel>
      </div>

      {MANIFESTO.map((statement, index) => {
        const Icon = ICONS[index] ?? FileText;

        return (
          <div
            key={statement}
            className="nx-card col-span-4 flex flex-col gap-5 p-7 md:p-8"
          >
            <span
              aria-hidden="true"
              className="nx-well flex h-12 w-12 items-center justify-center !rounded-2xl text-nx-accent"
            >
              <Icon size={21} strokeWidth={2} />
            </span>
            <p className="text-[21px] leading-[1.25] font-semibold tracking-[-0.028em] text-nx-ink md:text-[23px]">
              {statement}
            </p>
          </div>
        );
      })}
    </Section>
  );
}
