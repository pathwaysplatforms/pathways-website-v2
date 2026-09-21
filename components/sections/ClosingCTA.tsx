import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/fixtures";

/**
 * The last thing on the page. One line, one button, nothing else.
 * Vertical rhythm comes from Section pad="closing" (the 200px block).
 */
export function ClosingCTA() {
  return (
    <Section
      id="closing"
      width="content"
      pad="closing"
      aria-labelledby="closing-eyebrow"
    >
      <div className="flex flex-col items-start gap-10">
        <Eyebrow id="closing-eyebrow">SEE IT FOR YOURSELF</Eyebrow>
        <p className="pw-display">
          Understand where your file actually stands.
        </p>
        <Button href={SITE.appUrl} variant="primary" size="lg">
          {SITE.ctaLabel}
        </Button>
      </div>
    </Section>
  );
}
