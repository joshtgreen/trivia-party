"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateName } from "@/lib/validation";
import { ROOM_CODE_LENGTH } from "@/lib/constants";
import { AvatarPicker } from "@/components/game/AvatarPicker";
import { getRandomAvatar } from "@/lib/avatars";

export default function JoinPage() {
  return (
    <Suspense>
      <JoinForm />
    </Suspense>
  );
}

function JoinForm() {
  const searchParams = useSearchParams();
  const [roomCode, setRoomCode] = useState(
    searchParams.get("code")?.toUpperCase() ?? ""
  );
  const [playerName, setPlayerName] = useState("");
  const [avatarId, setAvatarId] = useState(() => getRandomAvatar().id);
  const [touched, setTouched] = useState({ code: false, name: false });
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const nameCheck = validateName(playerName);
  const codeValid = roomCode.length === ROOM_CODE_LENGTH;
  const isValid = nameCheck.valid && codeValid;

  async function handleJoin() {
    setTouched({ code: true, name: true });
    if (!isValid) return;

    setChecking(true);
    setError("");

    try {
      const res = await fetch(`/api/rooms/${roomCode}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Room not found.");
      }
      // Room exists — realtime join will be wired up in Milestone 3.
      // For now, redirect to the room page to preview it.
      window.location.href = `/room/${roomCode}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setChecking(false);
    }
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Join a Game
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Enter the room code from your host.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label
            className="text-sm font-medium text-zinc-300"
            htmlFor="roomCode"
          >
            Room code
          </label>
          <Input
            id="roomCode"
            placeholder="ABCD"
            maxLength={4}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            onBlur={() => setTouched((t) => ({ ...t, code: true }))}
            className="bg-zinc-900 border-zinc-700 text-white text-center text-3xl font-mono uppercase tracking-[0.3em] placeholder:text-zinc-600 focus-visible:ring-zinc-400 h-16"
          />
          {touched.code && !codeValid && (
            <p className="text-xs text-red-400">Enter a 4-letter room code.</p>
          )}
        </div>

        <div className="space-y-1">
          <label
            className="text-sm font-medium text-zinc-300"
            htmlFor="playerName"
          >
            Your name
          </label>
          <Input
            id="playerName"
            placeholder="e.g. Alex"
            maxLength={18}
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-400"
          />
          {touched.name && !nameCheck.valid && (
            <p className="text-xs text-red-400">{nameCheck.error}</p>
          )}
        </div>

        <AvatarPicker selected={avatarId} onSelect={setAvatarId} />

        <Button
          onClick={handleJoin}
          disabled={!isValid || checking}
          size="lg"
          className="w-full bg-white text-zinc-950 hover:bg-zinc-200 text-base font-semibold disabled:opacity-40"
        >
          {checking ? "Checking..." : "Join"}
        </Button>

        <p className="text-center">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Back
          </Link>
        </p>
      </div>
    </main>
  );
}
