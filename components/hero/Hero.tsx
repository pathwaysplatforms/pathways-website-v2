import { MissionControlCard } from "@/components/product/MissionControlCard";
import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Rule } from "@/components/ui/Rule";
import { formatRelativeTime } from "@/lib/draws";
import type { DrawSummary } from "@/lib/fixtures";
import { HERO, SITE } from "@/lib/fixtures";

/**
 * The opening spread.
 *
 * Headline and standfirst are ranged left across eight columns; a narrow
 * metadata column carries the live figures as a dateline would. The product
 * runs full width underneath as a plate, rather than floating beside the
 * copy — which is the arrangement that makes a page read as a product ad.
 *
 * Server Component. The site ships no client JavaScript.
 */
export function Hero({ summary }: { summary: DrawSummary }) {
  const facts: readonly { value: string; label: string }[] = [
    { value: String(summary.totalDraws), label: "draws recorded" },
    { value: String(summary.pathwaysMapped), label: "pathways mapped" },
    { value: formatRelativeTime(summary.lastUpdatedIso), label: "last updated" },
  ];

  return (
    <header aria-labelledby="hero-heading" className="relative overflow-x-clip">
      <div className="ed-shell">
        <div className="ed-grid pt-14 pb-12 md:pt-20 md:pb-16">
          <div className="col-span-4 md:col-span-8">
            <MonoLabel className="block">01 &mdash; {HERO.kicker}</MonoLabel>

            <h1 id="hero-heading" className="ed-display mt-7">
              {HERO.headline}
            </h1>

            <p className="ed-lede mt-8">{HERO.body}</p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button href={SITE.appUrl} variant="primary" size="lg">
                Try it out
              </Button>
              <Button href="#specimen-voice" variant="link">
                How it works
              </Button>
            </div>
          </div>

          {/* Dateline: the live figures, set small and ranged right. */}
          <aside className="col-span-4 mt-14 md:col-span-3 md:col-start-10 md:mt-2">
            <Rule tone="ink" />
            <dl className="mt-4 flex flex-col gap-4">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-baseline gap-3">
                  <dt className="sr-only">{fact.label}</dt>
                  <dd className="ed-num text-[17px] text-ed-ink">
                    {fact.value}
                  </dd>
                  <MonoLabel>{fact.label}</MonoLabel>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>

      {/* The plate, full width under the spread. */}
      <div className="ed-shell pb-16 md:pb-24">
        <MissionControlCard />
      </div>
    </header>
  );
}
