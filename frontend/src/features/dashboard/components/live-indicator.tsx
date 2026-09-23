"use client";

import { StatusDot } from "@/components/ui/status-dot";
import { DASHBOARD_POLL_INTERVAL_MS } from "../query-keys";
import { useDashboard } from "../hooks/use-dashboard";

const selectNothing = () => null;

export function LiveIndicator() {
  const { isError, isFetching } = useDashboard(selectNothing);
  const intervalSeconds = DASHBOARD_POLL_INTERVAL_MS / 1000;

  return (
    <p className="flex items-center gap-2 text-xs text-muted" aria-live="polite">
      <StatusDot
        tone={isError ? "warning" : "success"}
        label={isError ? "Connection issue" : "Live"}
        pulse={!isError}
      />
      {isError
        ? "Connection issue — showing last known data"
        : isFetching
          ? "Refreshing…"
          : `Live · refreshes every ${intervalSeconds}s`}
    </p>
  );
}
