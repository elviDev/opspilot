"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "../api/fetch-dashboard";
import { DASHBOARD_POLL_INTERVAL_MS, dashboardKeys } from "../query-keys";
import type { DashboardSnapshot } from "../schemas";

/**
 * Live dashboard data. Hydrated from the server prefetch, then kept fresh by
 * polling (paused while the tab is hidden) and refetching on window focus.
 * `select` lets each consumer subscribe to just its slice, so a section only
 * re-renders when its own data changes.
 */
export function useDashboard<TData = DashboardSnapshot>(select?: (snapshot: DashboardSnapshot) => TData) {
  return useQuery({
    queryKey: dashboardKeys.snapshot(),
    queryFn: ({ signal }) => fetchDashboard(signal),
    select,
    refetchInterval: DASHBOARD_POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}
