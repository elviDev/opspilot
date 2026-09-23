import type { Uptime } from "../schemas";

export type ServiceHealth = "healthy" | "degraded" | "unknown";

export const HEALTHY_UPTIME_THRESHOLD = 99;

export function getServiceHealth(uptime: Uptime | null): ServiceHealth {
  if (!uptime || uptime.total_checks === 0) return "unknown";
  return uptime.uptime_percent >= HEALTHY_UPTIME_THRESHOLD ? "healthy" : "degraded";
}

export const healthPresentation = {
  healthy: { tone: "success", label: "Healthy" },
  degraded: { tone: "danger", label: "Degraded" },
  unknown: { tone: "neutral", label: "No data yet" },
} as const satisfies Record<ServiceHealth, { tone: string; label: string }>;
