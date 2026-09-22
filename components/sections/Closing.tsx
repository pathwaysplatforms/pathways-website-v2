import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/fixtures";

/**
 * 05 — Closing.
 *
 * A full-bleed accent band that is nothing but the call to action. The whole
 * block is the link: the anchor paints an ::after over the positioned Section,
 * so the entire coloured area is the hit target rather than just the words.
 *
 * The line is set nowrap at Display XXL and is allowed to crop off the right
 * viewport edge. Section clips overflow-x, so the page never scrolls sideways
 * because of it.
 *
 * Text on accent is ALWAYS white — .pw-display-xxl hard-sets ink, so text-pw-bg
 * has to be re-stated here. Do not remove it.
 *
 * Focus ring is the global 3px ink :focus-visible rule; it is not re-specified.
 */
export function Closing() {
  return (
    <Section
      id="closing"
      bg="accent"
      aria-labelledby="closing-heading"
    >
      <a
        href={SITE.appUrl}
        rel="noreferrer"
        className="group block w-max after:absolute after:inset-0"
      >
        <h2
          id="closing-heading"
          className="pw-display-xxl text-pw-bg flex items-baseline gap-6 whitespace-nowrap md:gap-12"
        >
          <span>Try it out.</span>
          <span
            aria-hidden="true"
            className="pw-mech inline-block group-hover:translate-x-3"
          >
            →
          </span>
        </h2>
      </a>
    </Section>
  );
}
