import type { Difficulty, LLMResponse } from "./types";
import { ALLOWED_MOTIFS, QUESTION_COUNT } from "./constants";
import { validateLLMResponse } from "./validation";

const SYSTEM_PROMPT = `You are a professional trivia writer and art director for UI theming. Output MUST be valid JSON matching the provided schema. Do not include any extra text.`;

function buildUserPrompt(themeInput: string, difficulty: Difficulty): string {
  return `Theme/Subject: ${themeInput}
Difficulty: ${difficulty}
  - easy = common knowledge
  - medium = enthusiast knowledge
  - hard = arcane/obscure but still factual and unambiguous

Create exactly ${QUESTION_COUNT} multiple-choice trivia questions.
Each question must have 4 choices and exactly one correct answer.
Provide a 1–2 sentence explanation for the correct answer.

Also choose theme tokens for the room's visual design:
  - primaryHue: integer 0–359
  - accentHue: integer 0–359
  - mood: one of ["clean","muted","noir","bright"]
  - badgeText: 2–8 chars, uppercase, no profanity
  - backgroundMotifs: choose 2–4 from the allowed list ONLY
  - density: float 0.2–0.9

Allowed motifs: ${JSON.stringify(ALLOWED_MOTIFS)}

Return JSON only, matching this schema:
{
  "theme": {
    "input": "<original theme input>",
    "displayName": "<creative display name>",
    "primaryHue": <0-359>,
    "accentHue": <0-359>,
    "mood": "<clean|muted|noir|bright>",
    "badgeText": "<2-8 UPPERCASE CHARS>",
    "backgroundMotifs": ["<motif-id>", ...],
    "density": <0.2-0.9>
  },
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": "q1",
      "question": "<question text>",
      "choices": ["<A>", "<B>", "<C>", "<D>"],
      "correctIndex": <0-3>,
      "explanation": "<1-2 sentences>"
    }
  ]
}`;
}

/**
 * Generate trivia questions and room theme tokens via Claude.
 * Includes one retry with a repair prompt if validation fails.
 */
export async function generateTrivia(
  themeInput: string,
  difficulty: Difficulty
): Promise<LLMResponse> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();

  // First attempt
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(themeInput, difficulty) }],
  });

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    // If JSON parse fails, try one retry
    return retryGeneration(client, themeInput, difficulty, ["Response was not valid JSON."]);
  }

  const result = validateLLMResponse(parsed);
  if (result.valid && result.parsed) {
    return result.parsed;
  }

  // Retry with repair prompt
  return retryGeneration(client, themeInput, difficulty, result.errors);
}

async function retryGeneration(
  client: InstanceType<typeof import("@anthropic-ai/sdk").default>,
  themeInput: string,
  difficulty: Difficulty,
  reasons: string[]
): Promise<LLMResponse> {
  const repairPrompt = `Your previous output failed schema validation because:\n${reasons.map((r) => `- ${r}`).join("\n")}\n\nPlease regenerate. ${buildUserPrompt(themeInput, difficulty)}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: repairPrompt }],
  });

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  const parsed = JSON.parse(text);
  const result = validateLLMResponse(parsed);

  if (!result.valid || !result.parsed) {
    throw new Error(
      `LLM output failed validation after retry: ${result.errors.join("; ")}`
    );
  }

  return result.parsed;
}
