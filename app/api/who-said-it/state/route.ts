import { normalizeRoomCode } from "@/lib/who-said-it/game";
import { jsonError, jsonNoStore, loadState } from "@/lib/who-said-it/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * The only route that can hand a browser the correct answer, and it only does so
 * once the host has revealed. See loadState.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = normalizeRoomCode(url.searchParams.get("code"));
  const playerId = url.searchParams.get("playerId");

  if (!code) return jsonError("need a room code");

  const db = createAdminClient();
  const state = await loadState(db, code, playerId);

  if (!state) return jsonError("no room with that code", 404);

  return jsonNoStore(state);
}
