import { Stat, StatRow } from "@/components/ui";
import type { DecisionSummary } from "@/lib/types/decisions";

export function LogStats({ s }: { s: DecisionSummary }) {
  return (
    <StatRow>
      <Stat label="Checks run" value={s.checks} />
      <Stat
        label="Escalated"
        value={s.escalated}
        sub={`${s.escalated_with_gaps} with checklist gaps`}
      />
      <Stat label="Kept at L1" value={s.kept_at_l1} />
      <Stat label="Linked to known issue" value={s.linked_known_issue} />
    </StatRow>
  );
}
