import { formatPercent } from "@/lib/utils/format";
import type { Uptime } from "../schemas";

export type ServiceHealth = "healthy" | "degraded" | "unknown";

export const HEALTHY_UPTIME_THRESHOLD = 99;

export function getServiceHealth(uptime: Uptime | null): ServiceHealth {
  if (!uptime || uptime.total_checks === 0) return "unknown";
  return uptime.uptime_percent >= HEALTHY_UPTIME_THRESHOLD ? "healthy" : "degraded";
}

/** Uptime as display text. The backend reports 100% before any check has run, which would be misleading. */
export function formatUptime(uptime: Uptime | null): string {
  return uptime && uptime.total_checks > 0 ? formatPercent(uptime.uptime_percent) : "—";
}

export const healthPresentation = {
  healthy: { tone: "success", label: "Healthy" },
  degraded: { tone: "danger", label: "Degraded" },
  unknown: { tone: "neutral", label: "No data yet" },
} as const satisfies Record<ServiceHealth, { tone: string; label: string }>;
