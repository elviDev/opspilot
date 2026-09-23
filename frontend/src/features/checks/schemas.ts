import { z } from "zod";

export const checkSchema = z.object({
  id: z.number().int(),
  service_id: z.number().int(),
  status_code: z.number().int().nullable(),
  response_time_ms: z.number().nullable(),
  is_up: z.boolean(),
  checked_at: z.string(),
});

export const checkListSchema = z.array(checkSchema);

export type Check = z.infer<typeof checkSchema>;

/** How many recent checks the detail page charts. */
export const CHECK_HISTORY_LIMIT = 100;
