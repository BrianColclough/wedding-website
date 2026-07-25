import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import {
  DEFAULT_ROUNDS,
  MAX_NAME_LENGTH,
  MAX_ROUNDS,
  OPTIONS_PER_ROUND,
  ROOM_CODE_LENGTH,
} from "./constants";

// Room codes skip I, O, 0 and 1 so nobody mistypes them off a TV. The alphabet
// is exactly 32 chars, which divides 256 evenly, so byte % 32 has no modulo bias.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function randomRoomCode(length = ROOM_CODE_LENGTH): string {
  return Array.from(
    randomBytes(length),
    (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]
  ).join("");
}

export function newHostToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashHostToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Compares digests rather than raw bytes, so it's constant-time and doesn't leak
 * the expected length either.
 */
export function secretMatches(supplied: unknown, expected: string | undefined): boolean {
  if (!expected) return false;
  const a = createHash("sha256").update(String(supplied ?? "")).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function shuffle<T>(items: readonly T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Builds one question's options: the correct answer plus up to three decoys,
 * shuffled.
 *
 * `preferredDecoys` should be the speakers with enough quotes to be plausible.
 * `allSpeakers` only widens the pool if that isn't enough to fill the question —
 * better a slightly odd option than a two-option round.
 */
export function buildOptions(
  answer: string,
  preferredDecoys: readonly string[],
  allSpeakers: readonly string[] = []
): string[] {
  const used = new Set<string>([answer]);
  const decoys: string[] = [];

  const take = (pool: readonly string[]) => {
    for (const name of shuffle(pool)) {
      if (decoys.length >= OPTIONS_PER_ROUND - 1) return;
      if (used.has(name)) continue;
      used.add(name);
      decoys.push(name);
    }
  };

  take(preferredDecoys);
  if (decoys.length < OPTIONS_PER_ROUND - 1) take(allSpeakers);

  return shuffle([answer, ...decoys]);
}

export function normalizePlayerName(raw: unknown): string {
  return String(raw ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_NAME_LENGTH);
}

export function normalizeRoomCode(raw: unknown): string {
  return String(raw ?? "")
    .trim()
    .toUpperCase()
    .slice(0, ROOM_CODE_LENGTH);
}

export function clampRounds(raw: unknown): number {
  const n = Number.parseInt(String(raw ?? ""), 10);
  if (!Number.isFinite(n)) return DEFAULT_ROUNDS;
  return Math.min(Math.max(n, 1), MAX_ROUNDS);
}
