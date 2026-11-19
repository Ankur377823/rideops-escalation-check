import { Button } from "@/components/ui";
import type { TicketCheckState } from "./useTicketCheck";

type Props = {
  decide: TicketCheckState["decide"];
  blocked: boolean;
  canLink: boolean;
  /** True when the ticket matches a known issue, so linking is the suggested action. */
  matched: boolean;
};

/** The three things an agent can do with a ticket after the check. */
export function DecisionBar({ decide, blocked, canLink, matched }: Props) {
  const busy = decide.isPending;
  const linkHelp = matched
    ? "This ticket matches an issue on the board."
    : canLink
      ? "It matches an issue on the board."
      : "No known issues in this category.";
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div>
        <Button
          variant={matched ? "secondary" : "primary"}
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
          variant={matched ? "primary" : "secondary"}
          className="w-full"
          disabled={busy || !canLink}
          onClick={() => decide.mutate("linked_known_issue")}
        >
          Link to known issue
        </Button>
        <p className="mt-1.5 text-[13px] text-slate-600">{linkHelp}</p>
      </div>
    </div>
  );
}
