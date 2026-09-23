import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { backendFetch } from "@/lib/backend/client";
import { CHECK_HISTORY_LIMIT, checkListSchema, type Check } from "../schemas";

export const serviceChecksTag = (serviceId: number) => `service-checks:${serviceId}`;

/** Most recent checks for one service, newest first (backend order). */
export async function getServiceChecks(serviceId: number): Promise<Check[]> {
  "use cache";
  cacheLife("monitoring");
  cacheTag(serviceChecksTag(serviceId));

  return backendFetch(`/checks/${serviceId}?limit=${CHECK_HISTORY_LIMIT}`, checkListSchema);
}
