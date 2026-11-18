import { Badge, Card, Cell, Table, TicketLink } from "@/components/ui";
import type { Decision } from "@/lib/types/decisions";

const LABEL: Record<string, string> = {
  escalated: "Escalated",
  resolved_at_l1: "Kept at L1",
  linked_known_issue: "Linked to known issue",
};
const COLUMNS = [
  "When (UTC)",
  "Ticket",
  "Agent",
  "Decision",
  "Mode",
  { label: "Checklist gaps", right: true },
];

export function LogTable({ decisions }: { decisions: Decision[] }) {
  if (decisions.length === 0) {
    return (
      <Card>
        <p className="py-6 text-center text-sm text-slate-600">
          Nothing logged yet. Open a ticket and complete a check to see it here.
        </p>
      </Card>
    );
  }
  return (
    <Card>
      <Table columns={COLUMNS}>
        {decisions.map((decision) => {
          const escalated = decision.action === "escalated";
          return (
            <tr key={decision.id}>
              <Cell className="whitespace-nowrap">
                {decision.created_at.slice(0, 19).replace("T", " ")}
              </Cell>
              <Cell>
                <TicketLink id={decision.ticket_id} />
              </Cell>
              <Cell>{decision.agent ?? "–"}</Cell>
              <Cell>
                <Badge tone={escalated ? "blue" : "green"}>
                  {LABEL[decision.action] ?? decision.action}
                </Badge>
              </Cell>
              <Cell className="capitalize">{decision.mode}</Cell>
              <Cell right>{escalated ? decision.missing_items.length : "–"}</Cell>
            </tr>
          );
        })}
      </Table>
    </Card>
  );
}
