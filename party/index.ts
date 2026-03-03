import type * as Party from "partykit/server";

// ── Types ──────────────────────────────────────────────────────

type RoomStatus = "lobby" | "question" | "reveal_waiting" | "finished";

interface Question {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

interface Player {
  id: string;
  name: string;
  avatarId: string;
  score: number;
  correctCount: number;
  totalAnswerTimeMs: number;
  isHost: boolean;
  connected: boolean;
}

interface RoomState {
  status: RoomStatus;
  hostId: string;
  themeInput: string;
  difficulty: string;
  themeTokens: Record<string, unknown>;
  questions: Question[];
  players: Record<string, Player>;
  currentQuestionIndex: number;
  endsAt: number | null;
  answers: Record<string, { choiceIndex: number; timestamp: number }>;
}

// ── Scoring constants ──────────────────────────────────────────

const TOTAL_MS = 20_000;
const BASE_POINTS = 1_000;
const SPEED_MAX = 500;
const HOST_DISCONNECT_AUTO_ADVANCE_MS = 60_000;

function calcScore(remainingMs: number): number {
  const clamped = Math.max(0, Math.min(remainingMs, TOTAL_MS));
  return BASE_POINTS + Math.round(SPEED_MAX * clamped / TOTAL_MS);
}

// ── Server ─────────────────────────────────────────────────────

export default class TriviaRoom implements Party.Server {
  state: RoomState | null = null;
  timerTimeout: ReturnType<typeof setTimeout> | null = null;
  autoAdvanceTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(readonly room: Party.Room) {}

  /** Load room data from storage on first access. */
  async onStart() {
    const stored = await this.room.storage.get<RoomState>("state");
    if (stored) {
      this.state = stored;
    }
  }

  /** Handle new WebSocket connection. */
  async onConnect(conn: Party.Connection) {
    // Send current state immediately so the client can render
    if (this.state) {
      this.sendToConn(conn, "room_state", this.getPublicState());
    }
  }

  /** Handle incoming messages. */
  async onMessage(message: string, sender: Party.Connection) {
    let msg: { type: string; [key: string]: unknown };
    try {
      msg = JSON.parse(message);
    } catch {
      this.sendToConn(sender, "error", { message: "Invalid JSON." });
      return;
    }

    switch (msg.type) {
      case "init_room":
        return this.handleInitRoom(msg, sender);
      case "join_room":
        return this.handleJoinRoom(msg, sender);
      case "host_start":
        return this.handleHostStart(sender);
      case "submit_answer":
        return this.handleSubmitAnswer(msg, sender);
      case "host_next":
        return this.handleHostNext(sender);
      default:
        this.sendToConn(sender, "error", { message: `Unknown message type: ${msg.type}` });
    }
  }

  /** Handle player disconnect. */
  async onClose(conn: Party.Connection) {
    if (!this.state) return;

    const playerId = conn.id;
    const player = this.state.players[playerId];
    if (player) {
      player.connected = false;
      await this.saveState();
      this.broadcast("player_left", { playerId });

      // If host disconnects during reveal_waiting, auto-advance after timeout
      if (player.isHost && this.state.status === "reveal_waiting") {
        this.autoAdvanceTimeout = setTimeout(() => {
          this.advanceQuestion();
        }, HOST_DISCONNECT_AUTO_ADVANCE_MS);
      }
    }
  }

  // ── Message handlers ───────────────────────────────────────

  /** Initialize room state from the Next.js API. Called once after room creation. */
  private async handleInitRoom(
    msg: { type: string; [key: string]: unknown },
    sender: Party.Connection
  ) {
    if (this.state) {
      // Room already initialized — just send the state
      this.sendToConn(sender, "room_state", this.getPublicState());
      return;
    }

    this.state = {
      status: "lobby",
      hostId: sender.id,
      themeInput: msg.themeInput as string,
      difficulty: msg.difficulty as string,
      themeTokens: msg.themeTokens as Record<string, unknown>,
      questions: msg.questions as Question[],
      players: {},
      currentQuestionIndex: 0,
      endsAt: null,
      answers: {},
    };

    await this.saveState();
    this.sendToConn(sender, "room_state", this.getPublicState());
  }

