"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const OPTIONS = { defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } };

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient(OPTIONS));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
