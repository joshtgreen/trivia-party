"use client";

import { useState } from "react";

interface QuestionCardProps {
  questionIndex: number;
  questionText: string;
  choices: string[];
  /** Set when answers are locked (timer expired or user answered). */
  locked: boolean;
  /** The user's selected choice index, or null if unanswered. */
  selectedIndex: number | null;
  /** Revealed after timer: the correct choice index. Null during question phase. */
  correctIndex: number | null;
  /** Called when the user picks an answer. */
  onAnswer: (choiceIndex: number) => void;
}

const CHOICE_LABELS = ["A", "B", "C", "D"];

/**
 * A single trivia question with 4 answer buttons.
 * Handles selection, lock, and reveal states.
 */
export function QuestionCard({
  questionIndex,
  questionText,
  choices,
  locked,
  selectedIndex,
  correctIndex,
  onAnswer,
}: QuestionCardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isReveal = correctIndex !== null;

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm font-mono" style={{ color: "var(--theme-accent)" }}>
          Question {questionIndex + 1}
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold leading-snug">
          {questionText}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {choices.map((choice, i) => {
          let bg = "var(--theme-surface)";
          let border = "transparent";
          let textColor = "var(--theme-text)";

          if (isReveal) {
            if (i === correctIndex) {
              bg = "rgba(34, 197, 94, 0.15)";
              border = "rgb(34, 197, 94)";
              textColor = "rgb(134, 239, 172)";
            } else if (i === selectedIndex && i !== correctIndex) {
              bg = "rgba(239, 68, 68, 0.15)";
              border = "rgb(239, 68, 68)";
              textColor = "rgb(252, 165, 165)";
            } else {
              textColor = "var(--theme-muted-text)";
            }
          } else if (i === selectedIndex) {
            bg = "var(--theme-primary)";
            textColor = "var(--theme-bg)";
            border = "var(--theme-primary)";
          } else if (i === hoveredIndex && !locked) {
            bg = "var(--theme-surface2)";
          }

          return (
            <button
              key={i}
              type="button"
              disabled={locked}
              onClick={() => onAnswer(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="rounded-lg px-4 py-4 text-left text-sm font-medium transition-all disabled:cursor-default"
              style={{
                backgroundColor: bg,
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: border,
                color: textColor,
              }}
            >
              <span className="font-mono mr-2 opacity-60">
                {CHOICE_LABELS[i]}
              </span>
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
