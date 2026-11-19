import { Card } from "@/components/ui";
import type { KnownIssue } from "@/lib/types/check";

type Props = { issues: KnownIssue[]; issueType: string };

/** Known issues for the ticket's category. One with the same issue type is listed first and marked,
 *  but the agent decides whether it is the same problem: the same type is often a different cause. */
export function KnownIssuesCard({ issues, issueType }: Props) {
  const sameType = (issue: KnownIssue) => issue.issue_type === issueType;
  const ordered = [...issues].sort((a, b) => Number(sameType(b)) - Number(sameType(a)));
  return (
    <Card
      step={2}
      title="Check known issues"
      hint="Open issues in this category, maintained by engineering. If one is the same problem, link it instead of escalating."
    >
      {issues.length === 0 && (
        <p className="text-sm text-slate-600">No open known issues in this category.</p>
      )}
      <ul className="space-y-2">
        {ordered.map((issue) => (
          <li
            key={issue.id}
            className={`rounded-lg border p-3 text-sm ${
              sameType(issue) ? "border-slate-400 bg-slate-50" : "border-slate-200"
            }`}
          >
            {sameType(issue) && (
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                Same issue type as this ticket
              </div>
            )}
            <div className="font-medium">{issue.title}</div>
            {issue.workaround && (
              <div className="mt-0.5 text-slate-600">Workaround: {issue.workaround}</div>
            )}
            {sameType(issue) && (
              <div className="mt-1 text-[13px] text-slate-600">
                Check that it is the same problem. The same issue type often has a different cause.
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
