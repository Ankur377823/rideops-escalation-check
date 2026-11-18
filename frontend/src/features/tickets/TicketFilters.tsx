"use client";

import { useQuery } from "@tanstack/react-query";
import { FIELD } from "@/components/ui";
import { api } from "@/lib/api";
import type { FilterOptions } from "@/lib/types/ticket";
import type { TicketFilterState } from "./useTicketList";

type SelectProps = {
  label: string;
  all: string;
  value: string;
  options?: string[];
  onChange: (value: string) => void;
};

function Select({ label, all, value, options = [], onChange }: SelectProps) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${FIELD} max-w-full`}
    >
      <option value="">{all}</option>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

type Props = {
  filters: TicketFilterState;
  update: (change: Partial<TicketFilterState>) => void;
  total: number;
};

export function TicketFilters({ filters, update, total }: Props) {
  const { data } = useQuery({
    queryKey: ["filters"],
    queryFn: () => api<FilterOptions>("/filters"),
  });
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
      <input
        type="search"
        value={filters.q}
        onChange={(e) => update({ q: e.target.value })}
        placeholder="Search ID, client or issue"
        aria-label="Search tickets"
        className={`${FIELD} w-full sm:w-60`}
      />
      <Select
        label="Category"
        all="All categories"
        value={filters.category}
        options={data?.category}
        onChange={(category) => update({ category })}
      />
      <Select
        label="Agent"
        all="All agents"
        value={filters.agent}
        options={data?.assigned_agent}
        onChange={(agent) => update({ agent })}
      />
      <Select
        label="Priority"
        all="All priorities"
        value={filters.priority}
        options={data?.priority}
        onChange={(priority) => update({ priority })}
      />
      <label className="flex items-center gap-2 px-1 text-sm text-slate-700">
        <input
          type="checkbox"
          className="size-4"
          checked={filters.openOnly}
          onChange={(e) => update({ openOnly: e.target.checked })}
        />
        Open only
      </label>
      <span className="ml-auto text-sm font-medium text-slate-600">
        {total.toLocaleString()} tickets
      </span>
    </div>
  );
}
