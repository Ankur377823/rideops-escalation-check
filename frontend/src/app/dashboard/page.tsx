"use client";

import { useQuery } from "@tanstack/react-query";
import { ErrorNote, Loading, PageHeader } from "@/components/ui";
import { AgentTable } from "@/features/dashboard/AgentTable";
import { AttentionTable } from "@/features/dashboard/AttentionTable";
import { HeadlineStats } from "@/features/dashboard/HeadlineStats";
import { TrendCharts } from "@/features/dashboard/TrendCharts";
import { api } from "@/lib/api";
import type { AgentRow, AttentionTicket, Summary, Week } from "@/lib/types/metrics";

const load = <T,>(key: string, path: string) => ({ queryKey: [key], queryFn: () => api<T>(path) });

export default function DashboardPage() {
  const summary = useQuery(load<Summary>("summary", "/metrics/summary"));
  const weekly = useQuery(load<Week[]>("weekly", "/metrics/weekly"));
  const agents = useQuery(load<AgentRow[]>("agents", "/metrics/agents"));
  const attention = useQuery(load<AttentionTicket[]>("attention", "/metrics/attention"));

  const error = summary.error ?? weekly.error ?? agents.error ?? attention.error;
  if (error) return <ErrorNote error={error} />;
  if (!summary.data || !weekly.data || !agents.data || !attention.data)
    return <Loading what="dashboard" />;

  return (
    <div className="space-y-4">
      <PageHeader title="Dashboard" audience="Support lead">
        One headline measure, two drivers and one guardrail to watch each week. Data as of 30 Sep
        2026.
      </PageHeader>
      <HeadlineStats s={summary.data.summary} />
      <TrendCharts weeks={weekly.data} handoffs={summary.data.by_handoffs} />
      <AgentTable agents={agents.data} />
      <AttentionTable tickets={attention.data} />
    </div>
  );
}
