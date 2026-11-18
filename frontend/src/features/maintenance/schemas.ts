import { z } from "zod";

export const maintenanceWindowSchema = z.object({
  id: z.number().int(),
  service_id: z.number().int().nullable(),
  service_name: z.string().nullable().optional(),
  title: z.string(),
  starts_at: z.string(),
  ends_at: z.string(),
});

export const createMaintenanceWindowSchema = z
  .object({
    service_id: z.number().int().positive().nullable(),
    title: z.string().trim().min(1, "Enter a maintenance title").max(120),
    starts_at: z
      .string()
      .min(1, "Choose a start time")
      .refine((value) => !Number.isNaN(Date.parse(value)), "Choose a valid start time")
      .transform((value) => new Date(value).toISOString()),
    ends_at: z
      .string()
      .min(1, "Choose an end time")
      .refine((value) => !Number.isNaN(Date.parse(value)), "Choose a valid end time")
      .transform((value) => new Date(value).toISOString()),
  })
  .refine((value) => new Date(value.ends_at) > new Date(value.starts_at), {
    path: ["ends_at"],
    message: "End time must be after start time",
  })
  .refine((value) => new Date(value.ends_at) > new Date(), {
    path: ["ends_at"],
    message: "End time must be in the future",
  });

export const maintenanceWindowIdSchema = z.number().int().positive();

export type MaintenanceWindow = z.infer<typeof maintenanceWindowSchema>;
export type CreateMaintenanceWindowInput = z.input<typeof createMaintenanceWindowSchema>;
