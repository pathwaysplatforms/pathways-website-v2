import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/fixtures";

/**
 * The one dark block on the site, and the last thing on the page. Entirely
 * typographic: the whole band is the link, and the arrow travels on hover.
 */
export function Closing() {
  return (
    <Section id="closing" bg="ink" aria-labelledby="closing-heading">
      <a
        href={SITE.appUrl}
        rel="noreferrer"
        className="group flex flex-col items-start gap-10 after:absolute after:inset-0 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <h2
            id="closing-heading"
            className="ed-display !text-ed-paper max-w-[16ch]"
          >
            Try it out.
          </h2>
          <p className="ed-lede mt-6 !text-ed-paper/65">
            Build your profile once and see where it stands against every
            pathway and every recorded draw.
          </p>
        </div>

        <span className="ed-label !text-ed-paper flex shrink-0 items-baseline gap-3 border-b border-ed-paper/35 pb-2">
          Open Pathways
          <span
            aria-hidden="true"
            className="transition-transform duration-150 ease-out group-hover:translate-x-1.5"
          >
            &#8594;
          </span>
        </span>
      </a>
    </Section>
  );
}
