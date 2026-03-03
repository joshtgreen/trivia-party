"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaderboard } from "./Leaderboard";
import type { LeaderboardEntry, ThemeTokens } from "@/lib/types";

interface FinishedViewProps {
  leaderboard: LeaderboardEntry[];
  myId: string | null;
  themeTokens: ThemeTokens;
  code: string;
}

export function FinishedView({ leaderboard, myId, themeTokens, code }: FinishedViewProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const winner = leaderboard[0];

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto max-w-lg space-y-8 pt-8">
      {/* Confetti burst (CSS-only) */}
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10%",
                width: `${6 + Math.random() * 8}px`,
                height: `${6 + Math.random() * 8}px`,
                backgroundColor: [
                  "var(--theme-accent)",
                  "var(--theme-primary)",
                  "#FFD700",
                  "#FF6B6B",
                  "#48BFE3",
                  "#80ED99",
                ][i % 6],
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Winner announcement */}
      <div className="text-center space-y-4">
        <p className="text-sm uppercase tracking-widest" style={{ color: "var(--theme-muted-text)" }}>
          Game Over
        </p>
        <h1 className="text-4xl font-bold">
          {winner?.name} wins!
        </h1>
        <p className="text-lg font-mono tabular-nums" style={{ color: "var(--theme-accent)" }}>
          {winner?.score.toLocaleString()} points
        </p>
      </div>

      {/* Full leaderboard */}
      <Leaderboard entries={leaderboard} currentPlayerId={myId ?? undefined} limit={0} />

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          asChild
          className="flex-1"
          size="lg"
          style={{ backgroundColor: "var(--theme-primary)", color: "var(--theme-bg)" }}
        >
          <Link href="/host">New Game</Link>
        </Button>
        <Button
          asChild
          className="flex-1"
          size="lg"
          variant="outline"
          style={{ borderColor: "var(--theme-surface2)", color: "var(--theme-text)" }}
        >
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}
