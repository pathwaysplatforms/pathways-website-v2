import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/fixtures";

/**
 * The hero. Eyebrow, headline, one subline, one CTA. Nothing else —
 * no image, no card, no secondary link. The ProofBar sits directly below it
 * and is rendered by the page, not from here.
 */
export function Hero() {
  return (
    <Section as="header" width="content" aria-labelledby="hero-heading">
      <Eyebrow>CANADIAN IMMIGRATION</Eyebrow>

      <h1 id="hero-heading" className="pw-display mt-6">
        Your Canadian immigration file, run like a project.
      </h1>

      <p className="pw-body pw-measure mt-8">
        Pathways maps every federal, provincial and territorial program against
        one profile you build yourself, then tracks the documents, deadlines and
        draws attached to it in a single place.
      </p>

      <div className="mt-10">
        <Button href={SITE.appUrl} variant="primary" size="lg">
          {SITE.ctaLabel}
        </Button>
      </div>
    </Section>
  );
}
