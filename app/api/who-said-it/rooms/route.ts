import {
  clampRounds,
  hashHostToken,
  newHostToken,
  randomRoomCode,
  secretMatches,
} from "@/lib/who-said-it/game";
import { buildDeck, hostPinUnavailable, jsonError, jsonNoStore } from "@/lib/who-said-it/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

/** Creates a room. Host-only. */
export async function POST(request: Request) {
  let body: { pin?: string; rounds?: number };
  try {
    body = await request.json();
  } catch {
    return jsonError("expected a JSON body");
  }

  const misconfigured = hostPinUnavailable();
  if (misconfigured) return misconfigured;

  if (!secretMatches(body.pin, process.env.WHO_SAID_IT_HOST_PIN)) {
    return jsonError("wrong PIN", 401);
  }

  const rounds = clampRounds(body.rounds);
  const db = createAdminClient();

  // Codes are short enough to collide occasionally; the primary key is the
  // arbiter, so just retry on conflict rather than checking first.
  let code: string | null = null;
  for (let attempt = 0; attempt < 8; attempt++) {
    const candidate = randomRoomCode();
    const { error } = await db
      .from("wsi_rooms")
      .insert({ code: candidate, total_rounds: rounds, phase: "lobby", round_index: 0 });

    if (!error) {
      code = candidate;
      break;
    }
    if (error.code !== "23505") {
      return jsonError(`could not create room: ${error.message}`, 500);
    }
  }

  if (!code) return jsonError("could not find a free room code, try again", 503);

  const hostToken = newHostToken();

  const { error: secretError } = await db
    .from("wsi_room_secrets")
    .insert({ code, host_token_hash: hashHostToken(hostToken) });

  if (secretError) {
    await db.from("wsi_rooms").delete().eq("code", code);
    return jsonError(`could not store host token: ${secretError.message}`, 500);
  }

  let actualRounds: number;
  try {
    actualRounds = await buildDeck(db, code, rounds);
  } catch (err) {
    await db.from("wsi_rooms").delete().eq("code", code);
    return jsonError(err instanceof Error ? err.message : "could not build deck", 500);
  }

  // Fewer active quotes than requested rounds is fine, but the room must agree
  // with its own deck or wsi_next would never reach 'final'.
  if (actualRounds !== rounds) {
    await db.from("wsi_rooms").update({ total_rounds: actualRounds }).eq("code", code);
  }

  return jsonNoStore({ code, hostToken, totalRounds: actualRounds }, 201);
}
