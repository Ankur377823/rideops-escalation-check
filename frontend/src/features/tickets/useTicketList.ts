"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import type { TicketList } from "@/lib/types/ticket";

export const PAGE_SIZE = 10;

export type TicketFilterState = {
  q: string;
  category: string;
  agent: string;
  priority: string;
  openOnly: boolean;
};

const START: TicketFilterState = { q: "", category: "", agent: "", priority: "", openOnly: true };

function toQuery(filters: TicketFilterState, page: number) {
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    offset: String(page * PAGE_SIZE),
  });
  if (filters.openOnly) params.set("open_only", "true");
  if (filters.category) params.set("category", filters.category);
  if (filters.agent) params.set("agent", filters.agent);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.q.trim()) params.set("q", filters.q.trim());
  return params.toString();
}

export function useTicketList() {
  const [filters, setFilters] = useState(START);
  const [page, setPage] = useState(0);
  const query = toQuery(filters, page);
  const tickets = useQuery({
    queryKey: ["tickets", query],
    queryFn: () => api<TicketList>(`/tickets?${query}`),
    placeholderData: keepPreviousData,
  });
  /** Changing a filter always returns to the first page. */
  const update = (change: Partial<TicketFilterState>) => {
    setFilters((current) => ({ ...current, ...change }));
    setPage(0);
  };
  const total = tickets.data?.total ?? 0;
  return {
    filters,
    update,
    page,
    setPage,
    tickets,
    total,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}
