import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { SITE } from "@/lib/fixtures";

/**
 * A masthead: wordmark, one qualifier, one action, a rule underneath. It is
 * not sticky and it does not float — it scrolls away like the top of a page.
 */
export function Nav() {
  return (
    <header className="border-b border-ed-rule">
      <div className="ed-shell flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-display text-[25px] leading-none tracking-[-0.01em] text-ed-ink">
            {SITE.name}
          </span>
          <span className="hidden sm:block">
            <MonoLabel>For Canada</MonoLabel>
          </span>
        </Link>

        <Button href={SITE.appUrl} variant="primary" size="md">
          Try it out
        </Button>
      </div>
    </header>
  );
}
