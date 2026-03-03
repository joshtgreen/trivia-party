"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AvatarPicker } from "./AvatarPicker";
import { validateName } from "@/lib/validation";
import { getRandomAvatar } from "@/lib/avatars";
import type { ThemeTokens } from "@/lib/types";

interface JoinPromptProps {
  code: string;
  themeTokens: ThemeTokens;
  onJoin: (name: string, avatarId: string) => void;
}

export function JoinPrompt({ code, themeTokens, onJoin }: JoinPromptProps) {
  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState(() => getRandomAvatar().id);
  const [touched, setTouched] = useState(false);

  const nameCheck = validateName(name);

  function handleSubmit() {
    setTouched(true);
    if (!nameCheck.valid) return;
    onJoin(name.trim(), avatarId);
  }

  return (
    <div className="mx-auto max-w-md space-y-8 pt-12">
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
      </div>

      <div className="space-y-4 rounded-lg p-6" style={{ backgroundColor: "var(--theme-surface)" }}>
        <h2 className="text-lg font-semibold text-center">Join this game</h2>

        <div className="space-y-1">
          <label className="text-sm font-medium" style={{ color: "var(--theme-muted-text)" }}>
            Your name
          </label>
          <Input
            placeholder="e.g. Alex"
            maxLength={18}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          {touched && !nameCheck.valid && (
            <p className="text-xs text-red-400">{nameCheck.error}</p>
          )}
        </div>

        <AvatarPicker selected={avatarId} onSelect={setAvatarId} />

        <Button
          onClick={handleSubmit}
          disabled={!nameCheck.valid}
          className="w-full"
          size="lg"
          style={{ backgroundColor: "var(--theme-primary)", color: "var(--theme-bg)" }}
        >
          Join
        </Button>
      </div>
    </div>
  );
}
