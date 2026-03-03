interface RoomPageProps {
  params: Promise<{ code: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { code } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Room
      </p>
      <h1 className="text-6xl font-bold tracking-widest">{code}</h1>
      <p className="text-muted-foreground">
        Lobby, gameplay, and reveal states will render here.
      </p>
    </main>
  );
}
