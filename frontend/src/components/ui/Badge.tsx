import type { ReactNode } from "react";

const TONES = {
  slate: "bg-slate-100 text-slate-700",
  red: "bg-red-50 text-red-700 ring-1 ring-red-200",
  amber: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  green: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
};

export type Tone = keyof typeof TONES;

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export const priorityTone = (priority: string): Tone =>
  priority === "P1" ? "red" : priority === "P2" ? "amber" : "slate";

export const statusTone = (status: string): Tone =>
  status === "Closed" ? "green" : status.includes("Engineering") ? "blue" : "amber";
