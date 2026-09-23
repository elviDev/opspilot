import { fetchJson } from "@/lib/http/fetch-json";
import { checkListSchema, type Check } from "../schemas";

export function fetchServiceChecks(serviceId: number, signal?: AbortSignal): Promise<Check[]> {
  return fetchJson(`/api/services/${serviceId}/checks`, checkListSchema, { signal });
}
