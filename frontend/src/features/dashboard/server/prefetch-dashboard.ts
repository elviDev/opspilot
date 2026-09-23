import "server-only";
import { dehydrate, type DehydratedState } from "@tanstack/react-query";
import { cache } from "react";
import { getQueryClient } from "@/lib/query/get-query-client";
import { dashboardKeys } from "../query-keys";
import { getDashboard } from "./get-dashboard";

/**
 * Prefetches the dashboard into a server QueryClient and returns its
 * dehydrated state. Memoized per request so every section shares one fetch.
 * prefetchQuery never throws: on failure the client simply fetches itself.
 */
export const prefetchDashboard = cache(async (): Promise<DehydratedState> => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: dashboardKeys.snapshot(),
    queryFn: getDashboard,
  });
  return dehydrate(queryClient);
});
