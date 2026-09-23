import { fetchJson } from "@/lib/http/fetch-json";
import { dashboardSnapshotSchema, type DashboardSnapshot } from "../schemas";

export function fetchDashboard(signal?: AbortSignal): Promise<DashboardSnapshot> {
  return fetchJson("/api/dashboard", dashboardSnapshotSchema, { signal });
}
