import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  THEME_INPUT_MIN_LENGTH,
  THEME_INPUT_MAX_LENGTH,
  QUESTION_COUNT,
  ALLOWED_MOTIFS,
  MOODS,
} from "./constants";
import type { LLMResponse, Mood } from "./types";

// ── Input validation ───────────────────────────────────────────

export function validateName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();
  if (trimmed.length < NAME_MIN_LENGTH) {
    return { valid: false, error: "Name is required." };
  }
  if (trimmed.length > NAME_MAX_LENGTH) {
    return { valid: false, error: `Name must be ${NAME_MAX_LENGTH} characters or fewer.` };
  }
  return { valid: true };
}

export function validateThemeInput(input: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = input.trim();
  if (trimmed.length < THEME_INPUT_MIN_LENGTH) {
    return { valid: false, error: `Theme must be at least ${THEME_INPUT_MIN_LENGTH} characters.` };
  }
  if (trimmed.length > THEME_INPUT_MAX_LENGTH) {
    return { valid: false, error: `Theme must be ${THEME_INPUT_MAX_LENGTH} characters or fewer.` };
  }
  return { valid: true };
}

// ── LLM output validation (spec §8.5) ─────────────────────────

export function validateLLMResponse(data: unknown): {
  valid: boolean;
  errors: string[];
  parsed?: LLMResponse;
} {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Response is not an object."] };
  }

  const obj = data as Record<string, unknown>;

  // ── Theme tokens ──
  if (!obj.theme || typeof obj.theme !== "object") {
    errors.push("Missing or invalid 'theme' object.");
  } else {
    const theme = obj.theme as Record<string, unknown>;

    if (typeof theme.displayName !== "string" || !theme.displayName) {
      errors.push("theme.displayName must be a non-empty string.");
    }
    if (typeof theme.primaryHue !== "number" || theme.primaryHue < 0 || theme.primaryHue > 359) {
      errors.push("theme.primaryHue must be 0–359.");
    }
    if (typeof theme.accentHue !== "number" || theme.accentHue < 0 || theme.accentHue > 359) {
      errors.push("theme.accentHue must be 0–359.");
    }
    if (!MOODS.includes(theme.mood as Mood)) {
      errors.push(`theme.mood must be one of: ${MOODS.join(", ")}.`);
    }
    if (typeof theme.badgeText !== "string" || theme.badgeText.length < 2 || theme.badgeText.length > 8) {
      errors.push("theme.badgeText must be 2–8 characters.");
    }
    if (!Array.isArray(theme.backgroundMotifs) || theme.backgroundMotifs.length < 2 || theme.backgroundMotifs.length > 4) {
      errors.push("theme.backgroundMotifs must be an array of 2–4 motif IDs.");
    } else {
      const invalidMotifs = (theme.backgroundMotifs as string[]).filter(
        (m) => !ALLOWED_MOTIFS.includes(m as (typeof ALLOWED_MOTIFS)[number])
      );
      if (invalidMotifs.length > 0) {
        errors.push(`Invalid motifs: ${invalidMotifs.join(", ")}.`);
      }
    }
    if (typeof theme.density !== "number" || theme.density < 0.2 || theme.density > 0.9) {
      errors.push("theme.density must be 0.2–0.9.");
    }
  }

  // ── Questions ──
  if (!Array.isArray(obj.questions)) {
    errors.push("Missing 'questions' array.");
  } else {
    if (obj.questions.length !== QUESTION_COUNT) {
      errors.push(`Expected ${QUESTION_COUNT} questions, got ${obj.questions.length}.`);
    }

    (obj.questions as Record<string, unknown>[]).forEach((q, i) => {
      const prefix = `questions[${i}]`;

      if (typeof q.question !== "string" || !q.question) {
        errors.push(`${prefix}.question must be a non-empty string.`);
      }
      if (!Array.isArray(q.choices) || q.choices.length !== 4) {
        errors.push(`${prefix}.choices must have exactly 4 items.`);
      } else if ((q.choices as unknown[]).some((c) => typeof c !== "string" || !c)) {
        errors.push(`${prefix}.choices must all be non-empty strings.`);
      }
      if (typeof q.correctIndex !== "number" || ![0, 1, 2, 3].includes(q.correctIndex)) {
        errors.push(`${prefix}.correctIndex must be 0, 1, 2, or 3.`);
      }
      if (typeof q.explanation !== "string" || !q.explanation) {
        errors.push(`${prefix}.explanation must be a non-empty string.`);
      }
    });

    // Check for duplicate questions
    const seen = new Set<string>();
    (obj.questions as Record<string, unknown>[]).forEach((q, i) => {
      if (typeof q.question === "string") {
        const normalized = q.question.toLowerCase().replace(/[^\w\s]/g, "").trim();
        if (seen.has(normalized)) {
          errors.push(`questions[${i}] is a duplicate.`);
        }
        seen.add(normalized);
      }
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, errors: [], parsed: data as unknown as LLMResponse };
}
