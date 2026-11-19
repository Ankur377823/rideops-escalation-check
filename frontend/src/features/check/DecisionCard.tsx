import { Card } from "@/components/ui";
import { pct, plural } from "@/lib/format";
import type { Check } from "@/lib/types/check";
import { DecisionBar } from "./DecisionBar";
import { DecisionMessage } from "./DecisionMessage";
import { missingItems } from "./checklist";
import type { TicketCheckState } from "./useTicketCheck";

const HINT = {
  enforce: "Enforce mode: the checklist must be complete to escalate.",
  monitor: "Monitor mode: you can escalate with gaps, and the gaps are logged.",
};

const NOTE = "mb-4 rounded-lg px-3 py-2 text-sm ring-1";

type Props = { check: Check; state: TicketCheckState };

export function DecisionCard({ check, state }: Props) {
  const left = missingItems(check.checklist, state.answers).length;
  const blocked = check.mode === "enforce" && left > 0;
  const { agent } = check;
  return (
    <Card step={5} title="Decide" hint={HINT[check.mode]}>
      {left > 0 && (
        <p
          className={`${NOTE} ${
            blocked
              ? "bg-red-50 text-red-800 ring-red-200"
              : "bg-amber-50 text-amber-900 ring-amber-200"
          }`}
        >
          {plural(left, "checklist item")} still open.{" "}
          {blocked
            ? "Complete the checklist to unlock escalation."
            : "You can still escalate, but the gaps will be recorded."}
        </p>
      )}
      <DecisionBar
        decide={state.decide}
        blocked={blocked}
        canLink={check.known_issues.length > 0}
      />
      <DecisionMessage decide={state.decide} />
      {agent.bounce_rate != null && (
        <p className="mt-4 border-t border-slate-100 pt-3 text-[13px] text-slate-600">
          For reference: {pct(agent.bounce_rate)} of {agent.agent}&rsquo;s past escalations came
          back without a fix. The team average is {pct(agent.team_bounce_rate)}.
        </p>
      )}
    </Card>
  );
}
