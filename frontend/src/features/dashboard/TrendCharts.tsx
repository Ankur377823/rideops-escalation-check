import { RankBars } from "@/components/charts/RankBars";
import { WeeklyLines } from "@/components/charts/WeeklyLines";
import { Card } from "@/components/ui";
import { plural } from "@/lib/format";
import type { HandoffRow, Week } from "@/lib/types/metrics";

const tripLabel = (row: HandoffRow) =>
  row.eng_handoffs === 0
    ? "L1 only"
    : `${plural(row.eng_handoffs, "trip")} (${row.tickets} tickets)`;

export function TrendCharts({ weeks, handoffs }: { weeks: Week[]; handoffs: HandoffRow[] }) {
  // The first and last buckets are part-weeks; rate charts use full weeks only.
  const fullWeeks = weeks.slice(1, -1);
  const bounce = fullWeeks.map((w) => ({
    week_end: w.week_end,
    bounce: w.bounce_rate == null ? null : Math.round(w.bounce_rate * 100),
  }));
  const trips = handoffs.map((row) => ({ label: tripLabel(row), hours: row.median_hours }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Open tickets at week end" hint="All open, and those older than 48 hours.">
        <WeeklyLines
          data={weeks}
          xKey="week_end"
          series={[
            { key: "open_at_end", name: "All open", color: 1 },
            { key: "open_over_48h", name: "Older than 48h", color: 2 },
          ]}
        />
      </Card>
      <Card
        title="Tickets created and closed per week"
        hint="Full weeks only. Volume is rising and closures only just keep up."
      >
        <WeeklyLines
          data={fullWeeks}
          xKey="week_end"
          series={[
            { key: "created", name: "Created", color: 1 },
            { key: "closed", name: "Closed", color: 2 },
          ]}
        />
      </Card>
      <Card
        title="Share of escalations that came back unfixed"
        hint="By week the ticket was raised. Full weeks only."
      >
        <WeeklyLines
          data={bounce}
          xKey="week_end"
          unit="%"
          series={[{ key: "bounce", name: "Came back", color: 1 }]}
        />
      </Card>
      <Card
        title="Typical hours to close, by trips to engineering"
        hint="Each extra trip adds roughly two days."
      >
        <RankBars data={trips} labelKey="label" valueKey="hours" unit="h" />
      </Card>
    </div>
  );
}
