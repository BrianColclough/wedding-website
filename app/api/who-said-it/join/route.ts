import { MAX_PLAYERS } from "@/lib/who-said-it/constants";
import { normalizePlayerName, normalizeRoomCode } from "@/lib/who-said-it/game";
import { jsonError, jsonNoStore } from "@/lib/who-said-it/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { code?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("expected a JSON body");
  }

  const code = normalizeRoomCode(body.code);
  const name = normalizePlayerName(body.name);

  if (!code) return jsonError("need a room code");
  if (!name) return jsonError("need a name");

  const db = createAdminClient();

  const { data: room } = await db
    .from("wsi_rooms")
    .select("code, phase")
    .eq("code", code)
    .maybeSingle();

  if (!room) return jsonError("no room with that code", 404);
  if (room.phase === "final") return jsonError("that game already finished", 409);

  const { count } = await db
    .from("wsi_players")
    .select("id", { count: "exact", head: true })
    .eq("code", code);

  if ((count ?? 0) >= MAX_PLAYERS) {
    return jsonError(`that room is full (${MAX_PLAYERS} players)`, 409);
  }

  const { data: player, error } = await db
    .from("wsi_players")
    .insert({ code, name })
    .select("id, name")
    .single();

  if (error) {
    if (error.code === "23505") {
      return jsonError("someone already took that name, pick another", 409);
    }
    return jsonError(`could not join: ${error.message}`, 500);
  }

  return jsonNoStore({ playerId: player.id, name: player.name, code }, 201);
}