  /** Player joins the room. */
  private async handleJoinRoom(
    msg: { type: string; [key: string]: unknown },
    sender: Party.Connection
  ) {
    if (!this.state) {
      this.sendToConn(sender, "error", { message: "Room not initialized." });
      return;
    }

    const name = (msg.name as string || "").trim();
    const avatarId = (msg.avatarId as string) || "av-01";
    const isHost = msg.isHost === true;

    if (!name || name.length > 18) {
      this.sendToConn(sender, "error", { message: "Invalid name." });
      return;
    }

    // Check player limit (12) — only for non-spectators in lobby
    const playerCount = Object.keys(this.state.players).length;
    if (playerCount >= 12 && this.state.status === "lobby") {
      this.sendToConn(sender, "error", { message: "Room is full." });
      return;
    }

    // If game already started and player is new, they're a spectator (can watch, can't answer)
    const isSpectator = this.state.status !== "lobby" && !this.state.players[sender.id];

    if (!isSpectator) {
      this.state.players[sender.id] = {
        id: sender.id,
        name,
        avatarId,
        score: 0,
        correctCount: 0,
        totalAnswerTimeMs: 0,
        isHost,
        connected: true,
      };
    }

    await this.saveState();

    // Send full state to the joiner
    this.sendToConn(sender, "room_state", this.getPublicState());

    // Broadcast player joined to everyone else
    if (!isSpectator) {
      this.broadcast("player_joined", {
        player: this.state.players[sender.id],
      });
    }
  }

  /** Host starts the game. */
  private async handleHostStart(sender: Party.Connection) {
    if (!this.state) return;

    if (this.state.players[sender.id]?.isHost !== true) {
      this.sendToConn(sender, "error", { message: "Only the host can start." });
      return;
    }

    if (this.state.status !== "lobby") {
      this.sendToConn(sender, "error", { message: "Game already started." });
      return;
    }

    this.startQuestion();
  }

  /** Player submits an answer. */
  private async handleSubmitAnswer(
    msg: { type: string; [key: string]: unknown },
    sender: Party.Connection
  ) {
    if (!this.state || this.state.status !== "question") return;

    const playerId = sender.id;
    if (!this.state.players[playerId]) return; // Spectators can't answer
    if (this.state.answers[playerId]) return; // Already answered

    const choiceIndex = msg.choiceIndex as number;
    if (typeof choiceIndex !== "number" || choiceIndex < 0 || choiceIndex > 3) return;

    const now = Date.now();
    if (this.state.endsAt && now > this.state.endsAt) return; // Timer expired

    this.state.answers[playerId] = { choiceIndex, timestamp: now };
    await this.saveState();

    // Notify everyone that this player answered (but not what they picked)
    this.broadcast("answer_accepted", { playerId });

    // If all players have answered, end early
    const playerIds = Object.keys(this.state.players);
    const allAnswered = playerIds.every((id) => this.state!.answers[id]);
    if (allAnswered) {
      this.endQuestion();
    }
  }

  /** Host clicks Next to advance to the next question. */
  private async handleHostNext(sender: Party.Connection) {
    if (!this.state) return;

    if (this.state.players[sender.id]?.isHost !== true) {
      this.sendToConn(sender, "error", { message: "Only the host can advance." });
      return;
    }

    if (this.state.status !== "reveal_waiting") {
      this.sendToConn(sender, "error", { message: "Not in reveal state." });
      return;
    }

    if (this.autoAdvanceTimeout) {
      clearTimeout(this.autoAdvanceTimeout);
      this.autoAdvanceTimeout = null;
    }

    this.advanceQuestion();
  }

  // ── Game flow ──────────────────────────────────────────────

