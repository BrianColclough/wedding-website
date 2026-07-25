"use client";

import { MAX_NAME_LENGTH, ROOM_CODE_LENGTH } from "@/lib/who-said-it/constants";
import { flavor, HITS, MISSES, NO_GUESS } from "@/lib/who-said-it/flavor";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Leaderboard, QuoteCard, Roster } from "./GamePieces";
import { useGameState } from "./useGameState";

const SESSION_KEY = "wsi-player";

type PlayerSession = { code: string; playerId: string; name: string };

export default function PlayerPage() {
  const [session, setSession] = useState<PlayerSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const { state, error, refetch } = useGameState(session?.code ?? null, session?.playerId ?? null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) setSession(JSON.parse(raw) as PlayerSession);
    } catch {
      // corrupt session, fall through to the join form
    }
    setHydrated(true);
  }, []);

  const leave = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setCode("");
    setName("");
  }, []);

  // A stale session from a previous game night points at a deleted room.
  useEffect(() => {
    if (error === "no room with that code") leave();
  }, [error, leave]);

  const join = useCallback(async () => {
    setJoining(true);
    setJoinError(null);
    try {
      const res = await fetch("/api/who-said-it/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setJoinError(data.error ?? "could not join");
        return;
      }
      const next: PlayerSession = {
        code: data.code as string,
        playerId: data.playerId as string,
        name: data.name as string,
      };
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      setSession(next);
    } catch {
      setJoinError("could not reach the server");
    } finally {
      setJoining(false);
    }
  }, [code, name]);

  const guess = useCallback(
    async (choice: string) => {
      if (!session || sending) return;
      setSending(true);
      try {
        const res = await fetch("/api/who-said-it/guess", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: session.code, playerId: session.playerId, choice }),
        });
        if (res.ok) await refetch();
      } finally {
        setSending(false);
      }
    },
    [session, sending, refetch]
  );

  const me = useMemo(
    () => state?.players.find((player) => player.id === session?.playerId) ?? null,
    [state?.players, session?.playerId]
  );

  const myPlace = useMemo(() => {
    if (!state || !session) return null;
    const index = state.players.findIndex((player) => player.id === session.playerId);
    return index === -1 ? null : index + 1;
  }, [state, session]);

  if (!hydrated) return <div className="wsi-root wsi-phone" />;

  // ------------------------------------------------------------------- join --
  if (!session) {
    return (
      <div className="wsi-root wsi-phone">
        <div className="wsi-stack">
          <header className="wsi-head">
            <p className="wsi-eyebrow">Undisputed masterworks of our family</p>
            <h1 className="wsi-title">Who Said It?</h1>
            <span className="wsi-sub">grab the code off the tv</span>
          </header>

          <div className="wsi-card wsi-flat">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="wsi-field">
                <label className="wsi-label" htmlFor="wsi-code">
                  Room code
                </label>
                <input
                  id="wsi-code"
                  className="wsi-input wsi-input-code"
                  value={code}
                  maxLength={ROOM_CODE_LENGTH}
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck={false}
                  inputMode="text"
                  onChange={(event) => setCode(event.target.value.toUpperCase())}
                />
              </div>

              <div className="wsi-field">
                <label className="wsi-label" htmlFor="wsi-name">
                  Your name
                </label>
                <input
                  id="wsi-name"
                  className="wsi-input"
                  value={name}
                  maxLength={MAX_NAME_LENGTH}
                  autoComplete="off"
                  onChange={(event) => setName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && code && name) void join();
                  }}
                />
              </div>

              {joinError && <p className="wsi-error">{joinError}</p>}

              <button
                className="wsi-btn"
                type="button"
                disabled={!code || !name || joining}
                onClick={() => void join()}
              >
                {joining ? "Joining…" : "I'm in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------- play --
  const locked = Boolean(state?.yourGuess);
  const wasRight = state?.phase === "revealed" && state.yourGuess === state.answer;

  return (
    <div className="wsi-root wsi-phone">
      <div className="wsi-stack">
        {error && <p className="wsi-error">{error}</p>}

        {state?.phase === "lobby" && (
          <>
            <header className="wsi-head">
              <h1 className="wsi-title">You&rsquo;re in</h1>
              <span className="wsi-sub">hi {session.name}</span>
            </header>
            <p className="wsi-note">Waiting for the game to start…</p>
            <Roster players={state.players} />
          </>
        )}

        {state?.round && (state.phase === "question" || state.phase === "revealed") && (
          <>
            <QuoteCard
              round={state.round}
              roundIndex={state.roundIndex}
              totalRounds={state.totalRounds}
              answer={state.phase === "revealed" ? state.answer : undefined}
            />

            <div className="wsi-options">
              {state.round.options.map((option) => {
                const revealed = state.phase === "revealed";
                const mine = state.yourGuess === option;

                let className = "wsi-option";
                if (revealed) {
                  if (option === state.answer) className = "wsi-option wsi-right";
                  else if (mine) className = "wsi-option wsi-wrong";
                  else className = "wsi-option wsi-faded";
                } else if (mine) {
                  className = "wsi-option wsi-chosen";
                }

                return (
                  <button
                    key={option}
                    type="button"
                    className={className}
                    disabled={revealed || locked || sending}
                    onClick={() => void guess(option)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {state.phase === "question" ? (
              <p className="wsi-verdict">
                {locked
                  ? "Locked in. Waiting on everyone else."
                  : sending
                    ? "Sending…"
                    : "Who said it?"}
              </p>
            ) : (
              <>
                <p className="wsi-verdict">
                  {!state.yourGuess
                    ? flavor(NO_GUESS, state.roundIndex)
                    : wasRight
                      ? flavor(HITS, state.roundIndex)
                      : flavor(MISSES, state.roundIndex)}
                </p>
                <p className="wsi-note">
                  {me ? `${me.score} ${me.score === 1 ? "point" : "points"}` : ""}
                  {myPlace ? ` · ${ordinal(myPlace)} place` : ""}
                </p>
              </>
            )}
          </>
        )}

        {state?.phase === "final" && (
          <>
            <div className="wsi-center">
              <p className="wsi-eyebrow">Final standings</p>
              <h1 className="wsi-title">
                {myPlace === 1 ? "You won" : myPlace ? ordinal(myPlace) : "Done"}
              </h1>
              <span className="wsi-sub">
                {me?.score ?? 0} {me?.score === 1 ? "point" : "points"}
              </span>
            </div>
            <Leaderboard players={state.players} crownLeader />
            <p className="wsi-note">Waiting on the host for another round…</p>
          </>
        )}

        <div className="wsi-controls">
          <p className="wsi-note">
            {session.name} · room {session.code}
          </p>
          <button className="wsi-link" type="button" onClick={leave}>
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}

function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}
