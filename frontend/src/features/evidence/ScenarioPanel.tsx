"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { WeeklyLines } from "@/components/charts/WeeklyLines";
import { Badge, Card, ErrorNote, Loading } from "@/components/ui";
import { api } from "@/lib/api";
import type { Scenario } from "@/lib/types/evidence";
import { ReasonTable } from "./ReasonTable";
import { ScenarioNotes } from "./ScenarioNotes";
import { ScenarioStats } from "./ScenarioStats";

export function ScenarioPanel() {
  const [rate, setRate] = useState(50);
  const scenario = useQuery({
    queryKey: ["scenario", rate],
    queryFn: () => api<Scenario>(`/evidence/scenario?prevention_rate=${rate / 100}`),
    placeholderData: keepPreviousData,
  });
  if (scenario.isError) return <ErrorNote error={scenario.error} />;
  if (!scenario.data) return <Loading what="scenario" />;
  const s = scenario.data;

  return (
    <Card
      title="Test 2: what if the check prevented some of the avoidable returns?"
      hint="Move the slider to change the assumption. The numbers below update."
      action={<Badge tone="amber">What-if, not measured</Badge>}
    >
      <label className="mb-4 block rounded-lg bg-slate-50 p-3 text-sm">
        <span className="font-medium">Share of avoidable returns prevented: {rate}%</span>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="mt-2 block w-full max-w-md"
        />
      </label>
      <ScenarioStats s={s} />
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <div className="text-[13px] font-medium text-slate-600">
            Open tickets older than 48h at week end
          </div>
          <WeeklyLines
            data={s.weeks}
            xKey="week_end"
            series={[
              { key: "open_over_48h_actual", name: "Actual", color: 1 },
              {
                key: "open_over_48h_scenario",
                name: `With check (${rate}%)`,
                color: 2,
                dashed: true,
              },
            ]}
          />
        </div>
        <ReasonTable rows={s.by_reason} />
      </div>
      <ScenarioNotes assumptions={s.assumptions} />
    </Card>
  );
}
