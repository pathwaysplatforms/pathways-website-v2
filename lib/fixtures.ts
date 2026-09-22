/**
 * Every piece of staged product data on this site lives here.
 * Nothing in components/ may invent its own data — import from this file.
 *
 * COPY RULE: information, tools, tracking, understand.
 * Never advice, never "we'll tell you which visa to apply for", never
 * "your strategy". No fees, no processing times, no eligibility thresholds.
 */

/* -------------------------------------------------------------------------- */
/* Site                                                                       */
/* -------------------------------------------------------------------------- */

export const HERO = {
  /** Engraved plate above the headline. */
  kicker: "Canadian immigration",
  headline: "Every pathway to Canada, mapped to your profile.",
  body: "One profile, checked against every federal, provincial and territorial program, with every Express Entry draw since 2015 recorded beside it.",
} as const;

export const SITE = {
  name: "Pathways",
  appUrl: "https://app.pathways.xx",
  ctaLabel: "Try it out →",
} as const;

/* -------------------------------------------------------------------------- */
/* Proof bar / draw summary                                                   */
/* -------------------------------------------------------------------------- */

export type DrawSummary = {
  /** Draws recorded since 2015. */
  totalDraws: number;
  /** Distinct pathways mapped across federal, provincial and territorial. */
  pathwaysMapped: number;
  /** Distinct draw categories tracked. */
  drawTypes: number;
  /** ISO 8601 timestamp of the most recent ingest. */
  lastUpdatedIso: string;
};

/** Fallback used whenever the Supabase view is unavailable. */
export const DRAW_SUMMARY_FALLBACK: DrawSummary = {
  totalDraws: 419,
  pathwaysMapped: 107,
  drawTypes: 13,
  lastUpdatedIso: "2026-09-18T14:05:00.000Z",
};

export const DRAW_TYPES: readonly string[] = [
  "General",
  "Canadian Experience Class",
  "Federal Skilled Worker",
  "Federal Skilled Trades",
  "Provincial Nominee Program",
  "French language proficiency",
  "Healthcare and social services",
  "STEM occupations",
  "Trade occupations",
  "Transport occupations",
  "Agriculture and agri-food",
  "Education",
  "No program specified",
];

/* -------------------------------------------------------------------------- */
/* Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export type SpecimenId =
  | "voice"
  | "match"
  | "standing"
  | "next"
  | "draws";

/**
 * How the block is composed. Never the same value twice in a row — the
 * alternation is what stops the run of five reading as a card grid.
 *   "text-mock"  text spans 5 columns, mock spans 7
 *   "mock-text"  mock spans 8 columns, text spans 4
 *   "stacked"    text full width, mock full width underneath
 */
export type SpecimenLayout = "text-mock" | "mock-text" | "stacked";

export type Specimen = {
  id: SpecimenId;
  /** Two digits. Rendered as an outlined numeral, not an eyebrow. */
  numeral: string;
  /** Mono label beside the numeral. */
  label: string;
  /** A concrete fact or example. Never a question, never "X, not Y". */
  headline: string;
  /** ONE sentence, 22 words maximum. */
  body: string;
  /** Optional mono caption sitting under the headline. */
  caption?: string;
  /**
   * True when a figure in the HEADLINE comes from the example profile rather
   * than a published source. The block must then carry an EXAMPLE_PROFILE
   * label beside the headline as well as inside the Frame.
   */
  headlineIsExample?: boolean;
  layout: SpecimenLayout;
};