  private async startQuestion() {
    if (!this.state) return;

    const q = this.state.questions[this.state.currentQuestionIndex];
    if (!q) return;

    this.state.status = "question";
    this.state.endsAt = Date.now() + TOTAL_MS;
    this.state.answers = {};

    await this.saveState();

    this.broadcast("question", {
      questionIndex: this.state.currentQuestionIndex,
      question: q.question,
      choices: q.choices,
      endsAt: this.state.endsAt,
    });

    // Set timer to auto-end the question
    this.timerTimeout = setTimeout(() => {
      this.endQuestion();
    }, TOTAL_MS + 500); // +500ms grace for network latency
  }

  private async endQuestion() {
    if (!this.state || this.state.status !== "question") return;

    if (this.timerTimeout) {
      clearTimeout(this.timerTimeout);
      this.timerTimeout = null;
    }

    const q = this.state.questions[this.state.currentQuestionIndex];

    // Score each player
    for (const [playerId, answer] of Object.entries(this.state.answers)) {
      const player = this.state.players[playerId];
      if (!player) continue;

      const correct = answer.choiceIndex === q.correctIndex;
      if (correct) {
        const remainingMs = Math.max(0, (this.state.endsAt || 0) - answer.timestamp);
        player.score += calcScore(remainingMs);
        player.correctCount += 1;
        player.totalAnswerTimeMs += TOTAL_MS - remainingMs;
      } else {
        player.totalAnswerTimeMs += TOTAL_MS;
      }
    }

    // Players who didn't answer get nothing
    for (const playerId of Object.keys(this.state.players)) {
      if (!this.state.answers[playerId]) {
        this.state.players[playerId].totalAnswerTimeMs += TOTAL_MS;
      }
    }

    this.state.status = "reveal_waiting";
    await this.saveState();

    // Build leaderboard (sorted by score desc, then correctCount, then time)
    const leaderboard = Object.values(this.state.players)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
        return a.totalAnswerTimeMs - b.totalAnswerTimeMs;
      })
      .map((p) => ({
        playerId: p.id,
        name: p.name,
        avatarId: p.avatarId,
        score: p.score,
        correctCount: p.correctCount,
      }));

    this.broadcast("reveal", {
      questionIndex: this.state.currentQuestionIndex,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      leaderboard,
    });
  }

  private async advanceQuestion() {
    if (!this.state) return;

    this.state.currentQuestionIndex += 1;

    if (this.state.currentQuestionIndex >= this.state.questions.length) {
      // Game over
      this.state.status = "finished";
      await this.saveState();

      const finalLeaderboard = Object.values(this.state.players)
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
          return a.totalAnswerTimeMs - b.totalAnswerTimeMs;
        })
        .map((p) => ({
          playerId: p.id,
          name: p.name,
          avatarId: p.avatarId,
          score: p.score,
          correctCount: p.correctCount,
        }));

      this.broadcast("finished", { finalLeaderboard });
    } else {
      this.startQuestion();
    }
  }

  // ── Utilities ──────────────────────────────────────────────

  /** Get state safe for clients (strips answers and correct answers from current question). */
  private getPublicState() {
    if (!this.state) return null;

    return {
      status: this.state.status,
      hostId: this.state.hostId,
      themeInput: this.state.themeInput,
      difficulty: this.state.difficulty,
      themeTokens: this.state.themeTokens,
      players: this.state.players,
      currentQuestionIndex: this.state.currentQuestionIndex,
      questionCount: this.state.questions.length,
      endsAt: this.state.endsAt,
    };
  }

  private broadcast(type: string, data: unknown) {
    const message = JSON.stringify({ type, ...data as Record<string, unknown> });
    this.room.broadcast(message);
  }

  private sendToConn(conn: Party.Connection, type: string, data: unknown) {
    conn.send(JSON.stringify({ type, ...data as Record<string, unknown> }));
  }

  private async saveState() {
    if (this.state) {
      await this.room.storage.put("state", this.state);
    }
  }
}

TriviaRoom satisfies Party.Worker;
