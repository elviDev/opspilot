"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { runAuthorizedAction } from "@/features/auth/server/run-authorized-action";
import { serviceChecksTag } from "@/features/checks/server/get-service-checks";
import { DASHBOARD_CACHE_TAG } from "@/features/dashboard/server/get-dashboard";
import type { ActionResult } from "@/lib/actions/action-result";
import { backendFetch } from "@/lib/backend/client";
import { createServiceSchema, serviceIdSchema, serviceSchema, type Service } from "./schemas";

export async function createService(input: unknown): Promise<ActionResult<Service>> {
  return runAuthorizedAction(createServiceSchema, input, async (data) => {
    const service = await backendFetch("/services/", serviceSchema, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    updateTag(DASHBOARD_CACHE_TAG);
    return service;
  });
}

export async function deleteService(serviceId: unknown): Promise<ActionResult<{ id: number }>> {
  return runAuthorizedAction(serviceIdSchema, serviceId, async (id) => {
    await backendFetch(`/services/${id}`, z.object({ ok: z.boolean() }), {
      method: "DELETE",
      cache: "no-store",
    });
    updateTag(DASHBOARD_CACHE_TAG);
    updateTag(serviceChecksTag(id));
    return { id };
  });
}
