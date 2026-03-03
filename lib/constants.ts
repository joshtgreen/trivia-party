import type { Mood } from "./types";

// ── Motif library (spec §5.3) ──────────────────────────────────

export const ALLOWED_MOTIFS = [
  // space
  "motif-stars",
  "motif-planets",
  "motif-comets",
  // ocean
  "motif-waves",
  "motif-bubbles",
  "motif-coral",
  // literary
  "motif-books",
  "motif-scrollwork",
  "motif-inkblots",
  // tech
  "motif-circuits",
  "motif-grid",
  "motif-scanlines",
  // nature
  "motif-leaves",
  "motif-vines",
  "motif-pollen",
  // fire
  "motif-flames",
  "motif-smoke",
  "motif-sparks",
  // music
  "motif-notes",
  "motif-speakers",
  "motif-vinyl",
  // games
  "motif-dice",
  "motif-chess",
  "motif-pokerchips",
  // abstract
  "motif-speckles",
  "motif-checkers",
  "motif-confetti",
] as const;

export type MotifId = (typeof ALLOWED_MOTIFS)[number];

// ── Scoring config (spec §12) ──────────────────────────────────

export const SCORING = {
  TOTAL_MS: 20_000,
  BASE_POINTS: 1_000,
  SPEED_MAX: 500,
} as const;

// ── Room codes (spec §13) ──────────────────────────────────────

/** Uppercase alpha minus I and O (confusing with 1 and 0). */
export const ROOM_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ";
export const ROOM_CODE_LENGTH = 4;
export const ROOM_CODE_MAX_ATTEMPTS = 10;

// ── Game limits ────────────────────────────────────────────────

export const MAX_PLAYERS = 12;
export const QUESTION_COUNT = 20;
export const QUESTION_TIME_SECONDS = 20;
export const RESULTS_TTL_DAYS = 7;
export const HOST_DISCONNECT_AUTO_ADVANCE_MS = 60_000;

// ── Input validation ───────────────────────────────────────────

export const NAME_MIN_LENGTH = 1;
export const NAME_MAX_LENGTH = 18;
export const THEME_INPUT_MIN_LENGTH = 3;
export const THEME_INPUT_MAX_LENGTH = 80;

// ── Moods ──────────────────────────────────────────────────────

export const MOODS: Mood[] = ["clean", "muted", "noir", "bright"];
