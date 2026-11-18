"use client";

import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui";
import { useMode } from "./useMode";

const TITLES: Record<string, string> = {
  tickets: "Ticket queue",
  dashboard: "Dashboard",
  log: "Decision log",
  "known-issues": "Known issues",
  evidence: "Does it work?",
};

/** "Ticket queue / SUP-11438" from "/tickets/SUP-11438". */
function crumbs(path: string) {
  const [section, detail] = path.split("/").filter(Boolean);
  if (!section) return ["Overview"];
  const title = TITLES[section] ?? section;
  return detail ? [title, detail] : [title];
}

/** Bar across the top of every page: where you are, the data period and the mode. */
export function TopBar() {
  const trail = crumbs(usePathname());
  const mode = useMode();
  return (
    <div className="sticky top-0 z-20 hidden h-14 items-center justify-between gap-4 border-b border-slate-200 bg-white px-8 lg:flex">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500">RideOps Support</span>
        {trail.map((part, index) => (
          <span key={part} className="flex items-center gap-2">
            <span className="text-slate-300">/</span>
            <span
              className={
                index === trail.length - 1 ? "font-semibold text-slate-900" : "text-slate-500"
              }
            >
              {part}
            </span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Badge>Data: 2 Jul to 30 Sep 2026</Badge>
        {mode && <Badge tone={mode === "enforce" ? "amber" : "blue"}>{mode} mode</Badge>}
      </div>
    </div>
  );
}
