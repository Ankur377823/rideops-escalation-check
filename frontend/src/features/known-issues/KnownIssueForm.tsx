"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Card, FIELD } from "@/components/ui";
import { api } from "@/lib/api";
import type { FilterOptions } from "@/lib/types/ticket";
import type { KnownIssuesState } from "./useKnownIssues";

export function KnownIssueForm({ add }: { add: KnownIssuesState["add"] }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [workaround, setWorkaround] = useState("");
  const { data } = useQuery({
    queryKey: ["filters"],
    queryFn: () => api<FilterOptions>("/filters"),
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (title.trim().length < 3 || !category) return;
    add.mutate(
      { title, category, workaround: workaround || null },
      { onSuccess: () => (setTitle(""), setWorkaround("")) },
    );
  };

  return (
    <Card
      title="Add a known issue"
      hint="It appears on the check screen for tickets in the same category."
    >
      <form className="flex flex-wrap items-end gap-2" onSubmit={submit}>
        <label className="text-sm font-medium text-slate-700">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${FIELD} mt-1 block w-72 max-w-full`}
            required
            minLength={3}
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${FIELD} mt-1 block`}
            required
          >
            <option value="">Choose…</option>
            {data?.category.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">
          Workaround (optional)
          <input
            value={workaround}
            onChange={(e) => setWorkaround(e.target.value)}
            className={`${FIELD} mt-1 block w-72 max-w-full`}
          />
        </label>
        <Button variant="primary" disabled={add.isPending}>
          Add issue
        </Button>
      </form>
      {add.isError && (
        <p className="mt-2 text-sm text-red-700">Could not add the issue. Try again.</p>
      )}
    </Card>
  );
}
