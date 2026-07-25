import type { SupabaseClient } from "@supabase/supabase-js";
import { MIN_QUOTES_FOR_DECOY } from "./constants";
import { buildOptions, hashHostToken, shuffle } from "./game";
import type { GameState, Phase, QuoteRow, RevealResult } from "./types";

/**
 * Every game response must be uncacheable. A CDN-cached state payload would
 * strand phones on an old question, which is a maddening bug to chase at a
 * party.
 */
export function jsonNoStore(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export function jsonError(message: string, status = 400) {
  return jsonNoStore({ error: message }, status);
}

type Db = SupabaseClient;

/**
 * Picks the quotes for a game and writes one wsi_rounds row per question, with
 * the option list fixed up front so it stays stable across refetches.
 *
 * Returns the number of rounds actually created, which may be fewer than
 * requested if there aren't enough active quotes.
 */
export async function buildDeck(db: Db, code: string, requestedRounds: number) {
  const { data: quotes, error } = await db
    .from("wsi_quotes")
    .select("id, text, said_by, said_on, context, active")
    .eq("active", true);

  if (error) throw new Error(`could not load quotes: ${error.message}`);
  if (!quotes?.length) throw new Error("no active quotes to play with");

  const rows = quotes as QuoteRow[];

  // Decoy eligibility is computed from the data every time, not hardcoded, so it
  // stays correct as quotes are added through the admin form.
  const counts = new Map<string, number>();
  for (const q of rows) counts.set(q.said_by, (counts.get(q.said_by) ?? 0) + 1);

  const allSpeakers = [...counts.keys()];
  const preferredDecoys = allSpeakers.filter(
    (name) => (counts.get(name) ?? 0) >= MIN_QUOTES_FOR_DECOY
  );

  const picked = shuffle(rows).slice(0, Math.min(requestedRounds, rows.length));

  const rounds = picked.map((quote, index) => ({
    code,
    round_index: index,
    quote_id: quote.id,
    options: buildOptions(quote.said_by, preferredDecoys, allSpeakers),
    answer: quote.said_by,
  }));

  const { error: insertError } = await db.from("wsi_rounds").insert(rounds);
  if (insertError) throw new Error(`could not create rounds: ${insertError.message}`);

  return rounds.length;
}

export async function verifyHost(db: Db, code: string, hostToken: unknown) {
  if (typeof hostToken !== "string" || !hostToken) return false;

  const { data, error } = await db
    .from("wsi_room_secrets")
    .select("host_token_hash")
    .eq("code", code)
    .maybeSingle();

  if (error || !data) return false;
  return data.host_token_hash === hashHostToken(hostToken);
}

/**
 * Assembles the state payload.
 *
 * The one rule that matters: `answer` and `results` are attached only when the
 * room is in the 'revealed' phase. Until then the answer never leaves the
 * server, even though it's sitting right there on the round row.
 */
export async function loadState(
  db: Db,
  code: string,
  playerId: string | null
): Promise<GameState | null> {
  const { data: room } = await db
    .from("wsi_rooms")
    .select("code, phase, round_index, total_rounds")
    .eq("code", code)
    .maybeSingle();

  if (!room) return null;

  const phase = room.phase as Phase;

  const { data: playerRows } = await db
    .from("wsi_players")
    .select("id, name, score, answered_round")
    .eq("code", code)
    .order("score", { ascending: false })
    .order("joined_at", { ascending: true });

  const players = (playerRows ?? []).map((p) => ({
    id: p.id as string,
    name: p.name as string,
    score: p.score as number,
    answered: p.answered_round === room.round_index,
  }));

  const state: GameState = {
    code: room.code,
    phase,
    roundIndex: room.round_index,
    totalRounds: room.total_rounds,
    players,
    answeredCount: players.filter((p) => p.answered).length,
    playerCount: players.length,
    round: null,
    yourGuess: null,
  };

  const inRound = phase === "question" || phase === "revealed";
  if (!inRound) return state;

  const { data: round } = await db
    .from("wsi_rounds")
    .select("quote_id, options, answer")
    .eq("code", code)
    .eq("round_index", room.round_index)
    .maybeSingle();

  if (!round) return state;

  const { data: quote } = await db
    .from("wsi_quotes")
    .select("text, context, said_on")
    .eq("id", round.quote_id)
    .maybeSingle();

  if (quote) {
    state.round = {
      text: quote.text as string,
      context: (quote.context as string | null) ?? null,
      saidOn: (quote.said_on as string | null) ?? null,
      options: round.options as string[],
    };
  }

  if (playerId) {
    const { data: mine } = await db
      .from("wsi_guesses")
      .select("choice")
      .eq("code", code)
      .eq("round_index", room.round_index)
      .eq("player_id", playerId)
      .maybeSingle();
    state.yourGuess = (mine?.choice as string | undefined) ?? null;
  }

  // --- everything below here is reveal-only ---
  if (phase !== "revealed") return state;

  state.answer = round.answer as string;

  const { data: guesses } = await db
    .from("wsi_guesses")
    .select("player_id, choice, is_correct")
    .eq("code", code)
    .eq("round_index", room.round_index);

  state.results = (guesses ?? []).map(
    (g): RevealResult => ({
      playerId: g.player_id as string,
      choice: g.choice as string,
      isCorrect: Boolean(g.is_correct),
    })
  );

  return state;
}
