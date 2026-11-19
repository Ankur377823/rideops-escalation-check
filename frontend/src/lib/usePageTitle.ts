"use client";

import { useEffect } from "react";

/** Sets the browser tab title, for example "Dashboard · Escalation Check". */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · Escalation Check`;
  }, [title]);
}
