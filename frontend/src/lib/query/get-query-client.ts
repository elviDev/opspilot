import { isServer, QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/http/api-error";

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Server-prefetched data stays fresh long enough to skip an
        // immediate refetch right after hydration.
        staleTime: 15_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: true,
        retry: (failureCount, error) => {
          // Client errors (auth, validation) won't fix themselves on retry.
          if (ApiError.isApiError(error) && error.status >= 400 && error.status < 500) return false;
          return failureCount < 2;
        },
      },
      mutations: { retry: false },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * A fresh client per server render (no data shared between users), and a
 * single long-lived client in the browser.
 */
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
