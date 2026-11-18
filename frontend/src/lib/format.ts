export const pct = (v: number | null | undefined, digits = 0) =>
  v == null ? "–" : `${(v * 100).toFixed(digits)}%`;

/** Hours below two days, days above. */
export const hours = (v: number | null | undefined) => {
  if (v == null) return "–";
  return v >= 48 ? `${(v / 24).toFixed(1)}d` : `${v.toFixed(1)}h`;
};

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
