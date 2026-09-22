import { ArrowRight, ShieldCheck } from "lucide-react";

import { MissionControlCard } from "@/components/product/MissionControlCard";
import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { HERO, SITE } from "@/lib/fixtures";

/**
 * The hero is a static composition — there is no pinned scroll sequence and
 * nothing appears on scroll. The product does the talking: a real enclosure,
 * sitting on the page with a contact shadow, tilted very slightly so it reads
 * as an object photographed on a desk rather than a screenshot pasted flat.
 *
 * Server Component. Nothing on this page needs client JavaScript.
 */
export function Hero() {
  return (
    <header
      aria-labelledby="hero-heading"
      className="relative overflow-x-clip pt-14 pb-20 md:pt-20 md:pb-28"
    >
      {/* The light. A broad soft source above and behind the panel, plus a
          warm bounce at the bottom so the page does not fall off into grey. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_62%_0%,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0)_70%),radial-gradient(50%_40%_at_10%_100%,rgba(214,196,160,0.28)_0%,rgba(214,196,160,0)_70%)]"
      />

      <div className="sk-shell relative grid grid-cols-4 items-center gap-x-6 gap-y-14 md:grid-cols-12">
        <div className="col-span-4 md:col-span-6 lg:col-span-6">
          <span className="sk-brass inline-flex items-center gap-2 px-3 py-1.5">
            <ShieldCheck size={13} strokeWidth={2.5} aria-hidden="true" />
            <MonoLabel className="!text-[#3A2B0C] !opacity-100 [text-shadow:0_1px_0_rgba(255,240,200,0.55)]">
              {HERO.kicker}
            </MonoLabel>
          </span>

          <h1 id="hero-heading" className="sk-display mt-6 max-w-[14ch]">
            {HERO.headline}
          </h1>

          <p className="sk-body mt-6 max-w-[54ch]">{HERO.body}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              href={SITE.appUrl}
              variant="primary"
              size="lg"
              trailing={<ArrowRight size={17} strokeWidth={2.5} />}
            >
              Try it out
            </Button>
            <Button href="#specimen-voice" variant="secondary" size="lg">
              See how it works
            </Button>
          </div>
        </div>

        {/* The product shot. */}
        <div className="col-span-4 md:col-span-6 lg:col-span-6">
          <div className="relative mx-auto w-full max-w-[520px] [perspective:1600px]">
            {/* Contact shadow on the desk, separate from the panel's own
                ambient shadow — a single shadow always reads as a sticker. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-10 bottom-[-26px] h-12 rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(45,38,28,0.34)_0%,rgba(45,38,28,0)_72%)] blur-[6px]"
            />
            <div className="relative [transform:rotateY(-7deg)_rotateX(2deg)]">
              <MissionControlCard />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
