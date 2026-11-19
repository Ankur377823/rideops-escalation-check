import { Button } from "@/components/ui";
import type { TicketCheckState } from "./useTicketCheck";

type Props = { decide: TicketCheckState["decide"]; blocked: boolean; canLink: boolean };

/** The three things an agent can do with a ticket after the check. The tool does not pick one. */
export function DecisionBar({ decide, blocked, canLink }: Props) {
  const busy = decide.isPending;
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div>
        <Button
          variant="primary"
          className="w-full"
          disabled={blocked || busy}
          onClick={() => decide.mutate("escalated")}
        >
          Escalate to engineering
        </Button>
        <p className="mt-1.5 text-[13px] text-slate-600">Engineering needs to fix it.</p>
      </div>
      <div>
        <Button className="w-full" disabled={busy} onClick={() => decide.mutate("resolved_at_l1")}>
          Keep at L1
        </Button>
        <p className="mt-1.5 text-[13px] text-slate-600">You can solve it without engineering.</p>
      </div>
      <div>
        <Button
          className="w-full"
          disabled={busy || !canLink}
          onClick={() => decide.mutate("linked_known_issue")}
        >
          Link to known issue
        </Button>
        <p className="mt-1.5 text-[13px] text-slate-600">
          {canLink
            ? "It is the same problem as one on the board."
            : "No known issues in this category."}
        </p>
      </div>
    </div>
  );
}
