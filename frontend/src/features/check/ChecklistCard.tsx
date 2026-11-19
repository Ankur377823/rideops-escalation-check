import { Card } from "@/components/ui";
import type { ChecklistItem } from "@/lib/types/check";
import { ChecklistField } from "./ChecklistField";
import { isAnswered } from "./checklist";
import type { TicketCheckState } from "./useTicketCheck";

type Props = { checklist: ChecklistItem[]; state: TicketCheckState; matched: boolean };

/** The checklist item that guards against duplicates of a known issue. */
const KNOWN_ISSUE_ITEM = "known_issue";
const MATCH_NOTE =
  "Step 2 found a known issue that matches this ticket. Check it before you tick this.";

export function ChecklistCard({ checklist, state, matched }: Props) {
  const done = checklist.filter((item) => isAnswered(item, state.answers)).length;
  const percent = checklist.length ? Math.round((done / checklist.length) * 100) : 100;
  return (
    <Card
      step={3}
      title="Complete the checklist"
      hint="Each item targets one reason engineering gives for sending tickets back."
    >
      <div className="mb-4">
        <div className="flex justify-between text-xs font-medium text-slate-600">
          <span>
            {done} of {checklist.length} complete
          </span>
          <span>{percent}%</span>
        </div>
        <div
          className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-label="Checklist progress"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full rounded-full transition-all ${percent === 100 ? "bg-emerald-500" : "bg-blue-600"}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <ul className="space-y-2">
        {checklist.map((item) => (
          <ChecklistField
            key={item.id}
            item={item}
            value={state.answers[item.id]}
            done={isAnswered(item, state.answers)}
            note={matched && item.id === KNOWN_ISSUE_ITEM ? MATCH_NOTE : undefined}
            onChange={(value) => state.setAnswer(item.id, value)}
          />
        ))}
      </ul>
    </Card>
  );
}
