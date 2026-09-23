"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchServiceChecks } from "../api/fetch-service-checks";
import { CHECKS_POLL_INTERVAL_MS, checkKeys } from "../query-keys";

export function useServiceChecks(serviceId: number) {
  return useQuery({
    queryKey: checkKeys.byService(serviceId),
    queryFn: ({ signal }) => fetchServiceChecks(serviceId, signal),
    refetchInterval: CHECKS_POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}
