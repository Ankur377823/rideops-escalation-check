import { Stat, StatRow } from "@/components/ui";
import { pct } from "@/lib/format";
import type { Scenario } from "@/lib/types/evidence";

export function ScenarioStats({ s }: { s: Scenario }) {
  return (
    <StatRow>
      <Stat
        label="Open older than 48h, 30 Sep"
        value={s.open_over_48h_now_scenario}
        sub={`actual ${s.open_over_48h_now_actual}`}
      />
      <Stat
        label="All open, 30 Sep"
        value={s.open_now_scenario}
        sub={`actual ${s.open_now_actual}`}
      />
      <Stat
        label="Ticket waiting hours removed"
        value={s.hours_saved.toLocaleString()}
        sub={`${pct(s.share_of_all_ticket_hours, 1)} of all waiting time`}
      />
      <Stat
        label="Engineering trips avoided"
        value={Math.round(s.eng_handoffs_avoided)}
        sub="over the three months"
      />
    </StatRow>
  );
}
