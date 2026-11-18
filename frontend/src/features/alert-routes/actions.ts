"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { runAuthorizedAction } from "@/features/auth/server/run-authorized-action";
import { DASHBOARD_CACHE_TAG } from "@/features/dashboard/server/get-dashboard";
import type { ActionResult } from "@/lib/actions/action-result";
import { backendFetch } from "@/lib/backend/client";
import {
  alertRouteIdSchema,
  alertRouteSchema,
  createAlertRouteSchema,
  type AlertRoute,
} from "./schemas";

export async function createAlertRoute(input: unknown): Promise<ActionResult<AlertRoute>> {
  return runAuthorizedAction(createAlertRouteSchema, input, async (data) => {
    const route = await backendFetch("/alerts/routes/", alertRouteSchema, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    updateTag(DASHBOARD_CACHE_TAG);
    return route;
  });
}

export async function deleteAlertRoute(input: unknown): Promise<ActionResult<{ id: number }>> {
  return runAuthorizedAction(alertRouteIdSchema, input, async (id) => {
    await backendFetch(`/alerts/routes/${id}`, z.object({ ok: z.boolean() }), {
      method: "DELETE",
      cache: "no-store",
    });
    updateTag(DASHBOARD_CACHE_TAG);
    return { id };
  });
}
