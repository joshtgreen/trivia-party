import { NextResponse } from "next/server";

export async function GET() {
  // TODO (Milestone 5): Fetch results from Neon, check TTL
  return NextResponse.json(
    { error: "Not implemented yet." },
    { status: 501 }
  );
}
