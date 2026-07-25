/** Reaction lines from the original prototype. Kept because they're the charm. */

export const HITS = [
  "Obviously.",
  "Called it.",
  "No notes.",
  "Textbook.",
  "Deeply in character.",
  "Of course it was.",
  "Zero surprise here.",
  "You know this family.",
];

export const MISSES = [
  "Nope. Not even close.",
  "Wrong, but understandable.",
  "Bold guess. Incorrect.",
  "Wrong. Try harder.",
  "Nah. Look who it was.",
  "Incorrect, and a little insulting.",
];

export const NO_GUESS = ["Fair enough.", "Sat that one out.", "No comment recorded."];

/** Indexed rather than random so a screen doesn't reshuffle its own line on refetch. */
export function flavor(lines: string[], seed: number): string {
  return lines[Math.abs(seed) % lines.length];
}
