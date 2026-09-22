/**
 * Server-side draw summary.
 *
 * Environment variables consumed by this module (both must be present, or the
 * fixture fallback is returned without ever constructing a Supabase client):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * This module must never throw — at build time or at request time. Every
 * failure path (missing env, missing view, malformed row, network error)
 * resolves to DRAW_SUMMARY_FALLBACK from lib/fixtures.ts.
 *
 * The page that renders this data owns its cache window:
 *   export const revalidate = 21600;
 */

import { createClient } from "@supabase/supabase-js";
import { DRAW_SUMMARY_FALLBACK, type DrawSummary } from "@/lib/fixtures";

// TODO: create public_draw_summary view
const VIEW = "public_draw_summary";

const COLUMNS = "total_draws, pathways_mapped, draw_types, last_updated";

/* -------------------------------------------------------------------------- */
/* Narrowing helpers — the view is unversioned, so nothing is trusted.         */
/* -------------------------------------------------------------------------- */

function readRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function readCount(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.trunc(parsed);
  }
  return fallback;
}

function readIso(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return parsed.toISOString();
}

/* -------------------------------------------------------------------------- */
/* Fetch                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Reads the one-row `public_draw_summary` view with the anon key (read-only).
 * Falls back to the staged fixture whenever the view is unavailable.
 */
export async function getDrawSummary(): Promise<DrawSummary> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return DRAW_SUMMARY_FALLBACK;

  try {
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase
      .from(VIEW)
      .select(COLUMNS)
      .limit(1)
      .maybeSingle();

    if (error) return DRAW_SUMMARY_FALLBACK;

    const row = readRecord(data);
    if (!row) return DRAW_SUMMARY_FALLBACK;

    return {
      totalDraws: readCount(row.total_draws, DRAW_SUMMARY_FALLBACK.totalDraws),
      pathwaysMapped: readCount(
        row.pathways_mapped,
        DRAW_SUMMARY_FALLBACK.pathwaysMapped,
      ),
      drawTypes: readCount(row.draw_types, DRAW_SUMMARY_FALLBACK.drawTypes),
      lastUpdatedIso: readIso(
        row.last_updated,
        DRAW_SUMMARY_FALLBACK.lastUpdatedIso,
      ),
    };
  } catch {
    return DRAW_SUMMARY_FALLBACK;
  }
}

/* -------------------------------------------------------------------------- */
/* Relative time — pure, dependency-free                                       */
/* -------------------------------------------------------------------------- */

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

function plural(count: number, unit: string): string {
  return `${count} ${unit}${count === 1 ? "" : "s"} ago`;
}

/**
 * "just now" / "6 hours ago" / "2 days ago".
 * Future and unparseable timestamps both read as "just now" so the proof bar
 * never renders a negative or NaN figure.
 */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "just now";

  const elapsed = Math.floor((now.getTime() - then) / 1000);
  if (elapsed < MINUTE) return "just now";
  if (elapsed < HOUR) return plural(Math.floor(elapsed / MINUTE), "minute");
  if (elapsed < DAY) return plural(Math.floor(elapsed / HOUR), "hour");
  if (elapsed < WEEK) return plural(Math.floor(elapsed / DAY), "day");
  if (elapsed < MONTH) return plural(Math.floor(elapsed / WEEK), "week");
  if (elapsed < YEAR) return plural(Math.floor(elapsed / MONTH), "month");
  return plural(Math.floor(elapsed / YEAR), "year");
}

export type RelativeTimeParts = {
  /** The figure set at Display size. "6", or the whole string when there is none. */
  value: string;
  /** The mono qualifier that sits beside it: "hours ago". Empty when unused. */
  unit: string;
};

/**
 * Splits a formatRelativeTime() string into the part that is a figure and the
 * part that is words: "6 hours ago" -> { value: "6", unit: "hours ago" }.
 *
 * DataBand needs this because its fourth cell must read as a huge numeral
 * beside a mono label like the other three, and because "18 minutes ago" set
 * whole at Display size overflows a quarter-width cell on a phone. Display
 * type is allowed to crop; a figure is not.
 *
 * Pure and total: anything without a leading integer — "just now" — comes back
 * unchanged with an empty unit, so this cannot throw and cannot lose text.
 */
export function splitRelativeTime(label: string): RelativeTimeParts {
  const match = /^(\d+)\s+(\S.*)$/.exec(label);
  const value = match?.[1];
  const unit = match?.[2];

  if (value === undefined || unit === undefined) {
    return { value: label, unit: "" };
  }

  return { value, unit };
}
