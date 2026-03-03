import { SCORING } from "./constants";

export interface ScoreResult {
  base: number;
  speed: number;
  total: number;
}

/**
 * Calculate score for a correct answer based on remaining time.
 * Returns { base: 0, speed: 0, total: 0 } for incorrect / no answer.
 *
 * Spec §12:
 *   base  = 1000
 *   speed = round(500 * remainingMs / 20000)   → 0–500
 *   total = base + speed
 */
export function calculateScore(
  remainingMs: number,
  correct: boolean
): ScoreResult {
  if (!correct) {
    return { base: 0, speed: 0, total: 0 };
  }

  const clamped = Math.max(0, Math.min(remainingMs, SCORING.TOTAL_MS));
  const base = SCORING.BASE_POINTS;
  const speed = Math.round(SCORING.SPEED_MAX * clamped / SCORING.TOTAL_MS);

  return { base, speed, total: base + speed };
}

/**
 * Compare two players for leaderboard ranking.
 * Tie-break order (spec §12): score → correctCount → lower totalAnswerTimeMs.
 * Returns negative if `a` ranks higher.
 */
export function compareRank(
  a: { score: number; correctCount: number; totalAnswerTimeMs: number },
  b: { score: number; correctCount: number; totalAnswerTimeMs: number }
): number {
  if (b.score !== a.score) return b.score - a.score;
  if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
  return a.totalAnswerTimeMs - b.totalAnswerTimeMs;
}
