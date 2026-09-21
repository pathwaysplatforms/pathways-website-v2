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
/* Tour                                                                       */
/* -------------------------------------------------------------------------- */

export type TourStepId =
  | "voice"
  | "matching"
  | "mission-control"
  | "next-action"
  | "draws";

export type TourStep = {
  id: TourStepId;
  /** Section anchor id, also observed by PathLine. */
  anchor: string;
  eyebrow: string;
  heading: string;
  /** Exactly two sentences. */
  body: string;
};

export const TOUR_STEPS: readonly TourStep[] = [
  {
    id: "voice",
    anchor: "tour-voice",
    eyebrow: "STEP 01 — ONBOARDING",
    heading: "Tell it about yourself. Out loud.",
    body: "Talk through your education, work history, language tests and family situation the way you would explain them to a person. Pathways turns that into a structured profile you can correct line by line.",
  },
  {
    id: "matching",
    anchor: "tour-matching",
    eyebrow: "STEP 02 — MATCHING",
    heading: "Watch 107 pathways become 3.",
    body: "Every federal, provincial and territorial pathway is checked against your profile at once. You see which ones stay open, which ones close, and the published rule behind each result.",
  },
  {
    id: "mission-control",
    anchor: "tour-mission-control",
    eyebrow: "STEP 03 — MISSION CONTROL",
    heading: "Know exactly where you stand.",
    body: "Your score, your documents and your deadlines sit on one screen instead of in six browser tabs. Nothing is hidden behind a summary you cannot open up.",
  },
  {
    id: "next-action",
    anchor: "tour-next-action",
    eyebrow: "STEP 04 — NEXT BEST ACTION",
    heading: "Real-world actions, not busywork.",
    body: "Pathways shows what each action would change about your file before you spend a month on it. You decide what is worth doing.",
  },
  {
    id: "draws",
    anchor: "tour-draws",
    eyebrow: "STEP 05 — DRAWS TRACKER",
    heading: "Every draw since 2015, live.",
    body: "Each round of invitations is recorded with its date, category and cutoff as published. You can follow the trend instead of refreshing a government page.",
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

export const VOICE_TRANSCRIPT =
  "I finished my degree in Toronto in 2023, and I have been working here as a data analyst since.";

/* -------------------------------------------------------------------------- */
/* Honesty                                                                    */
/* -------------------------------------------------------------------------- */

export type HonestyClaim = {
  id: string;
  title: string;
  body: string;
};

export const HONESTY_CLAIMS: readonly HonestyClaim[] = [
  {
    id: "cited",
    title: "Every rule cites its source.",
    body: "Each requirement in Pathways carries a link to the IRCC or provincial page it came from and the date we read it. If you disagree with something we show you, you can go straight to the original and check.",
  },
  {
    id: "stale",
    title: "Stale data is flagged, not compared.",
    body: "When draw data has not refreshed, we mark it as stale and stop comparing it to your score. A number that might be out of date is worse than no number, so we do not quietly serve you one.",
  },
  {
    id: "unknown",
    title: "When we do not know, we say so.",
    body: "Some rules are discretionary, some are unpublished, and some change without notice. In those places Pathways says it does not know rather than filling the gap with a guess.",
  },
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
