import { ArrowRight } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/fixtures";

/**
 * The closing band: blue enamel with a gloss sweep across the top. The whole
 * block is the link — the anchor paints an ::after over the positioned
 * Section, so the entire panel is the hit target.
 *
 * On hover the arrow travels and the enamel lifts very slightly, which is the
 * only motion in the block.
 */
export function Closing() {
  return (
    <Section id="closing" bg="accent" aria-labelledby="closing-heading">
      <a
        href={SITE.appUrl}
        rel="noreferrer"
        className="group flex flex-col items-start gap-8 after:absolute after:inset-0 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2
            id="closing-heading"
            className="sk-emboss font-display text-[clamp(32px,4.4vw,58px)] leading-[1.06] font-semibold tracking-[-0.02em]"
          >
            Try it out.
          </h2>
          <p className="mt-3 max-w-[46ch] text-[17px] leading-relaxed text-white/75 [text-shadow:0_-1px_0_rgba(0,0,0,0.35)]">
            Build your profile once and see where it stands against every
            pathway and every recorded draw.
          </p>
        </div>

        {/* A real button face sitting on the enamel, not a text link. */}
        <span className="sk-btn sk-btn-secondary h-[54px] shrink-0 px-8 text-[16px]">
          Open Pathways
          <span
            aria-hidden="true"
            className="transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.3,1)] group-hover:translate-x-1.5"
          >
            <ArrowRight size={18} strokeWidth={2.5} />
          </span>
        </span>
      </a>
    </Section>
  );
}
