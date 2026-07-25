/**
 * Pure values with no Node built-ins, so client components can import them.
 * Anything needing node:crypto belongs in game.ts (server-only).
 */

export const OPTIONS_PER_ROUND = 4;
export const MAX_PLAYERS = 16;
export const MAX_NAME_LENGTH = 20;
export const DEFAULT_ROUNDS = 15;
export const MAX_ROUNDS = 60;
export const ROOM_CODE_LENGTH = 4;

/** A speaker needs at least this many quotes to be used as a wrong answer. */
export const MIN_QUOTES_FOR_DECOY = 3;

/** How often each screen refetches even if no Realtime event arrives. */
export const FALLBACK_POLL_MS = 10_000;

// Every distinct said_by value is a distinct person. Matt, Matt Neighbor and
// Matt Briley are three different people, as are Chris and Chris Sr., so they
// are all allowed to appear as options in the same question — telling them apart
// is part of the game, not an unfair coin flip.
