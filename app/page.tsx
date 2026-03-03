import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-10 px-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-white sm:text-7xl">
          Trivia Party
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-zinc-400 sm:text-xl">
          Pick a subject. AI writes the questions.
          <br />
          Friends bring the wrong answers.
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          asChild
          size="lg"
          className="bg-white text-zinc-950 hover:bg-zinc-200 px-8 text-base font-semibold"
        >
          <Link href="/host">Host a Game</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white px-8 text-base"
        >
          <Link href="/join">Join a Game</Link>
        </Button>
      </div>

      <p className="absolute bottom-6 text-xs text-zinc-600">
        Built with Claude.
      </p>
    </main>
  );
}
