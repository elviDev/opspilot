import { z } from "zod";
import { alertRouteSchema } from "@/features/alert-routes/schemas";
import { incidentWithServiceSchema } from "@/features/incidents/schemas";
import { serviceWithUptimeSchema } from "@/features/services/schemas";

/** The aggregated view the dashboard renders, served by `/api/dashboard`. */
export const dashboardSnapshotSchema = z.object({
  services: z.array(serviceWithUptimeSchema),
  incidents: z.array(incidentWithServiceSchema),
  alert_routes: z.array(alertRouteSchema),
});

export type DashboardSnapshot = z.infer<typeof dashboardSnapshotSchema>;
