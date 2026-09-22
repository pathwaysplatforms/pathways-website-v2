import { Numeral } from "@/components/ui/Numeral";
import { Rule } from "@/components/ui/Rule";
import { Section } from "@/components/ui/Section";
import { MANIFESTO } from "@/lib/fixtures";

/**
 * 04 — Manifesto.
 *
 * Three statements from lib/fixtures, one line each, set at Display size on
 * the paper band and separated by the 2px ink rule. There is deliberately no
 * body copy underneath any of them: the line is the whole argument.
 *
 * The badge numeral carries the count, which is why this block — like every
 * other — has no uppercase eyebrow above it.
 */
export function Manifesto() {
  return (
    <Section
      id="manifesto"
      bg="paper"
      topRule
      aria-label="How Pathways handles information"
    >
      <ol className="flex flex-col">
        {MANIFESTO.map((statement, index) => {
          const isFirst = index === 0;
          const isLast = index === MANIFESTO.length - 1;

          return (
            <li key={statement}>
              {/* The 2px rule is what separates one statement from the next. */}
              {isFirst ? null : <Rule />}
              <div
                className={[
                  "pw-grid items-start gap-y-6",
                  isFirst ? "" : "pt-10 md:pt-16",
                  isLast ? "" : "pb-10 md:pb-16",
                ].join(" ")}
              >
                <div className="col-span-4 md:col-span-2">
                  <Numeral value={`0${index + 1}`} variant="badge" />
                </div>
                <p className="col-span-4 md:col-span-10 pw-display">
                  {statement}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
