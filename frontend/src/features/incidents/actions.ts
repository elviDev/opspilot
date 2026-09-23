"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { languageSchema } from "@/config/languages";
import { runAuthorizedAction } from "@/features/auth/server/run-authorized-action";
import { DASHBOARD_CACHE_TAG } from "@/features/dashboard/server/get-dashboard";
import type { ActionResult } from "@/lib/actions/action-result";
import { backendFetch } from "@/lib/backend/client";
import { incidentSchema, type Incident } from "./schemas";

const translateIncidentSchema = z.object({
  incidentId: z.number().int().positive(),
  language: languageSchema,
});

/** The backend regenerates the summary with the LLM, which can take a while. */
const TRANSLATE_TIMEOUT_MS = 45_000;

/**
 * Regenerates an incident's AI summary in another language. The backend
 * stores the new summary, so every viewer sees the translated version.
 */
export async function translateIncident(input: unknown): Promise<ActionResult<Incident>> {
  return runAuthorizedAction(translateIncidentSchema, input, async ({ incidentId, language }) => {
    const incident = await backendFetch(
      `/incidents/${incidentId}/translate?language=${encodeURIComponent(language)}`,
      incidentSchema,
      { method: "POST", cache: "no-store", timeoutMs: TRANSLATE_TIMEOUT_MS },
    );
    updateTag(DASHBOARD_CACHE_TAG);
    return incident;
  });
}
