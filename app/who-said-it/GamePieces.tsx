"use client";

import type { PublicPlayer, RoundView } from "@/lib/who-said-it/types";

const MAX_DOTS = 10;

export type GuessMap = Map<string, { choice: string; isCorrect: boolean }>;

/**
 * Players arrive already sorted by score descending from the server.
 *
 * When `guesses` is supplied each row also shows what that player picked, which
 * folds the old separate reveal roster into this one table — the TV has to fit a
 * whole family's worth of rows without scrolling.
 */
export function Leaderboard({
  players,
  crownLeader = false,
  guesses,
  showDots = true,
}: {
  players: PublicPlayer[];
  crownLeader?: boolean;
  guesses?: GuessMap;
  showDots?: boolean;
}) {
  if (!players.length) return null;

  const topScore = players[0]?.score ?? 0;
  const dotCount = Math.min(Math.max(topScore, 1), MAX_DOTS);

  return (
    <ol className="wsi-board">
      {players.map((player, index) => {
        const isLeader = crownLeader && topScore > 0 && player.score === topScore;
        const guess = guesses?.get(player.id);
        const rowClass = [
          "wsi-board-row",
          isLeader ? "wsi-leader" : "",
          guess ? (guess.isCorrect ? "wsi-row-right" : "wsi-row-wrong") : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <li key={player.id} className={rowClass}>
            <span className="wsi-board-rank">{index + 1}</span>
            <span className="wsi-board-name">
              {player.name}
              {guesses && (
                <span className="wsi-board-guess">
                  {guess ? `${guess.isCorrect ? "✓" : "✗"} ${guess.choice}` : "no guess"}
                </span>
              )}
            </span>
            <span className="wsi-board-score">
              {showDots && (
                <span className="wsi-board-dots" aria-hidden="true">
                  {Array.from({ length: dotCount }, (_, dot) => (
                    <span
                      key={dot}
                      className={`wsi-board-dot${dot < player.score ? " wsi-on" : ""}`}
                    />
                  ))}
                </span>
              )}
              <span className="wsi-board-num">{player.score}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function QuoteCard({
  round,
  roundIndex,
  totalRounds,
  answer,
  children,
}: {
  round: RoundView;
  roundIndex: number;
  totalRounds: number;
  answer?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`wsi-card${answer ? " wsi-stamped" : ""}`}>
      <span className="wsi-counter">
        Quote {roundIndex + 1} of {totalRounds}
      </span>
      {round.saidOn && <span className="wsi-datetag">{round.saidOn}</span>}

      {round.context && <p className="wsi-ctx">{round.context}</p>}
      <blockquote className="wsi-quote">{round.text}</blockquote>

      {answer && (
        <div className="wsi-stamp" aria-live="polite">
          <span className="wsi-stamp-said">said by</span>
          <span className="wsi-stamp-who">{answer}</span>
        </div>
      )}

      {children}
    </div>
  );
}

/** Lobby / locked-in roster. Chips light up mint once a player has answered. */
export function Roster({
  players,
  showLocked = false,
}: {
  players: PublicPlayer[];
  showLocked?: boolean;
}) {
  if (!players.length) return null;

  return (
    <ul className="wsi-roster">
      {players.map((player) => (
        <li
          key={player.id}
          className={`wsi-chip${showLocked && player.answered ? " wsi-locked" : ""}`}
        >
          {player.name}
        </li>
      ))}
    </ul>
  );
}
