import {
  Badge,
  ButtonLink,
  Cell,
  Table,
  TicketLink,
  priorityTone,
  statusTone,
} from "@/components/ui";
import { hours } from "@/lib/format";
import type { Ticket } from "@/lib/types/ticket";

const COLUMNS = [
  "Ticket",
  "Issue",
  "Client",
  "Agent",
  "Status",
  { label: "Eng trips", right: true },
  { label: "Age", right: true },
  { label: "Action", right: true },
];

function Row({ ticket }: { ticket: Ticket }) {
  return (
    <tr className="hover:bg-slate-50">
      <Cell className="whitespace-nowrap">
        <TicketLink id={ticket.ticket_id} bold />{" "}
        <Badge tone={priorityTone(ticket.priority)}>{ticket.priority}</Badge>
      </Cell>
      <Cell>
        <div>{ticket.description}</div>
        <div className="text-[13px] text-slate-600">{ticket.category}</div>
      </Cell>
      <Cell>{ticket.client_name}</Cell>
      <Cell className="whitespace-nowrap">{ticket.assigned_agent}</Cell>
      <Cell>
        <Badge tone={statusTone(ticket.status)}>{ticket.status}</Badge>
      </Cell>
      <Cell right>{ticket.eng_handoffs || "–"}</Cell>
      <Cell right>{hours(ticket.age_hours)}</Cell>
      <Cell right className="whitespace-nowrap">
        <ButtonLink href={`/tickets/${ticket.ticket_id}`} small>
          Run check
        </ButtonLink>
      </Cell>
    </tr>
  );
}

export function TicketTable({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <Table columns={COLUMNS} minWidth={920}>
        {tickets.map((ticket) => (
          <Row key={ticket.ticket_id} ticket={ticket} />
        ))}
        {tickets.length === 0 && (
          <tr>
            <td colSpan={COLUMNS.length} className="px-3 py-10 text-center text-sm text-slate-600">
              No tickets match these filters.
            </td>
          </tr>
        )}
      </Table>
    </div>
  );
}
