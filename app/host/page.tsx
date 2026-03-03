"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Difficulty } from "@/lib/types";

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export default function HostPage() {
  const [hostName, setHostName] = useState("");
  const [themeInput, setThemeInput] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Host a Game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="hostName">
              Your name
            </label>
            <Input
              id="hostName"
              placeholder="e.g. Josh"
              maxLength={18}
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="theme">
              Subject / Theme
            </label>
            <Input
              id="theme"
              placeholder="e.g. 90s hip hop, Deep sea creatures"
              maxLength={80}
              value={themeInput}
              onChange={(e) => setThemeInput(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Difficulty</label>
            <div className="mt-1 flex gap-2">
              {DIFFICULTIES.map((d) => (
                <Button
                  key={d.value}
                  variant={difficulty === d.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDifficulty(d.value)}
                >
                  {d.label}
                </Button>
              ))}
            </div>
          </div>

          <Button className="w-full" size="lg" disabled>
            Create Room
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Room creation will be wired up in Milestone 2.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
