import { Stat, StatRow } from "@/components/ui";
import { pct } from "@/lib/format";
import type { Headline } from "@/lib/types/metrics";

export function HeadlineStats({ s }: { s: Headline }) {
  return (
    <StatRow>
      <Stat
        role="Headline"
        icon="clock"
        label="Open tickets older than 48h"
        value={s.open_over_48h_now}
        sub={`of ${s.open_now} open now`}
      />
      <Stat
        role="Driver"
        icon="returned"
        label="Escalations that came back unfixed"
        value={pct(s.bounce_rate)}
        sub={`${s.bounced} of ${s.escalated} escalations`}
      />
      <Stat
        role="Driver"
        icon="repeat"
        label="Tickets with 2+ engineering trips"
        value={s.multi_handoff}
        sub={`of ${s.tickets.toLocaleString()} tickets`}
      />
      <Stat
        role="Guardrail"
        icon="reopen"
        label="Reopened by client"
        value={pct(s.reopen_rate, 1)}
        sub="must not rise"
      />
    </StatRow>
  );
}
