"use client";

import { AvatarIcon } from "./AvatarIcon";
import { getAvatarById } from "@/lib/avatars";
import type { LeaderboardEntry } from "@/lib/types";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  /** Highlight this player's row. */
  currentPlayerId?: string;
  /** How many rows to show (default: 5). */
  limit?: number;
}

/**
 * Live leaderboard showing top players with scores.
 * Used during gameplay (top 5 + current player) and on the results screen (full list).
 */
export function Leaderboard({
  entries,
  currentPlayerId,
  limit = 5,
}: LeaderboardProps) {
  const sorted = [...entries].sort((a, b) => b.score - a.score);
  const display = limit > 0 ? sorted.slice(0, limit) : sorted;

  // If current player is outside the top N, append them
  const currentInDisplay = display.some((e) => e.playerId === currentPlayerId);
  const currentEntry = currentPlayerId
    ? sorted.find((e) => e.playerId === currentPlayerId)
    : null;

  return (
    <div className="w-full max-w-sm mx-auto space-y-2">
      {display.map((entry, i) => (
        <LeaderboardRow
          key={entry.playerId}
          entry={entry}
          rank={i + 1}
          isCurrent={entry.playerId === currentPlayerId}
        />
      ))}

      {!currentInDisplay && currentEntry && (
        <>
          <div className="text-center text-xs" style={{ color: "var(--theme-muted-text)" }}>
            &middot;&middot;&middot;
          </div>
          <LeaderboardRow
            entry={currentEntry}
            rank={sorted.indexOf(currentEntry) + 1}
            isCurrent
          />
        </>
      )}
    </div>
  );
}

function LeaderboardRow({
  entry,
  rank,
  isCurrent,
}: {
  entry: LeaderboardEntry;
  rank: number;
  isCurrent: boolean;
}) {
  const avatar = getAvatarById(entry.avatarId);

  return (
    <div
      className="flex items-center gap-3 rounded-lg px-4 py-3"
      style={{
        backgroundColor: "var(--theme-surface)",
        outline: isCurrent ? "2px solid var(--theme-accent)" : undefined,
        outlineOffset: -1,
      }}
    >
      <span
        className="w-6 text-center text-sm font-mono font-bold"
        style={{ color: "var(--theme-accent)" }}
      >
        {rank}
      </span>

      {avatar && <AvatarIcon avatar={avatar} size={32} />}

      <span className="flex-1 text-sm font-medium truncate">
        {entry.name}
      </span>

      <div className="text-right">
        <span className="text-sm font-bold font-mono tabular-nums">
          {entry.score.toLocaleString()}
        </span>
        <span
          className="block text-xs"
          style={{ color: "var(--theme-muted-text)" }}
        >
          {entry.correctCount} correct
        </span>
      </div>
    </div>
  );
}
