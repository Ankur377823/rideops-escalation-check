import { Stat, StatRow } from "@/components/ui";
import { pct } from "@/lib/format";
import type { Headline } from "@/lib/types/metrics";

/** The four numbers behind the argument: more volume, old open tickets, returns, wasted trips. */
export function ProblemStats({ s }: { s: Headline }) {
  const july = s.tickets_by_month["2026-07"];
  const september = s.tickets_by_month["2026-09"];
  return (
    <StatRow>
      <Stat
        icon="chart"
        label="More new tickets, July to September"
        value={`+${Math.round((september / july - 1) * 100)}%`}
        sub={`${july} in July, ${september} in September`}
      />
      <Stat
        icon="clock"
        label="Open tickets older than 48h"
        value={s.open_over_48h_now}
        sub={`of ${s.open_now} open now`}
      />
      <Stat
        icon="returned"
        label="Escalations that came back unfixed"
        value={pct(s.bounce_rate)}
        sub={`${s.bounced} of ${s.escalated} escalations`}
      />
      <Stat
        icon="repeat"
        label="Engineering trips spent on tickets it did not fix"
        value={pct(s.eng_trips_not_fixed / s.eng_trips)}
        sub={`${s.eng_trips_not_fixed} of ${s.eng_trips} trips`}
      />
    </StatRow>
  );
}
