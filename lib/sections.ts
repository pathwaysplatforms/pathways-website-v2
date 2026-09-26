/**
 * Single registry for the page's sections. The nav, the scroll-spy and the
 * page all read from here, so an id can never drift out of sync.
 *
 * `navLabel: null` means the section exists but is not a nav destination.
 * Labels are named for their contents, not vague umbrellas (skill §16).
 */

export type SectionId =
  | "hero"
  | "problem"
  | "features"
  | "pathway"
  | "data"
  | "start"
  | "qualify";

export type SectionDef = {
  id: SectionId;
  /** Text shown in the nav, or null if the section isn't a destination. */
  navLabel: string | null;
  /** Accessible name for the <section> landmark. */
  title: string;
};

export const SECTIONS: SectionDef[] = [
  { id: "hero", navLabel: null, title: "Pathways" },
  { id: "problem", navLabel: "Why now", title: "Why now" },
  { id: "features", navLabel: "How it works", title: "How it works" },
  { id: "pathway", navLabel: "New pathway", title: "A new pathway just opened" },
  { id: "data", navLabel: "Our data", title: "The data behind it" },
  { id: "start", navLabel: null, title: "Start your application" },
  { id: "qualify", navLabel: "Check eligibility", title: "Check your eligibility" },
];

export const NAV_SECTIONS = SECTIONS.filter(
  (s): s is SectionDef & { navLabel: string } => s.navLabel !== null,
);

/** Where "Try it now" and the hero circle both land. */
export const FORM_TARGET: SectionId = "qualify";
