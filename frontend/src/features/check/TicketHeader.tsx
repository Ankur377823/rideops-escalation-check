import { Badge, Card, priorityTone, statusTone } from "@/components/ui";
import { hours, plural } from "@/lib/format";
import type { Ticket } from "@/lib/types/ticket";

export function TicketHeader({ ticket }: { ticket: Ticket }) {
  const facts = [
    ["Category", ticket.category],
    ["Client", `${ticket.client_name} (${ticket.client_tier})`],
    ["Channel", ticket.channel],
    ["Raised", ticket.created_at],
    ["Owner", ticket.assigned_agent],
    ["Age", hours(ticket.age_hours)],
  ];
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-slate-500">{ticket.ticket_id}</span>
        <Badge tone={priorityTone(ticket.priority)}>{ticket.priority}</Badge>
        <Badge tone={statusTone(ticket.status)}>{ticket.status}</Badge>
        {ticket.eng_handoffs > 0 && (
          <Badge tone="blue">{plural(ticket.eng_handoffs, "engineering trip")}</Badge>
        )}
      </div>
      <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
        {ticket.description}
      </h1>
      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-slate-100 pt-4 sm:grid-cols-3 lg:grid-cols-6">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              {label}
            </dt>
            <dd className="mt-0.5 text-sm text-slate-800">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
