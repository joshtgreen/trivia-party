"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateName, validateThemeInput } from "@/lib/validation";
import { AvatarPicker } from "@/components/game/AvatarPicker";
import { getRandomAvatar } from "@/lib/avatars";
import type { Difficulty } from "@/lib/types";

type PageState = "form" | "generating" | "error";

const SUGGESTIONS = ["90s hip hop", "Deep sea creatures", "The Office", "Space exploration"];

const DIFFICULTIES: { value: Difficulty; label: string; desc: string }[] = [
  { value: "easy", label: "Easy", desc: "Common knowledge" },
  { value: "medium", label: "Medium", desc: "Enthusiast-level" },
  { value: "hard", label: "Hard", desc: "Delightfully obscure" },
];

export default function HostPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("form");
  const [errorMessage, setErrorMessage] = useState("");
  const [hostName, setHostName] = useState("");
  const [themeInput, setThemeInput] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [avatarId, setAvatarId] = useState(() => getRandomAvatar().id);
  const [touched, setTouched] = useState({ name: false, theme: false });

  const nameCheck = validateName(hostName);
  const themeCheck = validateThemeInput(themeInput);
  const isValid = nameCheck.valid && themeCheck.valid;

  async function handleSubmit() {
    setTouched({ name: true, theme: true });
    if (!isValid) return;

    setPageState("generating");

    try {
      const res = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostName: hostName.trim(),
          themeInput: themeInput.trim(),
          difficulty,
          avatarId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      const data = await res.json();
      const params = new URLSearchParams({
        name: hostName.trim(),
        avatar: avatarId,
        host: "1",
      });
      router.push(`/room/${data.roomCode}?${params.toString()}`);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
      setPageState("error");
    }
  }

  if (pageState === "generating") {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
        <div className="text-center">
          <p className="text-lg font-medium text-white">Generating your game...</p>
          <p className="mt-2 text-sm text-zinc-400">
            Writing 20 questions about <span className="italic text-zinc-300">{themeInput}</span>.
            <br />
            This takes about 10 seconds.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Host a Game</h1>
          <p className="mt-1 text-sm text-zinc-400">
            You pick the subject. AI writes the questions.
          </p>
        </div>

        {pageState === "error" && (
          <div className="rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-300" htmlFor="hostName">
            Your name
          </label>
          <Input
            id="hostName"
            placeholder="e.g. Josh"
            maxLength={18}
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-400"
          />
          {touched.name && !nameCheck.valid && (
            <p className="text-xs text-red-400">{nameCheck.error}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-300" htmlFor="theme">
            What should the trivia be about?
          </label>
          <Input
            id="theme"
            placeholder="e.g. Kubrick films, World War I, Taylor Swift"
            maxLength={80}
            value={themeInput}
            onChange={(e) => setThemeInput(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, theme: true }))}
            className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-400"
          />
          <div className="flex flex-wrap gap-2 pt-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setThemeInput(s)}
                className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
              >
                {s}
              </button>
            ))}
          </div>
          {touched.theme && !themeCheck.valid && (
            <p className="text-xs text-red-400">{themeCheck.error}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Difficulty</label>
          <div className="flex rounded-lg border border-zinc-700 overflow-hidden">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDifficulty(d.value)}
                className={`flex-1 py-2.5 text-center text-sm font-medium transition-colors ${
                  difficulty === d.value
                    ? "bg-white text-zinc-950"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500">
            {DIFFICULTIES.find((d) => d.value === difficulty)?.desc}
          </p>
        </div>

        <AvatarPicker selected={avatarId} onSelect={setAvatarId} />

        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          size="lg"
          className="w-full bg-white text-zinc-950 hover:bg-zinc-200 text-base font-semibold disabled:opacity-40"
        >
          Create Room
        </Button>

        <p className="text-center">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            Back
          </Link>
        </p>
      </div>
    </main>
  );
}
