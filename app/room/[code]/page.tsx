import { notFound } from "next/navigation";
import { getRoomByCode } from "@/lib/queries";
import { themeVarsToStyle } from "@/lib/theme-engine";
import { ShareSection } from "@/components/game/ShareSection";
import { Badge } from "@/components/ui/badge";
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
  const style = themeVarsToStyle(theme);

  return (
    <main
      style={{
        ...style,
        backgroundColor: "var(--theme-bg)",
        color: "var(--theme-text)",
        minHeight: "100dvh",
      }}
      className="px-6 py-12"
    >
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge
            className="text-xs font-bold tracking-widest"
            style={{
              backgroundColor: "var(--theme-accent)",
              color: "var(--theme-bg)",
            }}
          >
            {theme.badgeText}
          </Badge>
          <p
            className="text-sm font-medium uppercase tracking-widest"
            style={{ color: "var(--theme-muted-text)" }}
          >
            Room
          </p>
          <h1 className="text-6xl font-bold tracking-widest font-mono">
            {room.code}
          </h1>
          <p className="text-xl" style={{ color: "var(--theme-muted-text)" }}>
            {theme.displayName}
          </p>
          <p
            className="text-sm capitalize"
            style={{ color: "var(--theme-muted-text)" }}
          >
            {room.difficulty} difficulty &middot; Hosted by {room.hostName}
          </p>
        </div>

        {/* Share */}
        <ShareSection code={room.code} />

        {/* Divider */}
        <hr style={{ borderColor: "var(--theme-surface2)" }} />

        {/* Questions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {questions.length} Questions
          </h2>
          {questions.map((q, i) => (
            <QuestionPreview key={q.id} question={q} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}

function QuestionPreview({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  const labels = ["A", "B", "C", "D"];

  return (
    <div
      className="rounded-lg p-5 space-y-3"
      style={{ backgroundColor: "var(--theme-surface)" }}
    >
      <p className="font-medium">
        <span
          className="font-mono mr-2"
          style={{ color: "var(--theme-accent)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {question.question}
      </p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {question.choices.map((choice, ci) => (
          <p
            key={ci}
            className={ci === question.correctIndex ? "font-semibold" : ""}
            style={
              ci === question.correctIndex
                ? { color: "var(--theme-accent)" }
                : { color: "var(--theme-muted-text)" }
            }
          >
            {labels[ci]}) {choice}
          </p>
        ))}
      </div>
      <p
        className="text-xs italic"
        style={{ color: "var(--theme-muted-text)" }}
      >
        {question.explanation}
      </p>
    </div>
  );
}
