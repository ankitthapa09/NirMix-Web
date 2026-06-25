"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes stale time
            refetchOnWindowFocus: false, // Prevents refetching on switching browser tabs
          },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
