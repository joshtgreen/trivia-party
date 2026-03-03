"use client";

import { Timer } from "./Timer";
import { QuestionCard } from "./QuestionCard";

interface QuestionData {
  questionIndex: number;
  question: string;
  choices: string[];
  endsAt: number;
}

interface GameViewProps {
  question: QuestionData;
  questionCount: number;
  endsAt: number;
  myAnswer: number | null;
  answeredPlayers: Set<string>;
  playerCount: number;
  onAnswer: (choiceIndex: number) => void;
}

export function GameView({
  question,
  questionCount,
  endsAt,
  myAnswer,
  answeredPlayers,
  playerCount,
  onAnswer,
}: GameViewProps) {
  const locked = myAnswer !== null;

  return (
    <div className="mx-auto max-w-xl space-y-8 pt-4">
      {/* Top bar: progress + timer */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-mono" style={{ color: "var(--theme-muted-text)" }}>
          {question.questionIndex + 1} / {questionCount}
        </p>
        <Timer endsAt={endsAt} />
        <p className="text-sm" style={{ color: "var(--theme-muted-text)" }}>
          {answeredPlayers.size}/{playerCount} answered
        </p>
      </div>

      {/* Question + choices */}
      <QuestionCard
        questionIndex={question.questionIndex}
        questionText={question.question}
        choices={question.choices}
        locked={locked}
        selectedIndex={myAnswer}
        correctIndex={null}
        onAnswer={onAnswer}
      />

      {locked && (
        <p className="text-center text-sm" style={{ color: "var(--theme-muted-text)" }}>
          Answer locked. Waiting for others...
        </p>
      )}
    </div>
  );
}
