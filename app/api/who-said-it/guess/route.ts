import { normalizeRoomCode } from "@/lib/who-said-it/game";
import { jsonError, jsonNoStore } from "@/lib/who-said-it/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { code?: string; playerId?: string; choice?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("expected a JSON body");
  }

  const code = normalizeRoomCode(body.code);
  const playerId = String(body.playerId ?? "");
  const choice = String(body.choice ?? "");

  if (!code || !playerId || !choice) {
    return jsonError("need code, playerId and choice");
  }

  const db = createAdminClient();

  const { data: room } = await db
    .from("wsi_rooms")
    .select("phase, round_index")
    .eq("code", code)
    .maybeSingle();

  if (!room) return jsonError("no room with that code", 404);

  // Checked before writing. The insert below is atomic but phase-blind, so
  // without this a tap landing just after Reveal would be recorded as answered
  // and then never scored.
  if (room.phase !== "question") {
    return jsonError("not taking guesses right now", 409);
  }

  const { data: round } = await db
    .from("wsi_rounds")
    .select("options")
    .eq("code", code)
    .eq("round_index", room.round_index)
    .maybeSingle();

  if (!round) return jsonError("that round is missing", 500);
  if (!(round.options as string[]).includes(choice)) {
    return jsonError("that isn't one of the options", 400);
  }

  const { data: player } = await db
    .from("wsi_players")
    .select("id")
    .eq("code", code)
    .eq("id", playerId)
    .maybeSingle();

  if (!player) return jsonError("you're not in this room", 403);

  // First guess wins — no changing your mind once it's locked in.
  const { error } = await db
    .from("wsi_guesses")
    .insert({ code, round_index: room.round_index, player_id: playerId, choice });

  if (error && error.code !== "23505") {
    return jsonError(`could not record guess: ${error.message}`, 500);
  }

  const locked = error?.code === "23505";

  if (!locked) {
    // Drives the host screen's "N of M locked in" over Realtime.
    await db
      .from("wsi_players")
      .update({ answered_round: room.round_index })
      .eq("id", playerId);
  }

  return jsonNoStore({ ok: true, alreadyLocked: locked });
}
