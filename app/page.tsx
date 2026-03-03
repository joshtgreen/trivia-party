import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">Trivia Party</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Pick a subject. AI writes the questions. Friends bring the wrong answers.
        </p>
      </div>

      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/host">Host a Game</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/join">Join a Game</Link>
        </Button>
      </div>
    </main>
  );
}
