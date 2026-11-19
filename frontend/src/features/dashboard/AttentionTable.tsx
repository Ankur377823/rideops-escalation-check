import { useState } from "react";
import { Badge, Button, Card, Cell, Table, TicketLink, priorityTone } from "@/components/ui";
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

/** Rows shown before the "Show all" button is used, to keep the page short. */
const FIRST = 6;

export function AttentionTable({ tickets }: { tickets: AttentionTicket[] }) {
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? tickets : tickets.slice(0, FIRST);
  return (
    <Card
      title="Needs attention now"
      hint={`${tickets.length} open tickets with 2+ engineering trips, or older than 48 hours. Most trips first, then oldest.`}
    >
      <Table columns={COLUMNS} minWidth={720}>
        {shown.map((ticket) => (
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
      {tickets.length > FIRST && (
        <div className="mt-3 text-center">
          <Button small onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show fewer" : `Show all ${tickets.length}`}
          </Button>
        </div>
      )}
    </Card>
  );
}
