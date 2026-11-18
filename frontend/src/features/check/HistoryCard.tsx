import { Card } from "@/components/ui";
import type { Advice, History } from "@/lib/types/check";
import { AdviceList } from "./AdviceList";

function Count({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="text-xl font-semibold tabular-nums">{value}</div>
      <div className="text-[13px] text-slate-600">{label}</div>
    </div>
  );
}

function ReturnReasons({ reasons }: { reasons: History["return_reasons"] }) {
  if (reasons.length === 0) return null;
  return (
    <div className="mt-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        Why engineering sent them back
      </div>
      <ul className="mt-2 space-y-1.5">
        {reasons.map((reason) => (
          <li key={reason.reason} className="flex justify-between text-sm">
            <span>{reason.reason}</span>
            <span className="tabular-nums text-slate-600">{reason.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HistoryCard({ history, advice }: { history: History; advice: Advice[] }) {
  return (
    <Card
      step={1}
      title="Review the history"
      hint={`Past tickets with the same issue: ${history.issue_type}`}
    >
      <div className="grid grid-cols-3 gap-3 text-center">
        <Count label="Solved at L1" value={history.resolved_at_l1} />
        <Count label="Fixed by engineering" value={history.fixed_by_eng} />
        <Count label="Came back unfixed" value={history.bounced} />
      </div>
      <AdviceList advice={advice} />
      <ReturnReasons reasons={history.return_reasons} />
    </Card>
  );
}
