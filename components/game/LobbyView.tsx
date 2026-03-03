"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarIcon } from "./AvatarIcon";
import { ShareSection } from "./ShareSection";
import { getAvatarById } from "@/lib/avatars";
import type { ThemeTokens } from "@/lib/types";

interface Player {
  id: string;
  name: string;
  avatarId: string;
  isHost: boolean;
  connected: boolean;
}

interface LobbyViewProps {
  code: string;
  themeTokens: ThemeTokens;
  difficulty: string;
  players: Record<string, Player>;
  isHost: boolean;
  onStart: () => void;
}

export function LobbyView({
  code,
  themeTokens,
  difficulty,
  players,
  isHost,
  onStart,
}: LobbyViewProps) {
  const playerList = Object.values(players);
  const connectedCount = playerList.filter((p) => p.connected).length;

  return (
    <div className="mx-auto max-w-lg space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge
          className="text-xs font-bold tracking-widest"
          style={{
            backgroundColor: "var(--theme-accent)",
            color: "var(--theme-bg)",
          }}
        >
          {themeTokens.badgeText}
        </Badge>
        <p className="text-sm font-medium uppercase tracking-widest" style={{ color: "var(--theme-muted-text)" }}>
          Room
        </p>
        <h1 className="text-5xl font-bold tracking-widest font-mono">{code}</h1>
        <p className="text-lg" style={{ color: "var(--theme-muted-text)" }}>
          {themeTokens.displayName}
        </p>
        <p className="text-sm capitalize" style={{ color: "var(--theme-muted-text)" }}>
          {difficulty} difficulty
        </p>
      </div>

      {/* Share */}
      <ShareSection code={code} />

      {/* Players */}
      <div className="space-y-3">
        <p className="text-sm font-medium" style={{ color: "var(--theme-muted-text)" }}>
          Players ({connectedCount}/12)
        </p>
        <div className="grid grid-cols-2 gap-2">
          {playerList.map((player) => {
            const avatar = getAvatarById(player.avatarId);
            return (
              <div
                key={player.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                style={{ backgroundColor: "var(--theme-surface)" }}
              >
                {avatar && <AvatarIcon avatar={avatar} size={32} />}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{player.name}</p>
                  {player.isHost && (
                    <p className="text-xs" style={{ color: "var(--theme-accent)" }}>
                      Host
                    </p>
                  )}
                </div>
                <div
                  className={`h-2 w-2 rounded-full ${player.connected ? "bg-green-400" : "bg-zinc-600"}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Start button (host only) */}
      {isHost ? (
        <Button
          onClick={onStart}
          size="lg"
          className="w-full text-base font-semibold"
          style={{ backgroundColor: "var(--theme-primary)", color: "var(--theme-bg)" }}
        >
          Start Game
        </Button>
      ) : (
        <p className="text-center text-sm" style={{ color: "var(--theme-muted-text)" }}>
          Waiting for the host to start...
        </p>
      )}
    </div>
  );
}
