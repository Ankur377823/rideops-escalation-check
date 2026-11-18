import { Cell, Table } from "@/components/ui";
import type { ReasonRow } from "@/lib/types/evidence";

const COLUMNS = [
  "Return reason",
  { label: "Tickets", right: true },
  "Becomes",
  { label: "Hours saved", right: true },
];

export function ReasonTable({ rows }: { rows: ReasonRow[] }) {
  return (
    <Table columns={COLUMNS} minWidth={0}>
      {rows.map((row) => (
        <tr key={row.reason}>
          <Cell>{row.reason}</Cell>
          <Cell right>{row.tickets}</Cell>
          <Cell className="text-slate-600">{row.becomes}</Cell>
          <Cell right>{row.hours_saved.toLocaleString()}</Cell>
        </tr>
      ))}
    </Table>
  );
}
