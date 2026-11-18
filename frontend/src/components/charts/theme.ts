export const AXIS = { fontSize: 12, fill: "#475569" };
export const INK = "#334155";
export const GRID = "#e2e8f0";
export const TOOLTIP = {
  fontSize: 12,
  borderRadius: 8,
  border: `1px solid ${GRID}`,
  color: "#0f172a",
};

/** Validated categorical colours, defined in globals.css. */
export const seriesColor = (slot: 1 | 2) => `var(--series-${slot})`;
