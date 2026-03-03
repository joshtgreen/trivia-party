interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold">Game Results</h1>
      <p className="text-muted-foreground">
        Results for game <code className="font-mono">{id}</code>
      </p>
      <p className="text-sm text-muted-foreground">
        Results display will be wired up in Milestone 5.
      </p>
    </main>
  );
}
