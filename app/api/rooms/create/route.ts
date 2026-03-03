import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rooms } from "@/lib/schema";
import { generateTrivia } from "@/lib/claude";
import { generateRoomCode } from "@/lib/room-code";
import { validateName, validateThemeInput } from "@/lib/validation";
import { eq } from "drizzle-orm";
import type { Difficulty } from "@/lib/types";
import { ROOM_CODE_MAX_ATTEMPTS } from "@/lib/constants";

export const maxDuration = 60;

const VALID_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const ROOM_TTL_HOURS = 24;

export async function POST(request: Request) {
  let body: { hostName?: string; themeInput?: string; difficulty?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const nameResult = validateName(body.hostName ?? "");
  if (!nameResult.valid) {
    return NextResponse.json({ error: nameResult.error }, { status: 400 });
  }

  const themeResult = validateThemeInput(body.themeInput ?? "");
  if (!themeResult.valid) {
    return NextResponse.json({ error: themeResult.error }, { status: 400 });
  }

  if (!VALID_DIFFICULTIES.includes(body.difficulty as Difficulty)) {
    return NextResponse.json({ error: "Invalid difficulty." }, { status: 400 });
  }

  // Call Claude to generate questions + theme
  let llmResponse;
  try {
    llmResponse = await generateTrivia(
      body.themeInput!.trim(),
      body.difficulty as Difficulty
    );
  } catch (err) {
    console.error("Claude generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate trivia. Please try again." },
      { status: 502 }
    );
  }

  // Generate unique room code
  let code: string | null = null;
  for (let i = 0; i < ROOM_CODE_MAX_ATTEMPTS; i++) {
    const candidate = generateRoomCode();
    const existing = await db
      .select({ code: rooms.code })
      .from(rooms)
      .where(eq(rooms.code, candidate))
      .limit(1);
    if (existing.length === 0) {
      code = candidate;
      break;
    }
  }

  if (!code) {
    return NextResponse.json(
      { error: "Could not generate room code. Try again." },
      { status: 503 }
    );
  }

  // Insert room
  const expiresAt = new Date(Date.now() + ROOM_TTL_HOURS * 60 * 60 * 1000);

  await db.insert(rooms).values({
    code,
    status: "lobby",
    hostName: body.hostName!.trim(),
    themeInput: body.themeInput!.trim(),
    difficulty: body.difficulty as Difficulty,
    themeTokens: llmResponse.theme,
    questions: llmResponse.questions,
    expiresAt,
  });

  return NextResponse.json({ roomCode: code });
}
