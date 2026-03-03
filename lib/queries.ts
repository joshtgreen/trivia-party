import { db } from "./db";
import { rooms } from "./schema";
import { eq } from "drizzle-orm";

export async function getRoomByCode(code: string) {
  const result = await db
    .select()
    .from(rooms)
    .where(eq(rooms.code, code.toUpperCase()))
    .limit(1);

  if (result.length === 0) return null;

  const room = result[0];
  if (room.expiresAt && new Date(room.expiresAt) < new Date()) return null;

  return room;
}
