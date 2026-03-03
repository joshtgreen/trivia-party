"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JoinPage() {
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join a Game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="roomCode">
              Room code
            </label>
            <Input
              id="roomCode"
              placeholder="e.g. ABCD"
              maxLength={4}
              className="text-center text-2xl uppercase tracking-widest"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="playerName">
              Your name
            </label>
            <Input
              id="playerName"
              placeholder="e.g. Alex"
              maxLength={18}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>

          {/* Avatar picker will go here in Milestone 1 */}

          <Button className="w-full" size="lg" disabled>
            Join
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Join flow will be wired up in Milestone 3.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
