"use client";

import { useQuery } from "@tanstack/react-query";
import { ErrorNote, Loading, PageHeader } from "@/components/ui";
import { LogStats } from "@/features/log/LogStats";
import { LogTable } from "@/features/log/LogTable";
import { api } from "@/lib/api";
import type { DecisionLog } from "@/lib/types/decisions";

export default function LogPage() {
  const log = useQuery({
    queryKey: ["decisions"],
    queryFn: () => api<DecisionLog>("/decisions"),
    staleTime: 0,
  });
  if (log.isError) return <ErrorNote error={log.error} />;
  if (!log.data) return <Loading what="log" />;
  return (
    <div className="space-y-4">
      <PageHeader title="Decision log" audience="Support lead">
        Every check an agent completes is recorded here. In a pilot this is how the tool’s effect is
        measured.
      </PageHeader>
      <LogStats s={log.data.summary} />
      <LogTable decisions={log.data.items} />
    </div>
  );
}
