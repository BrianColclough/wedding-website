import { secretMatches } from "@/lib/who-said-it/game";
import { jsonError, jsonNoStore } from "@/lib/who-said-it/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * Admin-only quote management.
 *
 * The read path lives here rather than in the browser on purpose: wsi_quotes has
 * no anon RLS policy, so a client-side Supabase call would fail — and "fixing"
 * that by adding an anon SELECT policy would put every quote and its
 * attribution one fetch away from any player mid-game.
 */
function authorized(pin: unknown) {
  return secretMatches(pin, process.env.WHO_SAID_IT_HOST_PIN);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (!authorized(url.searchParams.get("pin"))) return jsonError("wrong PIN", 401);

  const db = createAdminClient();
  const { data, error } = await db
    .from("wsi_quotes")
    .select("id, text, said_by, said_on, context, active")
    .order("id", { ascending: false });

  if (error) return jsonError(`could not load quotes: ${error.message}`, 500);

  const speakers = new Map<string, number>();
  for (const q of data ?? []) {
    if (q.active) speakers.set(q.said_by, (speakers.get(q.said_by) ?? 0) + 1);
  }

  return jsonNoStore({
    quotes: data ?? [],
    speakers: [...speakers.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
  });
}

export async function POST(request: Request) {
  let body: {
    pin?: string;
    text?: string;
    saidBy?: string;
    saidOn?: string;
    context?: string;
    id?: number;
    active?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return jsonError("expected a JSON body");
  }

  if (!authorized(body.pin)) return jsonError("wrong PIN", 401);

  const db = createAdminClient();

  // Toggling an existing quote in or out of the pool.
  if (typeof body.id === "number" && typeof body.active === "boolean") {
    const { error } = await db
      .from("wsi_quotes")
      .update({ active: body.active })
      .eq("id", body.id);
    if (error) return jsonError(`could not update quote: ${error.message}`, 500);
    return jsonNoStore({ ok: true });
  }

  const text = String(body.text ?? "").trim();
  const saidBy = String(body.saidBy ?? "").trim();

  if (!text) return jsonError("need the quote text");
  if (!saidBy) return jsonError("need who said it");

  const { data, error } = await db
    .from("wsi_quotes")
    .insert({
      text,
      said_by: saidBy,
      said_on: String(body.saidOn ?? "").trim() || null,
      context: String(body.context ?? "").trim() || null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return jsonError("that exact quote is already in there", 409);
    return jsonError(`could not add quote: ${error.message}`, 500);
  }

  return jsonNoStore({ ok: true, id: data.id }, 201);
}
