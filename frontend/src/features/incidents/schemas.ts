import { z } from "zod";

export const incidentStatusSchema = z.enum(["open", "resolved"]);

export const incidentSchema = z.object({
  id: z.number().int(),
  service_id: z.number().int(),
  started_at: z.string(),
  resolved_at: z.string().nullable(),
  ai_summary: z.string().nullable(),
  // Unknown statuses from the backend degrade to "open" rather than failing the whole payload.
  status: incidentStatusSchema.catch("open"),
});

export const incidentWithServiceSchema = incidentSchema.extend({
  service_name: z.string().nullable(),
});

export type IncidentStatus = z.infer<typeof incidentStatusSchema>;
export type Incident = z.infer<typeof incidentSchema>;
export type IncidentWithService = z.infer<typeof incidentWithServiceSchema>;
