"use client";

import { ErrorNote, Loading, PageHeader } from "@/components/ui";
import { KnownIssueForm } from "@/features/known-issues/KnownIssueForm";
import { KnownIssueList } from "@/features/known-issues/KnownIssueList";
import { useKnownIssues } from "@/features/known-issues/useKnownIssues";

export default function KnownIssuesPage() {
  const { issues, add, setStatus } = useKnownIssues();
  if (issues.isError) return <ErrorNote error={issues.error} />;
  if (!issues.data) return <Loading what="known issues" />;
  return (
    <div className="space-y-4">
      <PageHeader title="Known issues" audience="Engineering">
        Engineering keeps this list. Agents see open items for the ticket’s category during the
        check, so known problems are linked instead of escalated again.
      </PageHeader>
      <KnownIssueForm add={add} />
      <KnownIssueList
        issues={issues.data}
        onToggle={(issue) =>
          setStatus.mutate({ id: issue.id, status: issue.status === "Open" ? "Fixed" : "Open" })
        }
      />
    </div>
  );
}
