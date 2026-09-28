"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { InteractiveHoverButton } from "@/components/ui/InteractiveHoverButton";
import { springDefault, springSheet } from "@/lib/motion";
import { NAV_SECTIONS, type SectionId } from "@/lib/sections";

/**
 * Translucent chrome with content scrolling underneath (skill §12) — not an
 * opaque bar that eats a fixed strip of the viewport. The hairline underneath
 * is a scroll edge effect: it fades in only once content is actually beneath
 * the chrome, rather than sitting there permanently as a divider.
 */
export function Nav() {
  const [active, setActive] = useState<SectionId | null>(null);
  const [overlapping, setOverlapping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();

  // Scroll edge: is there content under the chrome yet?
  useEffect(() => {
    const onScroll = () => setOverlapping(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy — "where am I?" (§16, wayfinding).
  useEffect(() => {
    const targets = NAV_SECTIONS.map((s) =>
      document.getElementById(s.id),
    ).filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id as SectionId);
      },
      // Band across the upper-middle of the viewport, below the chrome.
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close the menu on Escape — never trap the user (§16).
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className="chrome chrome-edge fixed inset-x-0 top-0 z-50"
      style={
        { "--edge-opacity": overlapping ? 1 : 0 } as React.CSSProperties
      }
    >
      <Container className="flex h-[4.25rem] items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="#hero"
          className="flex shrink-0 items-center gap-2 no-underline"
          aria-label="Pathways — back to top"
        >
          <span
            className="text-ink"
            style={{ fontFamily: "var(--font-urbanist)", fontSize: "1.25rem", fontWeight: 600 }}
          >
            Pathways
          </span>
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
        </a>

        {/* Section links — center */}
        <nav
          aria-label="Sections"
          className="hidden md:flex items-center gap-1"
        >
          {NAV_SECTIONS.map((s) => (
            <NavLink
              key={s.id}
              id={s.id}
              label={s.navLabel}
              active={active === s.id}
            />
          ))}
        </nav>

        {/* Try it now — right */}
        <div className="flex shrink-0 items-center gap-2">
          <InteractiveHoverButton href="/waitlist" text="Try it now" />
          <MenuToggle open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
        </div>
      </Container>

      {/* Mobile section menu. Enters and exits along the same path, anchored
          to the trigger above it (§7). */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            aria-label="Sections"
            className="md:hidden overflow-hidden border-t border-hairline"
            style={{ transformOrigin: "top right" }}
            initial={{ opacity: 0, scaleY: reduced ? 1 : 0.92, y: reduced ? 0 : -8 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: reduced ? 1 : 0.92, y: reduced ? 0 : -8 }}
            transition={springSheet}
          >
            <Container className="flex flex-col py-3">
              {NAV_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="t-body rounded-[0.625rem] px-3 py-2.5 text-ink no-underline"
                  aria-current={active === s.id ? "true" : undefined}
                >
                  {s.navLabel}
                </a>
              ))}
            </Container>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

/**
 * The active pill is a shared layout element, so moving between sections is a
 * single continuous spring that can be re-targeted mid-flight rather than a
 * fade-out/fade-in (§3).
 */
function NavLink({
  id,
  label,
  active,
}: {
  id: SectionId;
  label: string;
  active: boolean;
}) {
  return (
    <a
      href={`#${id}`}
      aria-current={active ? "true" : undefined}
      className={`relative rounded-pill px-3 py-1.5 t-small no-underline transition-colors ${
        active ? "text-ink" : "text-ink-muted hover:text-ink"
      }`}
    >
      {active ? (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-0 -z-10 rounded-pill bg-accent-tint"
          transition={springDefault}
        />
      ) : null}
      {label}
    </a>
  );
}

function MenuToggle({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={open ? "Close sections menu" : "Open sections menu"}
      className="md:hidden grid h-9 w-9 place-items-center rounded-[0.625rem] border border-hairline text-ink"
    >
      <span aria-hidden className="relative block h-3 w-4">
        <motion.span
          className="absolute inset-x-0 top-0 block h-[1.5px] rounded bg-current"
          animate={{ y: open ? 5.25 : 0, rotate: open ? 45 : 0 }}
          transition={springDefault}
        />
        <motion.span
          className="absolute inset-x-0 bottom-0 block h-[1.5px] rounded bg-current"
          animate={{ y: open ? -5.25 : 0, rotate: open ? -45 : 0 }}
          transition={springDefault}
        />
      </span>
    </button>
  );
}
