import { z } from "zod";

export const serviceSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  url: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
});

export const uptimeSchema = z.object({
  service_id: z.number().int(),
  uptime_percent: z.number(),
  avg_response_time_ms: z.number().nullable(),
  total_checks: z.number().int(),
});

export const serviceWithUptimeSchema = serviceSchema.extend({
  uptime: uptimeSchema.nullable(),
});

/** Route params and action inputs arrive as untrusted strings/unknowns. */
export const serviceIdSchema = z.coerce.number().int().positive();

export const SERVICE_NAME_MAX_LENGTH = 80;

export const createServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Give the service a name")
    .max(SERVICE_NAME_MAX_LENGTH, `Keep the name under ${SERVICE_NAME_MAX_LENGTH} characters`),
  url: z
    .string()
    .trim()
    .min(1, "Enter the URL to monitor")
    .pipe(z.url({ protocol: /^https?$/, error: "Enter a full URL starting with http:// or https://" })),
});

export type Service = z.infer<typeof serviceSchema>;
export type CreateServiceInput = z.input<typeof createServiceSchema>;
export type Uptime = z.infer<typeof uptimeSchema>;
export type ServiceWithUptime = z.infer<typeof serviceWithUptimeSchema>;
