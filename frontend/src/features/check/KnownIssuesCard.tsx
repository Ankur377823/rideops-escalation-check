import { Card } from "@/components/ui";
import type { KnownIssue } from "@/lib/types/check";

export function KnownIssuesCard({ issues }: { issues: KnownIssue[] }) {
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
        {issues.map((issue) => (
          <li key={issue.id} className="rounded-lg border border-slate-200 p-3 text-sm">
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
