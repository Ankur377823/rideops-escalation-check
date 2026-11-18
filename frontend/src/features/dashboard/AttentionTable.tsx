import { Badge, Card, Cell, Table, TicketLink, priorityTone } from "@/components/ui";
import { hours } from "@/lib/format";
import type { AttentionTicket } from "@/lib/types/metrics";

const COLUMNS = [
  "Ticket",
  "Category",
  "Client",
  "Agent",
  "With",
  { label: "Eng trips", right: true },
  { label: "Age", right: true },
];

export function AttentionTable({ tickets }: { tickets: AttentionTicket[] }) {
  return (
    <Card
      title="Needs attention now"
      hint="Open tickets with 2+ engineering trips, or older than 48 hours."
    >
      <Table columns={COLUMNS} minWidth={720}>
        {tickets.map((ticket) => (
          <tr key={ticket.ticket_id}>
            <Cell className="whitespace-nowrap">
              <TicketLink id={ticket.ticket_id} bold />{" "}
              <Badge tone={priorityTone(ticket.priority)}>{ticket.priority}</Badge>
            </Cell>
            <Cell>{ticket.category}</Cell>
            <Cell>{ticket.client_name}</Cell>
            <Cell className="whitespace-nowrap">{ticket.assigned_agent}</Cell>
            <Cell>{ticket.status.replace("Open - with ", "")}</Cell>
            <Cell right>{ticket.eng_handoffs || "–"}</Cell>
            <Cell right>{hours(ticket.age_hours)}</Cell>
          </tr>
        ))}
      </Table>
    </Card>
  );
}
