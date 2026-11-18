"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { put } from "@/lib/api";
import type { Mode } from "@/lib/types/check";
import { useMode } from "./useMode";

const HELP: Record<Mode, string> = {
  monitor: "Agents can escalate with gaps. The gaps are logged.",
  enforce: "Escalation is blocked until the checklist is complete.",
};

export function ModeToggle() {
  const queryClient = useQueryClient();
  const mode = useMode();
  const setMode = useMutation({
    mutationFn: (next: Mode) => put("/settings/mode", { mode: next }),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  return (
    <div className="border-t border-white/10 p-3 lg:p-4">
      <div className="flex items-center justify-between gap-3 lg:block">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Check mode
        </div>
        <div
          className="flex rounded-lg bg-white/10 p-0.5 lg:mt-2"
          role="group"
          aria-label="Check mode"
        >
          {(Object.keys(HELP) as Mode[]).map((option) => (
            <button
              key={option}
              onClick={() => setMode.mutate(option)}
              disabled={!mode || setMode.isPending}
              aria-pressed={mode === option}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold capitalize ${
                mode === option
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-[13px] text-slate-300">{mode ? HELP[mode] : "Loading mode…"}</p>
    </div>
  );
}
