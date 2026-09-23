import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { incidentSchema, type IncidentWithService } from "@/features/incidents/schemas";
import { serviceSchema, uptimeSchema, type ServiceWithUptime, type Uptime } from "@/features/services/schemas";
import { backendFetch } from "@/lib/backend/client";
import type { DashboardSnapshot } from "../schemas";

export const DASHBOARD_CACHE_TAG = "dashboard";

async function getUptimeSafely(serviceId: number): Promise<Uptime | null> {
  try {
    return await backendFetch(`/checks/${serviceId}/uptime`, uptimeSchema);
  } catch {
    // One service's stats failing shouldn't take down the whole dashboard.
    return null;
  }
}

/**
 * Aggregates everything the dashboard needs in parallel and caches it on the
 * server, so concurrent viewers share one set of backend calls per window.
 * Errors are thrown (never cached) so the next request retries.
 */
export async function getDashboard(): Promise<DashboardSnapshot> {
  "use cache";
  cacheLife("monitoring");
  cacheTag(DASHBOARD_CACHE_TAG);

  const [services, incidents] = await Promise.all([
    backendFetch("/services/", z.array(serviceSchema)),
    backendFetch("/incidents/", z.array(incidentSchema)),
  ]);

  const uptimes = await Promise.all(services.map((service) => getUptimeSafely(service.id)));

  const servicesWithUptime: ServiceWithUptime[] = services.map((service, index) => ({
    ...service,
    uptime: uptimes[index] ?? null,
  }));

  const serviceNames = new Map(services.map((service) => [service.id, service.name]));
  const incidentsWithService: IncidentWithService[] = incidents.map((incident) => ({
    ...incident,
    service_name: serviceNames.get(incident.service_id) ?? null,
  }));

  return { services: servicesWithUptime, incidents: incidentsWithService };
}
