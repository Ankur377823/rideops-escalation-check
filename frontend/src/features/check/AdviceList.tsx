import type { Advice } from "@/lib/types/check";

const STYLE = {
  warn: "bg-amber-50 text-amber-900 ring-1 ring-amber-200",
  info: "bg-slate-50 text-slate-700",
};

export function AdviceList({ advice }: { advice: Advice[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {advice.map((item) => (
        <li key={item.text} className={`rounded-lg px-3 py-2 text-sm ${STYLE[item.level]}`}>
          {item.level === "warn" && <span className="font-semibold">Check first: </span>}
          {item.text}
        </li>
      ))}
    </ul>
  );
}
