import { Badge, Card } from "@/components/ui";
import { pct } from "@/lib/format";
import type { Predictors } from "@/lib/types/evidence";
import { PredictorTable } from "./PredictorTable";

export function PredictorTest({ p }: { p: Predictors }) {
  const strongest = p.rules[p.rules.length - 1];
  const known = p.known_issue_rule;
  return (
    <Card
      title="Test 1: can we predict which escalations will come back?"
      hint={`Rules learned on ${p.train_escalations} escalations raised before 1 Sep, then scored on ${p.test_escalations} raised in September.`}
      action={<Badge tone="red">Does not predict</Badge>}
    >
      <PredictorTable p={p} />
      <div className="mt-4 space-y-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
        <p>
          <span className="font-semibold">Result:</span> the type of issue does not tell us which
          escalations will come back. It does no better than flagging everything (
          {pct(p.base_bounce_rate)}). The agent matters a little, but the strongest rule only covers{" "}
          {strongest.flagged} tickets.
        </p>
        <p>
          The same holds for duplicates: “same issue escalated in the last 7 days” is right{" "}
          {pct(known.precision)} of the time against a {pct(known.base_rate)} base rate. So
          duplicates need a board that engineering maintains, not an automatic guess.
        </p>
        <p>
          <span className="font-semibold">What this changed:</span> the tool does not score tickets
          as risky. It runs the same checklist on every escalation, aimed at the reasons engineering
          gives for sending tickets back.
        </p>
      </div>
    </Card>
  );
}
