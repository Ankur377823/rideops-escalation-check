import { Card } from "@/components/ui";
import { plural } from "@/lib/format";
import type { Check } from "@/lib/types/check";
import { DecisionBar } from "./DecisionBar";
import { DecisionMessage } from "./DecisionMessage";
import { missingItems } from "./checklist";
import type { TicketCheckState } from "./useTicketCheck";

const HINT = {
  enforce: "Enforce mode: the checklist must be complete to escalate.",
  monitor: "Monitor mode: you can escalate with gaps, and the gaps are logged.",
};

type Props = { check: Check; state: TicketCheckState };

export function DecisionCard({ check, state }: Props) {
  const left = missingItems(check.checklist, state.answers).length;
  const blocked = check.mode === "enforce" && left > 0;
  return (
    <Card step={5} title="Decide" hint={HINT[check.mode]}>
      {left > 0 && (
        <p
          className={`mb-4 rounded-lg px-3 py-2 text-sm ring-1 ${
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
    </Card>
  );
}
