import { ArrowRight } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/fixtures";

/**
 * The closing band. The whole block is the link: the anchor paints an
 * ::after over the positioned Section, so the entire field is the hit target.
 */
export function Closing() {
  return (
    <Section id="closing" bg="accent" aria-labelledby="closing-heading">
      <a
        href={SITE.appUrl}
        rel="noreferrer"
        className="group flex flex-col items-start gap-10 after:absolute after:inset-0 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2
            id="closing-heading"
            className="text-[clamp(34px,4.6vw,62px)] leading-[1.03] font-semibold tracking-[-0.038em] text-white"
          >
            Try it out.
          </h2>
          <p className="mt-4 max-w-[44ch] text-[17.5px] leading-relaxed tracking-[-0.012em] text-white/72">
            Build your profile once and see where it stands against every
            pathway and every recorded draw.
          </p>
        </div>

        {/* A glass pill on the blue, lifting on hover with the block. */}
        <span className="nx-btn nx-btn-secondary h-[56px] shrink-0 px-8 text-[16px] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5">
          Open Pathways
          <span
            aria-hidden="true"
            className="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
          >
            <ArrowRight size={18} strokeWidth={2.25} />
          </span>
        </span>
      </a>
    </Section>
  );
}
