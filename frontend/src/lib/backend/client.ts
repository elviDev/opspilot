import "server-only";
import type { z } from "zod";
import { serverEnv } from "@/lib/env/server";
import { fetchJson, type FetchJsonInit } from "@/lib/http/fetch-json";

/**
 * Server-only gateway to the FastAPI backend. The browser never calls the
 * backend directly; it goes through Route Handlers that reuse this client.
 */
export function backendFetch<TSchema extends z.ZodType>(
  path: `/${string}`,
  schema: TSchema,
  init?: FetchJsonInit,
): Promise<z.output<TSchema>> {
  return fetchJson(`${serverEnv.API_URL}${path}`, schema, init);
}
