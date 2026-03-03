"use client";

import { Button } from "@/components/ui/button";
import { Leaderboard } from "./Leaderboard";
import type { LeaderboardEntry } from "@/lib/types";

interface RevealData {
  questionIndex: number;
  correctIndex: number;
  explanation: string;
  leaderboard: LeaderboardEntry[];
}

interface RevealViewProps {
  revealData: RevealData;
  questionCount: number;
  myAnswer: number | null;
  isHost: boolean;
  onNext: () => void;
}

const CHOICE_LABELS = ["A", "B", "C", "D"];

export function RevealView({
  revealData,
  questionCount,
  myAnswer,
  isHost,
  onNext,
}: RevealViewProps) {
  const isCorrect = myAnswer === revealData.correctIndex;
  const isLast = revealData.questionIndex + 1 >= questionCount;

  return (
    <div className="mx-auto max-w-xl space-y-8 pt-4">
      {/* Result feedback */}
      <div className="text-center space-y-2">
        <p className="text-sm font-mono" style={{ color: "var(--theme-muted-text)" }}>
          Question {revealData.questionIndex + 1} / {questionCount}
        </p>
        {myAnswer !== null ? (
          <p className={`text-2xl font-bold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
            {isCorrect ? "Correct!" : "Wrong"}
          </p>
        ) : (
          <p className="text-2xl font-bold text-zinc-500">No answer</p>
        )}
        <p className="text-sm" style={{ color: "var(--theme-muted-text)" }}>
          The answer was <span className="font-semibold" style={{ color: "var(--theme-accent)" }}>
            {CHOICE_LABELS[revealData.correctIndex]}
          </span>
        </p>
      </div>

      {/* Explanation */}
      <div
        className="rounded-lg p-4 text-sm italic"
        style={{ backgroundColor: "var(--theme-surface)", color: "var(--theme-muted-text)" }}
      >
        {revealData.explanation}
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-center" style={{ color: "var(--theme-muted-text)" }}>
          Leaderboard
        </p>
        <Leaderboard entries={revealData.leaderboard} limit={5} />
      </div>

      {/* Host Next / Waiting */}
      {isHost ? (
        <Button
          onClick={onNext}
          size="lg"
          className="w-full text-base font-semibold"
          style={{ backgroundColor: "var(--theme-primary)", color: "var(--theme-bg)" }}
        >
          {isLast ? "See Results" : "Next Question"}
        </Button>
      ) : (
        <p className="text-center text-sm" style={{ color: "var(--theme-muted-text)" }}>
          Waiting for host...
        </p>
      )}
    </div>
  );
}
