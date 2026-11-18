"use client";

import { useQuery } from "@tanstack/react-query";
import { ErrorNote, Loading, PageHeader } from "@/components/ui";
import { PredictorTest } from "@/features/evidence/PredictorTest";
import { ScenarioPanel } from "@/features/evidence/ScenarioPanel";
import { api } from "@/lib/api";
import type { Predictors } from "@/lib/types/evidence";

export default function EvidencePage() {
  const predictors = useQuery({
    queryKey: ["predictors"],
    queryFn: () => api<Predictors>("/evidence/predictors"),
  });
  return (
    <div className="space-y-4">
      <PageHeader title="Does it work?" audience="Evidence">
        Two tests of the idea against the ticket history. The first one failed, and it changed the
        design.
      </PageHeader>
      {predictors.isError && <ErrorNote error={predictors.error} />}
      {predictors.isPending && <Loading what="predictor test" />}
      {predictors.data && <PredictorTest p={predictors.data} />}
      <ScenarioPanel />
    </div>
  );
}
