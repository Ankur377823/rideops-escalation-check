import { Card } from "@/components/ui";
import type { KnownIssue } from "@/lib/types/check";

type Props = { issues: KnownIssue[]; issueType: string };

/** Known issues for the ticket's category. One with the same issue type is put first and highlighted. */
export function KnownIssuesCard({ issues, issueType }: Props) {
  const isMatch = (issue: KnownIssue) => issue.issue_type === issueType;
  const ordered = [...issues].sort((a, b) => Number(isMatch(b)) - Number(isMatch(a)));
  return (
    <Card
      step={2}
      title="Check known issues"
      hint="Open issues in this category, maintained by engineering. If one matches, link it instead of escalating."
    >
      {issues.length === 0 && (
        <p className="text-sm text-slate-600">No open known issues in this category.</p>
      )}
      <ul className="space-y-2">
        {ordered.map((issue) => (
          <li
            key={issue.id}
            className={`rounded-lg border p-3 text-sm ${
              isMatch(issue) ? "border-blue-300 bg-blue-50" : "border-slate-200"
            }`}
          >
            {isMatch(issue) && (
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                This ticket matches this known issue
              </div>
            )}
            <div className="font-medium">{issue.title}</div>
            {issue.workaround && (
              <div className="mt-0.5 text-slate-600">Workaround: {issue.workaround}</div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
