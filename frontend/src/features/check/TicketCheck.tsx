"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ErrorNote, Loading } from "@/components/ui";
import { usePageTitle } from "@/lib/usePageTitle";
import { ChecklistCard } from "./ChecklistCard";
import { DecisionCard } from "./DecisionCard";
import { HandoffNoteCard } from "./HandoffNoteCard";
import { HistoryCard } from "./HistoryCard";
import { KnownIssuesCard } from "./KnownIssuesCard";
import { L1ExamplesCard } from "./L1ExamplesCard";
import { StepTracker } from "./StepTracker";
import { TicketHeader } from "./TicketHeader";
import { missingItems } from "./checklist";
import { useTicketCheck } from "./useTicketCheck";

/** The check screen: context on the left (steps 1-2), actions on the right (steps 3-5). */
export function TicketCheck() {
  const { id } = useParams<{ id: string }>();
  const state = useTicketCheck(id);
  usePageTitle(id);
  if (state.check.isPending) return <Loading what="check" />;
  if (state.check.isError) return <ErrorNote error={state.check.error} />;
  const check = state.check.data;
  const matched = check.known_issues.some((k) => k.issue_type === check.history.issue_type);
  // Steps 1 and 2 are for reading, so they are never marked done.
  const steps = [
    { label: "History", done: false },
    { label: "Known issues", done: false },
    { label: "Checklist", done: missingItems(check.checklist, state.answers).length === 0 },
    { label: "Handoff note", done: state.note !== null },
    { label: "Decide", done: state.decide.isSuccess },
  ];

  return (
    <div className="space-y-4">
      <Link href="/tickets" className="text-sm font-medium text-blue-700 hover:underline">
        ← Back to ticket queue
      </Link>
      <TicketHeader ticket={check.ticket} />
      <StepTracker steps={steps} />
      <div className="grid items-start gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <HistoryCard history={check.history} advice={check.advice} />
          <KnownIssuesCard issues={check.known_issues} issueType={check.history.issue_type} />
          <L1ExamplesCard examples={check.l1_examples} />
        </div>
        <div className="space-y-4 lg:col-span-3">
          <ChecklistCard checklist={check.checklist} state={state} matched={matched} />
          <HandoffNoteCard note={state.note} makeNote={state.makeNote} />
          <DecisionCard check={check} state={state} />
        </div>
      </div>
    </div>
  );
}
