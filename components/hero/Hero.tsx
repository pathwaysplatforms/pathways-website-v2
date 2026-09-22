import { HalftoneField } from "@/components/hero/HalftoneField";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/fixtures";

/* ---------------------------------------------------------------------------
   Hero — a Server Component. No "use client" here, and none below it except
   HalftoneField itself.

   The three overlay lines are plain server-rendered HTML. Their visibility is
   pure CSS: HalftoneField writes --p on its wrapper once per frame, and each
   line multiplies a rising ramp by a falling ramp to cut its own window out of
   that value. No state, no effect, no hydration cost.

   Ramp rate is 12, i.e. each fade edge is 1/12 ≈ 0.083 of the scroll. The
   windows are spaced so a line is fully out before the next begins.
--------------------------------------------------------------------------- */

type OverlayLine = {
  text: string;
  /** Opacity reaches 1 at `in` + 1/12 and returns to 0 at `out`. */
  in: number;
  out: number;
};

const RAMP = 12;

const LINES: readonly OverlayLine[] = [
  { text: "107 pathways.", in: 0.05, out: 0.33 },
  { text: "One profile.", in: 0.36, out: 0.62 },
  { text: "Your 3.", in: 0.65, out: 0.97 },
];

function opacityWindow(line: OverlayLine): string {
  return `calc(clamp(0, (var(--p) - ${line.in}) * ${RAMP}, 1) * clamp(0, (${line.out} - var(--p)) * ${RAMP}, 1))`;
}

export function Hero() {
  return (
    <header aria-labelledby="hero-heading">
      <HalftoneField>
        {/* Decorative: the sequence restates the h1 below, and reduced-motion
            readers never see it at all, so it must not carry unique meaning. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center motion-reduce:hidden"
        >
          <div className="pw-shell">
            <div className="relative">
              {LINES.map((line, index) => (
                <p
                  key={line.text}
                  className={`pw-display-xxl ${index === 0 ? "" : "absolute inset-0"}`}
                  style={{ opacity: opacityWindow(line) }}
                >
                  {line.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </HalftoneField>

      <Section as="div" grid>
        <div className="col-span-4 md:col-span-9">
          <h1 id="hero-heading" className="pw-display">
            Canadian immigration, mapped to your file.
          </h1>
          <div className="mt-12 md:mt-16">
            <Button href={SITE.appUrl} variant="primary" size="lg">
              {SITE.ctaLabel}
            </Button>
          </div>
        </div>
      </Section>
    </header>
  );
}
