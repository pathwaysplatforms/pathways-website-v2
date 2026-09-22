import { MonoLabel } from "@/components/ui/MonoLabel";
import { Section } from "@/components/ui/Section";
import { MANIFESTO } from "@/lib/fixtures";

/**
 * Three statements as a numbered list, separated by rules. No cards and no
 * icons: the statements are short enough that anything placed around them is
 * decoration, and decoration is what makes a page look generated.
 */
export function Manifesto() {
  return (
    <Section
      id="manifesto"
      grid
      rule="ink"
      innerClassName="gap-y-8"
      aria-label="How Pathways handles information"
    >
      <div className="col-span-4 md:col-span-3">
        <MonoLabel className="block">How this works</MonoLabel>
      </div>

      <ol className="col-span-4 md:col-span-8 md:col-start-5">
        {MANIFESTO.map((statement, index) => (
          <li
            key={statement}
            className="flex items-baseline gap-6 border-b border-ed-rule py-7 first:pt-0 last:border-b-0 last:pb-0 md:gap-10"
          >
            <MonoLabel className="shrink-0">
              {String(index + 1).padStart(2, "0")}
            </MonoLabel>
            <p className="ed-heading !text-[clamp(23px,2.6vw,34px)]">
              {statement}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
