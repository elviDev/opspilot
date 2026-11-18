"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { runAuthorizedAction } from "@/features/auth/server/run-authorized-action";
import { DASHBOARD_CACHE_TAG } from "@/features/dashboard/server/get-dashboard";
import type { ActionResult } from "@/lib/actions/action-result";
import { backendFetch } from "@/lib/backend/client";
import {
  createMaintenanceWindowSchema,
  maintenanceWindowIdSchema,
  maintenanceWindowSchema,
  type MaintenanceWindow,
} from "./schemas";

export async function createMaintenanceWindow(
  input: unknown,
): Promise<ActionResult<MaintenanceWindow>> {
  return runAuthorizedAction(createMaintenanceWindowSchema, input, async (data) => {
    const window = await backendFetch("/maintenance/", maintenanceWindowSchema, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    updateTag(DASHBOARD_CACHE_TAG);
    return window;
  });
}

export async function deleteMaintenanceWindow(
  input: unknown,
): Promise<ActionResult<{ id: number }>> {
  return runAuthorizedAction(maintenanceWindowIdSchema, input, async (id) => {
    await backendFetch(`/maintenance/${id}`, z.object({ ok: z.boolean() }), {
      method: "DELETE",
      cache: "no-store",
    });
    updateTag(DASHBOARD_CACHE_TAG);
    return { id };
  });
}
