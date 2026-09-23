export const dashboardKeys = {
  all: ["dashboard"] as const,
  snapshot: () => [...dashboardKeys.all, "snapshot"] as const,
};

/** How often the client polls for fresh monitoring data. */
export const DASHBOARD_POLL_INTERVAL_MS = 30_000;
