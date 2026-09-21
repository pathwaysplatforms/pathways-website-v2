import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/fixtures";

/**
 * Sticky top bar. Wordmark left, one primary Button right. No menu, no links.
 * Server component by design — no scroll state, no hide-on-scroll behaviour.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-pw-hairline bg-pw-bg">
      <Section as="div" width="shell" pad="flush">
        <div className="flex h-16 items-center justify-between gap-6 lg:h-20">
          <Link
            href="/"
            className="text-[20px] font-bold tracking-[-0.02em] text-pw-text"
          >
            {SITE.name}
          </Link>
          <Button href={SITE.appUrl} variant="primary" size="md">
            {SITE.ctaLabel}
          </Button>
        </div>
      </Section>
    </header>
  );
}
