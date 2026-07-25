"use client";

import { DEFAULT_ROUNDS, MAX_ROUNDS } from "@/lib/who-said-it/constants";
import { flavor, HITS } from "@/lib/who-said-it/flavor";
import type { HostAction } from "@/lib/who-said-it/types";
import confetti from "canvas-confetti";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Leaderboard, QuoteCard, Roster } from "../GamePieces";
import { useGameState } from "../useGameState";

const SESSION_KEY = "wsi-host";

type HostSession = { code: string; hostToken: string };

export default function HostPage() {
  const [session, setSession] = useState<HostSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const [pin, setPin] = useState("");
  const [rounds, setRounds] = useState(String(DEFAULT_ROUNDS));
  const [creating, setCreating] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [joinUrl, setJoinUrl] = useState("");
  const [qr, setQr] = useState("");

  const { state, error, refetch } = useGameState(session?.code ?? null, null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) setSession(JSON.parse(raw) as HostSession);
    } catch {
      // corrupt session, fall through to the setup form
    }
    setHydrated(true);
  }, []);

  // Never hardcode the domain — this has to work on localhost, on a Vercel
  // preview, and on the real site.
  useEffect(() => {
    if (!session?.code) return;
    setJoinUrl(`${window.location.origin}/who-said-it`);
  }, [session?.code]);

  useEffect(() => {
    if (!joinUrl) return;
    let cancelled = false;
    void import("qrcode").then(async (mod) => {
      try {
        const dataUrl = await mod.default.toDataURL(joinUrl, {
          margin: 1,
          width: 420,
          color: { dark: "#1b1230", light: "#fff6e8" },
        });
        if (!cancelled) setQr(dataUrl);
      } catch {
        // the URL is displayed as text regardless
      }
    });
    return () => {
      cancelled = true;
    };
  }, [joinUrl]);

  const createRoom = useCallback(async () => {
    setCreating(true);
    setSetupError(null);
    try {
      const res = await fetch("/api/who-said-it/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, rounds: Number(rounds) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSetupError(data.error ?? "could not create the room");
        return;
      }
      const next = { code: data.code as string, hostToken: data.hostToken as string };
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      setSession(next);
      setPin("");
    } catch {
      setSetupError("could not reach the server");
    } finally {
      setCreating(false);
    }
  }, [pin, rounds]);

  const act = useCallback(
    async (action: HostAction) => {
      if (!session) return;
      setBusy(true);
      try {
        const res = await fetch("/api/who-said-it/host", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: session.code, hostToken: session.hostToken, action }),
        });
        if (res.ok) await refetch();
      } finally {
        setBusy(false);
      }
    },
    [session, refetch]
  );

  const closeRoom = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setQr("");
    setJoinUrl("");
  }, []);

  const isLastRound = Boolean(state && state.roundIndex + 1 >= state.totalRounds);

  const primary = useMemo(() => {
    if (!state) return null;
    switch (state.phase) {
      case "lobby":
        return {
          label: state.playerCount ? "Start the game" : "Waiting for players",
          action: "start" as HostAction,
          disabled: state.playerCount === 0,
        };
      case "question":
        return { label: "Reveal", action: "reveal" as HostAction, disabled: false };
      case "revealed":
        return {
          label: isLastRound ? "Final scores →" : "Next quote →",
          action: "next" as HostAction,
          disabled: false,
        };
      case "final":
        return { label: "Shuffle and go again", action: "reset" as HostAction, disabled: false };
    }
  }, [state, isLastRound]);

  // Space or Enter fires the primary action so there's no hunting for a cursor
  // on a screen that's being shared to a TV.
  useEffect(() => {
    if (!primary || primary.disabled || busy) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== " " && event.key !== "Enter") return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      event.preventDefault();
      void act(primary.action);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [primary, busy, act]);

  // Fire once per reveal, not on every refetch of the same revealed round.
  const celebrated = useRef<string | null>(null);
  useEffect(() => {
    if (!state || state.phase !== "revealed") return;
    const key = `${state.code}:${state.roundIndex}`;
    if (celebrated.current === key) return;
    celebrated.current = key;

    const anyCorrect = state.results?.some((r) => r.isCorrect);
    void confetti({
      particleCount: anyCorrect ? 140 : 50,
      spread: anyCorrect ? 80 : 50,
      origin: { y: 0.7 },
      colors: ["#ff3e9a", "#ffe23d", "#3ce0c0", "#fff6e8"],
    });
  }, [state]);

  const guessByPlayer = useMemo(() => {
    const map = new Map<string, { choice: string; isCorrect: boolean }>();
    for (const result of state?.results ?? []) {
      map.set(result.playerId, { choice: result.choice, isCorrect: result.isCorrect });
    }
    return map;
  }, [state?.results]);

  if (!hydrated) return <div className="wsi-root wsi-tv" />;

  // ------------------------------------------------------------------ setup --
  if (!session) {
    return (
      <div className="wsi-root wsi-tv">
        <div className="wsi-stack">
          <header className="wsi-head">
            <p className="wsi-eyebrow">Host controls</p>
            <h1 className="wsi-title">Who Said It?</h1>
          </header>

          <div className="wsi-card wsi-flat" style={{ maxWidth: 460 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="wsi-field">
                <label className="wsi-label" htmlFor="wsi-pin">
                  Host PIN
                </label>
                <input
                  id="wsi-pin"
                  className="wsi-input"
                  type="password"
                  value={pin}
                  autoComplete="off"
                  onChange={(event) => setPin(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && pin) void createRoom();
                  }}
                />
              </div>

              <div className="wsi-field">
                <label className="wsi-label" htmlFor="wsi-rounds">
                  How many quotes (1–{MAX_ROUNDS})
                </label>
                <input
                  id="wsi-rounds"
                  className="wsi-input"
                  type="number"
                  min={1}
                  max={MAX_ROUNDS}
                  value={rounds}
                  onChange={(event) => setRounds(event.target.value)}
                />
              </div>

              {setupError && <p className="wsi-error">{setupError}</p>}

              <button
                className="wsi-btn"
                type="button"
                disabled={!pin || creating}
                onClick={() => void createRoom()}
              >
                {creating ? "Opening…" : "Open a room"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------- game --
  return (
    <div className="wsi-root wsi-tv">
      <div className="wsi-stack">
        {error && <p className="wsi-error">{error}</p>}

        {state?.phase === "lobby" && (
          <>
            <header className="wsi-head">
              <p className="wsi-eyebrow">Undisputed masterworks of our family</p>
              <h1 className="wsi-title">Who Said It?</h1>
            </header>

            <div className="wsi-lobby-split">
              <div className="wsi-center">
                <p className="wsi-eyebrow">Room code</p>
                <p className="wsi-code">{state.code}</p>
              </div>
              <div className="wsi-center" style={{ display: "grid", gap: 12, justifyItems: "center" }}>
                {qr && (
                  <div className="wsi-qr">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qr} alt={`QR code linking to ${joinUrl}`} />
                  </div>
                )}
                <p className="wsi-join-url">{joinUrl}</p>
              </div>
            </div>

            <p className="wsi-progress">
              <strong>{state.playerCount}</strong> {state.playerCount === 1 ? "player" : "players"} in
            </p>
            <Roster players={state.players} />
          </>
        )}

        {state?.round && (state.phase === "question" || state.phase === "revealed") && (
          <div className="wsi-play">
            <div className="wsi-play-main">
              <QuoteCard
                round={state.round}
                roundIndex={state.roundIndex}
                totalRounds={state.totalRounds}
                answer={state.phase === "revealed" ? state.answer : undefined}
              />

              <div className="wsi-options">
                {state.round.options.map((option) => {
                  const revealed = state.phase === "revealed";
                  const isAnswer = revealed && option === state.answer;
                  const className = revealed
                    ? isAnswer
                      ? "wsi-option wsi-right"
                      : "wsi-option wsi-faded"
                    : "wsi-option";
                  return (
                    <button key={option} type="button" className={className} disabled>
                      {option}
                    </button>
                  );
                })}
              </div>

              {state.phase === "revealed" && (
                <p className="wsi-verdict">{flavor(HITS, state.roundIndex)}</p>
              )}
            </div>

            <div className="wsi-play-side">
              {state.phase === "question" ? (
                <>
                  <p className="wsi-progress">
                    <strong>{state.answeredCount}</strong> of {state.playerCount} locked in
                  </p>
                  <Roster players={state.players} showLocked />
                </>
              ) : (
                <>
                  <p className="wsi-progress">Scores</p>
                  <Leaderboard players={state.players} guesses={guessByPlayer} showDots={false} />
                </>
              )}
            </div>
          </div>
        )}

        {state?.phase === "final" && (
          <>
            <div className="wsi-center">
              <div className="wsi-trophy">🏆</div>
              <p className="wsi-eyebrow">That&rsquo;s the whole family</p>
              <p className="wsi-winner">
                {state.players[0]?.name ?? "Nobody"}
                {state.players[0]?.score ? " wins" : " — a scoreless tragedy"}
              </p>
            </div>
            <Leaderboard players={state.players} crownLeader />
          </>
        )}

        {primary && (
          <div className="wsi-controls">
            <button
              className="wsi-btn"
              type="button"
              disabled={primary.disabled || busy}
              onClick={() => void act(primary.action)}
            >
              {busy ? "…" : primary.label}
            </button>
          </div>
        )}

        <div className="wsi-controls">
          <p className="wsi-note">
            Room {session.code} · space or enter advances
          </p>
          <button className="wsi-link" type="button" onClick={closeRoom}>
            Close this room
          </button>
        </div>
      </div>
    </div>
  );
}
