"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import usePartySocket from "partysocket/react";
import type { LeaderboardEntry } from "./types";

// ── Public state types ─────────────────────────────────────────

interface PublicPlayer {
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
  status: "lobby" | "question" | "reveal_waiting" | "finished";
  hostId: string;
  themeInput: string;
  difficulty: string;
  themeTokens: Record<string, unknown>;
  players: Record<string, PublicPlayer>;
  currentQuestionIndex: number;
  questionCount: number;
  endsAt: number | null;
}

interface QuestionData {
  questionIndex: number;
  question: string;
  choices: string[];
  endsAt: number;
}

interface RevealData {
  questionIndex: number;
  correctIndex: number;
  explanation: string;
  leaderboard: LeaderboardEntry[];
}

interface FinishedData {
  finalLeaderboard: LeaderboardEntry[];
}

// ── Hook return type ───────────────────────────────────────────

export interface UseRoomReturn {
  connected: boolean;
  roomState: RoomState | null;
  currentQuestion: QuestionData | null;
  revealData: RevealData | null;
  finishedData: FinishedData | null;
  myId: string | null;
  answeredPlayers: Set<string>;
  error: string | null;
  // Actions
  joinRoom: (name: string, avatarId: string, isHost: boolean) => void;
  initRoom: (data: {
    themeInput: string;
    difficulty: string;
    themeTokens: Record<string, unknown>;
    questions: unknown[];
  }) => void;
  startGame: () => void;
  submitAnswer: (choiceIndex: number) => void;
  hostNext: () => void;
}

// ── Hook ───────────────────────────────────────────────────────

const PARTYKIT_HOST =
  process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";

export function useRoom(roomCode: string): UseRoomReturn {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [revealData, setRevealData] = useState<RevealData | null>(null);
  const [finishedData, setFinishedData] = useState<FinishedData | null>(null);
  const [answeredPlayers, setAnsweredPlayers] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const myIdRef = useRef<string | null>(null);

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: roomCode,
    onOpen() {
      myIdRef.current = socket.id;
    },
    onMessage(event) {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case "room_state":
          setRoomState(msg);
          setError(null);
          break;

        case "player_joined":
          setRoomState((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              players: { ...prev.players, [msg.player.id]: msg.player },
            };
          });
          break;

        case "player_left":
          setRoomState((prev) => {
            if (!prev) return prev;
            const players = { ...prev.players };
            if (players[msg.playerId]) {
              players[msg.playerId] = { ...players[msg.playerId], connected: false };
            }
            return { ...prev, players };
          });
          break;

        case "question":
          setCurrentQuestion({
            questionIndex: msg.questionIndex,
            question: msg.question,
            choices: msg.choices,
            endsAt: msg.endsAt,
          });
          setRevealData(null);
          setAnsweredPlayers(new Set());
          setRoomState((prev) =>
            prev ? { ...prev, status: "question", endsAt: msg.endsAt, currentQuestionIndex: msg.questionIndex } : prev
          );
          break;

        case "answer_accepted":
          setAnsweredPlayers((prev) => new Set(prev).add(msg.playerId));
          break;

        case "reveal":
          setRevealData({
            questionIndex: msg.questionIndex,
            correctIndex: msg.correctIndex,
            explanation: msg.explanation,
            leaderboard: msg.leaderboard,
          });
          setRoomState((prev) => (prev ? { ...prev, status: "reveal_waiting" } : prev));
          break;

        case "finished":
          setFinishedData({ finalLeaderboard: msg.finalLeaderboard });
          setRoomState((prev) => (prev ? { ...prev, status: "finished" } : prev));
          break;

        case "error":
          setError(msg.message);
          break;
      }
    },
  });

  const joinRoom = useCallback(
    (name: string, avatarId: string, isHost: boolean) => {
      socket.send(JSON.stringify({ type: "join_room", name, avatarId, isHost }));
    },
    [socket]
  );

  const initRoom = useCallback(
    (data: {
      themeInput: string;
      difficulty: string;
      themeTokens: Record<string, unknown>;
      questions: unknown[];
    }) => {
      socket.send(JSON.stringify({ type: "init_room", ...data }));
    },
    [socket]
  );

  const startGame = useCallback(() => {
    socket.send(JSON.stringify({ type: "host_start" }));
  }, [socket]);

  const submitAnswer = useCallback(
    (choiceIndex: number) => {
      socket.send(JSON.stringify({ type: "submit_answer", choiceIndex }));
    },
    [socket]
  );

  const hostNext = useCallback(() => {
    socket.send(JSON.stringify({ type: "host_next" }));
  }, [socket]);

  return {
    connected: socket.readyState === WebSocket.OPEN,
    roomState,
    currentQuestion,
    revealData,
    finishedData,
    myId: myIdRef.current ?? socket.id,
    answeredPlayers,
    error,
    joinRoom,
    initRoom,
    startGame,
    submitAnswer,
    hostNext,
  };
}
