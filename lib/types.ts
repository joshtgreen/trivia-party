// ── Question & LLM response types ──────────────────────────────

export interface Question {
  id: string;
  question: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export type Mood = "clean" | "muted" | "noir" | "bright";

export interface ThemeTokens {
  input: string;
  displayName: string;
  primaryHue: number;
  accentHue: number;
  mood: Mood;
  badgeText: string;
  backgroundMotifs: string[];
  density: number;
}

export interface LLMResponse {
  theme: ThemeTokens;
  difficulty: Difficulty;
  questions: Question[];
}

// ── Room & game state ──────────────────────────────────────────

export type Difficulty = "easy" | "medium" | "hard";

export type RoomStatus =
  | "generating"
  | "lobby"
  | "question"
  | "reveal_waiting"
  | "finished";

export interface Player {
  id: string;
  name: string;
  avatarId: string;
  score: number;
  correctCount: number;
  totalAnswerTimeMs: number;
  isHost: boolean;
  connected: boolean;
}

export interface Room {
  code: string;
  status: RoomStatus;
  theme: ThemeTokens;
  difficulty: Difficulty;
  questions: Question[];
  players: Player[];
  currentQuestionIndex: number;
  endsAt: number | null;
}

// ── Leaderboard ────────────────────────────────────────────────

export interface LeaderboardEntry {
  playerId: string;
  name: string;
  avatarId: string;
  score: number;
  correctCount: number;
}

// ── Results persistence ────────────────────────────────────────

export interface GameResults {
  id: string;
  roomCode: string;
  themeInput: string;
  difficulty: Difficulty;
  themeTokens: ThemeTokens;
  finalLeaderboard: LeaderboardEntry[];
  createdAt: Date;
  expiresAt: Date;
}

// ── API payloads ───────────────────────────────────────────────

export interface CreateRoomRequest {
  hostName: string;
  themeInput: string;
  difficulty: Difficulty;
  avatarId: string;
}

export interface CreateRoomResponse {
  roomCode: string;
  hostToken: string;
}
