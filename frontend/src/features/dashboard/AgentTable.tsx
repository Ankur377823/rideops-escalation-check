import { Badge, Card, Cell, Table } from "@/components/ui";
import { hours, pct } from "@/lib/format";
import type { AgentRow } from "@/lib/types/metrics";

type RateKey = "escalation_rate" | "bounce_rate" | "reopen_rate";

const right = (label: string) => ({ label, right: true });
const COLUMNS = [
  "Agent",
  ...["Tickets", "Escalated", "Came back", "Typical close", "Reopened", "Rating", "Open"].map(
    right,
  ),
];

/** The top value in a column, but only when it is clearly above the next one. */
function outlier(rows: AgentRow[], key: RateKey) {
  const values = rows.map((row) => row[key] ?? 0).sort((a, b) => b - a);
  return values[0] >= values[1] * 1.3 ? values[0] : null;
}

function RateCell({ value, flag }: { value: number | null; flag: number | null }) {
  const isOutlier = flag != null && value === flag;
  return (
    <Cell right>{isOutlier ? <Badge tone="red">{pct(value)} highest</Badge> : pct(value)}</Cell>
  );
}

export function AgentTable({ agents }: { agents: AgentRow[] }) {
  const flag = (key: RateKey) => outlier(agents, key);
  return (
    <Card title="By agent" hint="Speed alone misleads: read time to close next to the reopen rate.">
      <Table columns={COLUMNS} minWidth={720}>
        {agents.map((agent) => (
          <tr key={agent.assigned_agent}>
            <Cell className="font-medium">{agent.assigned_agent}</Cell>
            <Cell right>{agent.tickets}</Cell>
            <RateCell value={agent.escalation_rate} flag={flag("escalation_rate")} />
            <RateCell value={agent.bounce_rate} flag={flag("bounce_rate")} />
            <Cell right>{hours(agent.median_hours)}</Cell>
            <RateCell value={agent.reopen_rate} flag={flag("reopen_rate")} />
            <Cell right>{agent.csat?.toFixed(2) ?? "–"}</Cell>
            <Cell right>{agent.open}</Cell>
          </tr>
        ))}
      </Table>
    </Card>
  );
}
