import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/fixtures";

/** PLACEHOLDER — restyled in Phase 2. */
export function Nav() {
  return (
    <Section as="header" pad="flush" className="border-b-2 border-pw-ink">
      <div className="flex h-20 items-center justify-between gap-6">
        <div className="flex items-baseline gap-4">
          <Link
            href="/"
            className="text-[22px] font-black tracking-[-0.02em] text-pw-ink uppercase"
          >
            {SITE.name}
          </Link>
          <MonoLabel tone="dim">For Canada</MonoLabel>
        </div>
        <Button href={SITE.appUrl} variant="primary" size="md">
          {SITE.ctaLabel}
        </Button>
      </div>
    </Section>
  );
}
