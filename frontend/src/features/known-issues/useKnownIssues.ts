"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, patch, post } from "@/lib/api";
import type { KnownIssue } from "@/lib/types/check";

export type NewIssue = { title: string; category: string; workaround: string | null };

export function useKnownIssues() {
  const queryClient = useQueryClient();
  /** The board also appears on the check screen, so refresh both. */
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["known-issues"] });
    queryClient.invalidateQueries({ queryKey: ["check"] });
  };
  const issues = useQuery({
    queryKey: ["known-issues"],
    queryFn: () => api<KnownIssue[]>("/known-issues"),
  });
  const add = useMutation({
    mutationFn: (issue: NewIssue) => post("/known-issues", issue),
    onSuccess: refresh,
  });
  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      patch(`/known-issues/${id}`, { status }),
    onSuccess: refresh,
  });
  return { issues, add, setStatus };
}

export type KnownIssuesState = ReturnType<typeof useKnownIssues>;
