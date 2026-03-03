import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getRoomByCode } from "@/lib/queries";
import { RoomClient } from "@/components/game/RoomClient";
import type { ThemeTokens, Question } from "@/lib/types";

interface RoomPageProps {
  params: Promise<{ code: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { code } = await params;
  const room = await getRoomByCode(code);

  if (!room) {
    notFound();
  }

  const theme = room.themeTokens as ThemeTokens;
  const questions = room.questions as Question[];

  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-zinc-950">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
        </div>
      }
    >
      <RoomClient
        code={room.code}
        themeTokens={theme}
        questions={questions}
        difficulty={room.difficulty}
        themeInput={room.themeInput}
        hostName={room.hostName}
      />
    </Suspense>
  );
}
