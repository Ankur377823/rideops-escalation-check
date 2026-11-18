import Link from "next/link";
import { ApiError } from "@/lib/api";
import { plural } from "@/lib/format";
import type { Action } from "@/lib/types/check";
import type { TicketCheckState } from "./useTicketCheck";

const DONE: Record<Action, string> = {
  escalated: "Escalation logged.",
  resolved_at_l1: "Logged: kept at L1.",
  linked_known_issue: "Logged: linked to a known issue, not escalated.",
};

const BOX = "mt-3 rounded-lg px-3 py-2 text-sm ring-1";

export function DecisionMessage({ decide }: { decide: TicketCheckState["decide"] }) {
  if (decide.isSuccess) {
    const gaps = decide.data.missing_items.length;
    return (
      <p className={`${BOX} bg-emerald-50 text-emerald-800 ring-emerald-200`}>
        {DONE[decide.data.action]} {gaps > 0 && `${plural(gaps, "checklist gap")} recorded. `}
        <Link href="/log" className="underline">
          View log
        </Link>
      </p>
    );
  }
  if (decide.isError) {
    const blocked = decide.error instanceof ApiError && decide.error.status === 409;
    return (
      <p className={`${BOX} bg-red-50 text-red-800 ring-red-200`}>
        {blocked
          ? "Blocked: the checklist is incomplete and enforce mode is on."
          : "Could not save the decision. Try again."}
      </p>
    );
  }
  return null;
}
