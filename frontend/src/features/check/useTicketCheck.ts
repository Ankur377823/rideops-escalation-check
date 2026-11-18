"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api, post } from "@/lib/api";
import type { Action, Answers, Check, DecisionResult, HandoffNote } from "@/lib/types/check";

/** Everything the check screen needs: the check itself, the agent's answers,
 *  the handoff note and the decision. */
export function useTicketCheck(id: string) {
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Answers>({});
  const [note, setNote] = useState<HandoffNote | null>(null);

  const check = useQuery({
    queryKey: ["check", id],
    queryFn: () => api<Check>(`/tickets/${id}/check`),
  });
  const makeNote = useMutation({
    mutationFn: () => post<HandoffNote>(`/tickets/${id}/handoff-note`, { answers }),
    onSuccess: setNote,
  });
  const decide = useMutation({
    mutationFn: (action: Action) =>
      post<DecisionResult>(`/tickets/${id}/decision`, { action, answers }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["decisions"] }),
  });

  /** A changed answer makes the old note and decision message stale. */
  const setAnswer = (key: string, value: string | boolean) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setNote(null);
    decide.reset();
  };

  return { check, answers, setAnswer, note, makeNote, decide };
}

export type TicketCheckState = ReturnType<typeof useTicketCheck>;
