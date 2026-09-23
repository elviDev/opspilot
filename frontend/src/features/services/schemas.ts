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

export type Service = z.infer<typeof serviceSchema>;
export type Uptime = z.infer<typeof uptimeSchema>;
export type ServiceWithUptime = z.infer<typeof serviceWithUptimeSchema>;
