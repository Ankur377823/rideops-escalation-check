"use client";

import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { api } from "@/lib/api";
import type { Mode } from "@/lib/types/check";

const subscribe = () => () => {};

/** The current check mode. Undefined while it is loading.
 *  It also stays undefined for the first browser render, so that render matches
 *  the HTML from the server even when the mode is already in the cache. */
export function useMode() {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const { data } = useQuery({
    queryKey: ["mode"],
    queryFn: () => api<{ mode: Mode }>("/settings/mode"),
  });
  return hydrated ? data?.mode : undefined;
}
