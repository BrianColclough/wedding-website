export type Phase = "lobby" | "question" | "revealed" | "final";

export const PHASES: Phase[] = ["lobby", "question", "revealed", "final"];

export type HostAction = "start" | "reveal" | "next" | "reset";

export type PublicPlayer = {
  id: string;
  name: string;
  score: number;
  /** Has this player locked in a guess for the current round? */
  answered: boolean;
};

export type RoundView = {
  text: string;
  context: string | null;
  saidOn: string | null;
  options: string[];
};

export type RevealResult = {
  playerId: string;
  choice: string;
  isCorrect: boolean;
};

/**
 * What GET /api/who-said-it/state returns.
 *
 * `answer` and `results` are omitted entirely unless phase === "revealed".
 * They are optional in the type on purpose — anything that makes them
 * unconditionally present is a cheat waiting to happen.
 */
export type GameState = {
  code: string;
  phase: Phase;
  roundIndex: number;
  totalRounds: number;
  players: PublicPlayer[];
  answeredCount: number;
  playerCount: number;
  round: RoundView | null;
  yourGuess: string | null;
  answer?: string;
  results?: RevealResult[];
};

export type QuoteRow = {
  id: number;
  text: string;
  said_by: string;
  said_on: string | null;
  context: string | null;
  active: boolean;
};
