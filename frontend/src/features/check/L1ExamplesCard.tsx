import { Card, TicketLink } from "@/components/ui";
import { hours } from "@/lib/format";
import type { L1Example } from "@/lib/types/check";

export function L1ExamplesCard({ examples }: { examples: L1Example[] }) {
  return (
    <Card
      title="Who solved this at L1"
      hint="Recent tickets of this type closed without engineering and not reopened. Ask them how."
    >
      {examples.length === 0 && <p className="text-sm text-slate-600">No examples yet.</p>}
      <ul className="space-y-1 text-sm">
        {examples.map((example) => (
          <li key={example.ticket_id} className="flex justify-between gap-3">
            <TicketLink id={example.ticket_id} />
            <span className="flex-1 text-slate-700">{example.agent}</span>
            <span className="tabular-nums text-slate-500">{hours(example.hours)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