export const SPECIMENS: readonly Specimen[] = [
  {
    id: "voice",
    numeral: "01",
    label: "Voice",
    headline: "Describe your life out loud. We turn it into a file.",
    caption: "21 Express Entry fields captured by voice",
    body: "You talk; Pathways writes the structured profile, and you correct any line it gets wrong.",
    layout: "text-mock",
  },
  {
    id: "match",
    numeral: "02",
    label: "Match",
    headline: "107 in. 3 out.",
    body: "Every federal, provincial and territorial pathway is checked against your profile at once, with the published rule attached.",
    layout: "mock-text",
  },
  {
    id: "standing",
    numeral: "03",
    label: "Standing",
    headline: "CRS 472. Last cutoff 491. Gap: 19.",
    headlineIsExample: true,
    body: "Your score sits beside the most recent published cutoff, so the distance between them is a number.",
    layout: "stacked",
  },
  {
    id: "next",
    numeral: "04",
    label: "Next",
    headline: "Next: retake your language test.",
    headlineIsExample: true,
    body: "Each action shows what it would change about your file before you spend a month on it.",
    layout: "text-mock",
  },
  {
    id: "draws",
    numeral: "05",
    label: "Draws",
    headline: "Every Express Entry draw since 2015.",
    body: "Each round of invitations is recorded with its date, category and cutoff exactly as published.",
    layout: "mock-text",
  },
];

/* -------------------------------------------------------------------------- */
/* Mission control mock                                                       */
/* -------------------------------------------------------------------------- */

export type Lever = {
  id: string;
  /** A real-world action, phrased as something the person does. */
  label: string;
  /** Expected CRS movement, rendered as "+18". */
  delta: number;
  /** Short qualifier shown beneath the label. */
  note: string;
};

export const MISSION_CONTROL_LEVERS: readonly Lever[] = [
  {
    id: "language",
    label: "Retake your language test",
    delta: 18,
    note: "Modelled on your last reported scores",
  },
  {
    id: "spouse-language",
    label: "Add a spouse language result",
    delta: 12,
    note: "Currently missing from your profile",
  },
  {
    id: "canadian-work",
    label: "Record a second year of Canadian work",
    delta: 9,
    note: "Recorded once your contract passes 24 months",
  },
];

export const MISSION_CONTROL = {
  scoreLabel: "Your CRS",
  score: 472,
  referenceLabel: "Last general draw",
  reference: 491,
  levers: MISSION_CONTROL_LEVERS,
} as const;

/* -------------------------------------------------------------------------- */
/* Pathway funnel mock — 107 mapped, 3 open on this profile                   */
/* -------------------------------------------------------------------------- */

export type Pathway = {
  id: string;
  name: string;
  status: "matched" | "eliminated";
};

export const PATHWAYS: readonly Pathway[] = [
  { id: "cec", name: "Canadian Experience Class", status: "matched" },
  { id: "ee-french", name: "French proficiency category", status: "matched" },
  { id: "on-hcp", name: "ON — Human Capital Priorities", status: "matched" },
  { id: "fsw", name: "Federal Skilled Worker", status: "eliminated" },
  { id: "fst", name: "Federal Skilled Trades", status: "eliminated" },
  { id: "bc-pnp-tech", name: "BC PNP — Tech", status: "eliminated" },
  { id: "bc-pnp-skilled", name: "BC PNP — Skilled Worker", status: "eliminated" },
  { id: "ab-aaip", name: "AB — Alberta Advantage", status: "eliminated" },
  { id: "sk-sinp", name: "SK — Occupations In-Demand", status: "eliminated" },
  { id: "mb-mpnp", name: "MB — Skilled Worker Overseas", status: "eliminated" },
  { id: "ns-labour", name: "NS — Labour Market Priorities", status: "eliminated" },
  { id: "nb-skilled", name: "NB — Skilled Workers", status: "eliminated" },
  { id: "pei-pnp", name: "PE — Labour Impact", status: "eliminated" },
  { id: "nl-priority", name: "NL — Priority Skills", status: "eliminated" },
  { id: "yt-nominee", name: "YT — Yukon Nominee", status: "eliminated" },
  { id: "nt-employer", name: "NT — Employer Driven", status: "eliminated" },
  { id: "aip", name: "Atlantic Immigration Program", status: "eliminated" },
  { id: "rnip", name: "Rural and Northern Immigration", status: "eliminated" },
  { id: "agri-food", name: "Agri-Food pathway", status: "eliminated" },
  { id: "home-care", name: "Home Care Worker pathways", status: "eliminated" },
  { id: "start-up", name: "Start-up Visa", status: "eliminated" },
  { id: "self-employed", name: "Self-employed Persons", status: "eliminated" },
  { id: "qc-selection", name: "QC — Skilled Worker Selection", status: "eliminated" },
  { id: "spousal", name: "Spousal sponsorship", status: "eliminated" },
];

