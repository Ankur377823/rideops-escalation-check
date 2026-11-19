"use client";

import { useQuery } from "@tanstack/react-query";
import { ErrorNote, Loading } from "@/components/ui";
import { DemoPath } from "@/features/overview/DemoPath";
import { Hero } from "@/features/overview/Hero";
import { HowItWorks } from "@/features/overview/HowItWorks";
import { ProblemStats } from "@/features/overview/ProblemStats";
import { ScreenGuide } from "@/features/overview/ScreenGuide";
import { api } from "@/lib/api";
import type { Summary } from "@/lib/types/metrics";
import { usePageTitle } from "@/lib/usePageTitle";

export default function OverviewPage() {
  usePageTitle("Overview");
  const summary = useQuery({
    queryKey: ["summary"],
    queryFn: () => api<Summary>("/metrics/summary"),
  });
  return (
    <div className="space-y-5">
      <Hero />
      <section>
        <h2 className="text-sm font-semibold text-slate-900">The problem in four numbers</h2>
        <p className="mt-0.5 text-[13px] text-slate-600">
          From 1,444 tickets raised between 2 Jul and 30 Sep 2026.
        </p>
        <div className="mt-3">
          {summary.isError && <ErrorNote error={summary.error} />}
          {summary.isPending && <Loading what="numbers" />}
          {summary.data && <ProblemStats s={summary.data.summary} />}
        </div>
      </section>
      <HowItWorks />
      <DemoPath />
      <ScreenGuide />
    </div>
  );
}
