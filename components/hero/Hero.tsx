import { ArrowRight, Sparkles } from "lucide-react";

import { MissionControlCard } from "@/components/product/MissionControlCard";
import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { HERO, SITE } from "@/lib/fixtures";

/**
 * A static hero — nothing here appears on scroll and nothing pins.
 *
 * The depth comes from one lifted pane of glass carrying the product, sitting
 * in the page's ambient light with a coloured shadow under it. Server
 * Component; the whole site ships no client JavaScript.
 */
export function Hero() {
  return (
    <header
      aria-labelledby="hero-heading"
      className="relative overflow-x-clip pt-16 pb-24 md:pt-24 md:pb-32"
    >
      <div className="nx-shell relative grid grid-cols-4 items-center gap-x-6 gap-y-16 md:grid-cols-12">
        <div className="col-span-4 md:col-span-6">
          <span className="nx-card-flat inline-flex items-center gap-2 rounded-full px-3.5 py-2">
            <Sparkles
              size={13}
              strokeWidth={2.25}
              aria-hidden="true"
              className="text-nx-accent"
            />
            <MonoLabel>{HERO.kicker}</MonoLabel>
          </span>

          <h1 id="hero-heading" className="nx-display mt-7 max-w-[15ch]">
            {HERO.headline}
          </h1>

          <p className="nx-body mt-7 max-w-[52ch]">{HERO.body}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button
              href={SITE.appUrl}
              variant="primary"
              size="lg"
              trailing={<ArrowRight size={17} strokeWidth={2.25} />}
            >
              Try it out
            </Button>
            <Button href="#specimen-voice" variant="secondary" size="lg">
              See how it works
            </Button>
          </div>
        </div>

        <div className="col-span-4 md:col-span-6">
          <div className="relative mx-auto w-full max-w-[540px]">
            {/* A coloured pool of light under the pane, separate from its own
                ambient shadow. One shadow alone reads as a flat sticker. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-6 -bottom-8 h-16 rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(59,91,219,0.28)_0%,rgba(59,91,219,0)_72%)]"
            />
            <MissionControlCard floating />
          </div>
        </div>
      </div>
    </header>
  );
}
