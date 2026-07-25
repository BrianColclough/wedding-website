"use client";

import { FALLBACK_POLL_MS } from "@/lib/who-said-it/constants";
import type { GameState } from "@/lib/who-said-it/types";
import { createBrowserClient } from "@supabase/ssr";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Keeps a screen in sync with a room.
 *
 * Realtime is used as a nudge, not a data channel: any change to wsi_rooms or
 * wsi_players just triggers a refetch of /api/who-said-it/state, which is the
 * only thing allowed to decide whether this client may see the answer yet. A
 * missed or spoofed event therefore can't desync or leak anything.
 *
 * The interval is a fallback for flaky party wifi where a websocket quietly dies.
 */
export function useGameState(code: string | null, playerId: string | null) {
  const [state, setState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(code));

  // Realtime can fire once per player; coalesce bursts into a single fetch.
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);

  const fetchNow = useCallback(async () => {
    if (!code) return;
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const params = new URLSearchParams({ code });
      if (playerId) params.set("playerId", playerId);
      const res = await fetch(`/api/who-said-it/state?${params}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "could not load the game");
      } else {
        setState(data as GameState);
        setError(null);
      }
    } catch {
      setError("lost the connection, retrying");
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [code, playerId]);

  const refetch = useCallback(() => {
    if (pending.current) return;
    pending.current = setTimeout(() => {
      pending.current = null;
      void fetchNow();
    }, 80);
  }, [fetchNow]);

  useEffect(() => {
    if (!code) {
      setState(null);
      setLoading(false);
      return;
    }

    void fetchNow();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const interval = setInterval(() => void fetchNow(), FALLBACK_POLL_MS);

    if (!url || !anonKey) {
      return () => clearInterval(interval);
    }

    const supabase = createBrowserClient(url, anonKey);
    const channel = supabase
      .channel(`wsi:${code}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wsi_rooms", filter: `code=eq.${code}` },
        refetch
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wsi_players", filter: `code=eq.${code}` },
        refetch
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      if (pending.current) clearTimeout(pending.current);
      void supabase.removeChannel(channel);
    };
  }, [code, fetchNow, refetch]);

  return { state, error, loading, refetch: fetchNow, setError };
}
