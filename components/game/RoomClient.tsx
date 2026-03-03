"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRoom } from "@/lib/use-room";
import { themeVarsToStyle } from "@/lib/theme-engine";
import { LobbyView } from "./LobbyView";
import { GameView } from "./GameView";
import { RevealView } from "./RevealView";
import { FinishedView } from "./FinishedView";
import { JoinPrompt } from "./JoinPrompt";
import type { ThemeTokens, Question } from "@/lib/types";

interface RoomClientProps {
  code: string;
  themeTokens: ThemeTokens;
  questions: Question[];
  difficulty: string;
  themeInput: string;
  hostName: string;
}

export function RoomClient({
  code,
  themeTokens,
  questions,
  difficulty,
  themeInput,
  hostName: dbHostName,
}: RoomClientProps) {
  const searchParams = useSearchParams();
  const room = useRoom(code);
  const [joined, setJoined] = useState(false);
  const [myAnswer, setMyAnswer] = useState<number | null>(null);
  const initDone = useRef(false);

  const nameParam = searchParams.get("name");
  const avatarParam = searchParams.get("avatar") || "av-01";
  const isHostParam = searchParams.get("host") === "1";

  // Auto-join if name is in URL params (coming from /host or /join)
  useEffect(() => {
    if (!room.connected || joined || !nameParam) return;

    // If host, initialize room state in PartyKit first
    if (isHostParam && !initDone.current) {
      initDone.current = true;
      room.initRoom({
        themeInput,
        difficulty,
        themeTokens: themeTokens as unknown as Record<string, unknown>,
        questions,
      });
      // Small delay to let init complete before joining
      setTimeout(() => {
        room.joinRoom(nameParam, avatarParam, true);
        setJoined(true);
      }, 200);
    } else {
      room.joinRoom(nameParam, avatarParam, false);
      setJoined(true);
    }
  }, [room.connected, joined, nameParam, avatarParam, isHostParam, themeInput, difficulty, themeTokens, questions, room]);

  // Reset answer when question changes
  useEffect(() => {
    setMyAnswer(null);
  }, [room.currentQuestion?.questionIndex]);

  function handleJoinFromPrompt(name: string, avatarId: string) {
    room.joinRoom(name, avatarId, false);
    setJoined(true);
  }

  function handleAnswer(choiceIndex: number) {
    if (myAnswer !== null) return; // Already answered
    setMyAnswer(choiceIndex);
    room.submitAnswer(choiceIndex);
  }

  const style = themeVarsToStyle(themeTokens);
  const isHost = room.myId ? room.roomState?.players[room.myId]?.isHost === true : false;

  return (
    <main
      style={{
        ...style,
        backgroundColor: "var(--theme-bg)",
        color: "var(--theme-text)",
        minHeight: "100dvh",
      }}
      className="px-6 py-8"
    >
      {room.error && (
        <div className="mx-auto mb-4 max-w-xl rounded-lg border border-red-900 bg-red-950/50 p-3 text-center text-sm text-red-300">
          {room.error}
        </div>
      )}

      {!room.connected && (
        <div className="flex min-h-[60dvh] items-center justify-center">
          <div className="text-center space-y-3">
            <div className="h-6 w-6 mx-auto animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
            <p style={{ color: "var(--theme-muted-text)" }}>Connecting...</p>
          </div>
        </div>
      )}

      {room.connected && !joined && !nameParam && (
        <JoinPrompt
          code={code}
          themeTokens={themeTokens}
          onJoin={handleJoinFromPrompt}
        />
      )}

      {room.connected && joined && room.roomState?.status === "lobby" && (
        <LobbyView
          code={code}
          themeTokens={themeTokens}
          difficulty={difficulty}
          players={room.roomState.players}
          isHost={isHost}
          onStart={room.startGame}
        />
      )}

      {room.connected && joined && room.roomState?.status === "question" && room.currentQuestion && (
        <GameView
          question={room.currentQuestion}
          questionCount={room.roomState.questionCount}
          endsAt={room.currentQuestion.endsAt}
          myAnswer={myAnswer}
          answeredPlayers={room.answeredPlayers}
          playerCount={Object.keys(room.roomState.players).length}
          onAnswer={handleAnswer}
        />
      )}

      {room.connected && joined && room.roomState?.status === "reveal_waiting" && room.revealData && (
        <RevealView
          revealData={room.revealData}
          questionCount={room.roomState?.questionCount || 20}
          myAnswer={myAnswer}
          isHost={isHost}
          onNext={room.hostNext}
        />
      )}

      {room.connected && joined && room.roomState?.status === "finished" && room.finishedData && (
        <FinishedView
          leaderboard={room.finishedData.finalLeaderboard}
          myId={room.myId}
          themeTokens={themeTokens}
          code={code}
        />
      )}
    </main>
  );
}
