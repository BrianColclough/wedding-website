import { normalizeRoomCode } from "@/lib/who-said-it/game";
import { buildDeck, jsonError, jsonNoStore, loadState, verifyHost } from "@/lib/who-said-it/server";
import type { HostAction } from "@/lib/who-said-it/types";
import { createAdminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

const ACTIONS: HostAction[] = ["start", "reveal", "next", "reset"];

export async function POST(request: Request) {
  let body: { code?: string; hostToken?: string; action?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("expected a JSON body");
  }

  const code = normalizeRoomCode(body.code);
  const action = body.action as HostAction;

  if (!code) return jsonError("need a room code");
  if (!ACTIONS.includes(action)) return jsonError(`action must be one of ${ACTIONS.join(", ")}`);

  const db = createAdminClient();

  if (!(await verifyHost(db, code, body.hostToken))) {
    return jsonError("not the host of this room", 403);
  }

  const { data: room } = await db
    .from("wsi_rooms")
    .select("phase, round_index, total_rounds")
    .eq("code", code)
    .maybeSingle();

  if (!room) return jsonError("no room with that code", 404);

  // Every one of these is a phase-guarded RPC, so mashing a button is a no-op
  // rather than a double-score or a skipped question.
  switch (action) {
    case "start": {
      const { error } = await db.rpc("wsi_start", { p_code: code });
      if (error) return jsonError(`could not start: ${error.message}`, 500);
      break;
    }
    case "reveal": {
      const { error } = await db.rpc("wsi_reveal", {
        p_code: code,
        p_round: room.round_index,
      });
      if (error) return jsonError(`could not reveal: ${error.message}`, 500);
      break;
    }
    case "next": {
      const { error } = await db.rpc("wsi_next", { p_code: code });
      if (error) return jsonError(`could not advance: ${error.message}`, 500);
      break;
    }
    case "reset": {
      const { error } = await db.rpc("wsi_reset", { p_code: code });
      if (error) return jsonError(`could not reset: ${error.message}`, 500);
      try {
        // wsi_reset clears the old deck; option generation lives here, so the
        // replacement has to be built in application code.
        const rounds = await buildDeck(db, code, room.total_rounds);
        if (rounds !== room.total_rounds) {
          await db.from("wsi_rooms").update({ total_rounds: rounds }).eq("code", code);
        }
      } catch (err) {
        return jsonError(err instanceof Error ? err.message : "could not rebuild deck", 500);
      }
      break;
    }
  }

  const state = await loadState(db, code, null);
  return jsonNoStore({ ok: true, state });
}
