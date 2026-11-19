import { Stat, StatRow } from "@/components/ui";
import { pct } from "@/lib/format";
import type { Headline, Week } from "@/lib/types/metrics";

const day = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

type Props = { s: Headline; weeks: Week[] };

/** The five measures. The big number is the latest full week; the line under it gives the week
 *  before and the three-month figure. The last entry in `weeks` is a part-week, so it is skipped. */
export function HeadlineStats({ s, weeks }: Props) {
  const latest = weeks[weeks.length - 2];
  const before = weeks[weeks.length - 3];
  return (
    <div>
      <StatRow five>
        <Stat
          wide
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
          value={pct(latest.bounce_rate)}
          sub={`${pct(before.bounce_rate)} the week before. ${pct(s.bounce_rate)} over three months`}
        />
        <Stat
          role="Driver"
          icon="repeat"
          label="Tickets with 2+ engineering trips"
          value={latest.multi_handoff}
          sub={`${before.multi_handoff} the week before. ${s.multi_handoff} in three months`}
        />
        <Stat
          role="Guardrail"
          icon="reopen"
          label="Reopened by client"
          value={pct(latest.reopen_rate, 1)}
          sub={`${pct(before.reopen_rate, 1)} the week before. ${pct(s.reopen_rate, 1)} over three months`}
        />
        <Stat
          role="Guardrail"
          icon="check"
          label="Average client rating"
          value={latest.csat?.toFixed(2) ?? "–"}
          sub={`${before.csat?.toFixed(2) ?? "–"} the week before. ${s.csat?.toFixed(2) ?? "–"} over three months`}
        />
      </StatRow>
      <p className="mt-2 text-[13px] text-slate-600">
        The headline is the count today. The other four show the latest full week, for tickets
        raised from {day(latest.week_start)}. Proposed four-week targets: about 18 open over 48
        hours, returns under 40%, about 11 multi-trip tickets a week, and reopens and rating no
        worse. The rating is filled in on about 45% of tickets.
      </p>
    </div>
  );
}
