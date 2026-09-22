import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/fixtures";

/** PLACEHOLDER — replaced in Phase 2 by the halftone scroll sequence. */
export function Hero() {
  return (
    <Section as="header" aria-labelledby="hero-heading">
      <h1 id="hero-heading" className="pw-display">
        Canadian immigration, mapped to your file.
      </h1>
      <div className="mt-12">
        <Button href={SITE.appUrl} variant="primary" size="lg">
          {SITE.ctaLabel}
        </Button>
      </div>
    </Section>
  );
}
