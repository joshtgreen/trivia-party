import { ROOM_CODE_ALPHABET, ROOM_CODE_LENGTH } from "./constants";

/**
 * Generate a cryptographically random 4-letter room code.
 * Uses the reduced alphabet (no I or O) from spec §13.
 */
export function generateRoomCode(): string {
  const values = crypto.getRandomValues(new Uint8Array(ROOM_CODE_LENGTH));
  return Array.from(values)
    .map((v) => ROOM_CODE_ALPHABET[v % ROOM_CODE_ALPHABET.length])
    .join("");
}