/* -------------------------------------------------------------------------- */
/* Draw chart mock — CRS cutoff across recent general rounds                  */
/* -------------------------------------------------------------------------- */

export type DrawPoint = {
  /** ISO date of the round. */
  date: string;
  /** Published CRS cutoff for that round. */
  cutoff: number;
};

export const DRAW_SERIES: readonly DrawPoint[] = [
  { date: "2025-10-08", cutoff: 534 },
  { date: "2025-10-22", cutoff: 528 },
  { date: "2025-11-05", cutoff: 521 },
  { date: "2025-11-19", cutoff: 517 },
  { date: "2025-12-03", cutoff: 523 },
  { date: "2025-12-17", cutoff: 512 },
  { date: "2026-01-14", cutoff: 508 },
  { date: "2026-01-28", cutoff: 515 },
  { date: "2026-02-11", cutoff: 506 },
  { date: "2026-02-25", cutoff: 499 },
  { date: "2026-03-11", cutoff: 504 },
  { date: "2026-03-25", cutoff: 496 },
  { date: "2026-04-08", cutoff: 502 },
  { date: "2026-04-22", cutoff: 493 },
  { date: "2026-05-06", cutoff: 489 },
  { date: "2026-05-20", cutoff: 497 },
  { date: "2026-06-03", cutoff: 486 },
  { date: "2026-06-17", cutoff: 490 },
  { date: "2026-07-01", cutoff: 483 },
  { date: "2026-07-15", cutoff: 488 },
  { date: "2026-07-29", cutoff: 495 },
  { date: "2026-08-12", cutoff: 487 },
  { date: "2026-08-26", cutoff: 492 },
  { date: "2026-09-09", cutoff: 491 },
];

/* -------------------------------------------------------------------------- */
/* Voice waveform mock — static bar heights, 0..1                             */
/* -------------------------------------------------------------------------- */

export const WAVEFORM_BARS: readonly number[] = [
  0.18, 0.32, 0.24, 0.51, 0.68, 0.44, 0.29, 0.61, 0.83, 0.72, 0.39, 0.22, 0.47,
  0.9, 0.76, 0.55, 0.31, 0.19, 0.42, 0.66, 0.58, 0.35, 0.27, 0.49, 0.71, 0.4,
  0.23, 0.16, 0.34, 0.21,
];

/** Indices of the three bars rendered in accent. */
export const WAVEFORM_ACCENT_INDICES: readonly number[] = [8, 13, 14];

/**
 * Honesty rule: every number shown in a product mock carries this label
 * inside its Frame. Illustrative figures are never presented as thresholds.
 */
export const EXAMPLE_PROFILE = "Example profile";

export const VOICE_TRANSCRIPT =
  "I finished my degree in Toronto in 2023, and I have been working here as a data analyst since.";

/* -------------------------------------------------------------------------- */
/* Manifesto                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Three statements, one line each, set at Display size and separated by the
 * 2px rule. No body copy underneath — the line is the whole argument.
 */
export const MANIFESTO: readonly string[] = [
  "Every rule cites its source.",
  "Old data gets flagged.",
  "If we don't know, we say so.",
];

/* -------------------------------------------------------------------------- */
/* Legal / footer                                                             */
/* -------------------------------------------------------------------------- */

export const DISCLAIMER =
  "Pathways provides information and tools. It is not a law firm and does not provide immigration advice. For advice on your situation, consult a lawyer or an RCIC regulated by the CICC.";

export const DATA_SOURCE_NOTE =
  "Draw and pathway data is compiled from published IRCC and provincial sources, with the date of each reading recorded alongside it.";

export const PRIVACY_POSTURE =
  "Documents you upload are encrypted, and you can ask us to delete them at any time.";
