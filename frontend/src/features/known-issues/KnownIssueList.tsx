import { Badge, Button } from "@/components/ui";
import type { KnownIssue } from "@/lib/types/check";

type Props = { issues: KnownIssue[]; onToggle: (issue: KnownIssue) => void };

export function KnownIssueList({ issues, onToggle }: Props) {
  return (
    <div className="space-y-2">
      {issues.map((issue) => (
        <div
          key={issue.id}
          className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{issue.title}</span>
              <Badge tone={issue.status === "Open" ? "amber" : "green"}>{issue.status}</Badge>
            </div>
            <div className="mt-0.5 text-sm text-slate-600">
              {issue.category}
              {issue.source && ` · ${issue.source}`}
            </div>
            {issue.workaround && (
              <div className="mt-0.5 text-sm text-slate-700">Workaround: {issue.workaround}</div>
            )}
          </div>
          <Button small onClick={() => onToggle(issue)}>
            {issue.status === "Open" ? "Mark fixed" : "Reopen"}
          </Button>
        </div>
      ))}
    </div>
  );
}
