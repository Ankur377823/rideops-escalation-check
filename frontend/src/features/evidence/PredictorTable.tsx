import { Cell, Table } from "@/components/ui";
import { pct } from "@/lib/format";
import type { Predictors } from "@/lib/types/evidence";

const COLUMNS = [
  "Flag an escalation when…",
  { label: "Flagged", right: true },
  { label: "Of flagged, came back", right: true },
  { label: "Of all that came back, caught", right: true },
];

export function PredictorTable({ p }: { p: Predictors }) {
  return (
    <Table columns={COLUMNS} minWidth={560}>
      <tr className="bg-slate-50">
        <Cell className="font-medium">Flag every escalation (no rule)</Cell>
        <Cell right>{p.test_escalations}</Cell>
        <Cell right className="font-medium">
          {pct(p.base_bounce_rate)}
        </Cell>
        <Cell right>100%</Cell>
      </tr>
      {p.rules.map((rule) => (
        <tr key={rule.rule}>
          <Cell>
            {rule.rule} had ≥{pct(p.threshold)} come back before
          </Cell>
          <Cell right>{rule.flagged}</Cell>
          <Cell right>{pct(rule.precision)}</Cell>
          <Cell right>{pct(rule.recall)}</Cell>
        </tr>
      ))}
    </Table>
  );
}
