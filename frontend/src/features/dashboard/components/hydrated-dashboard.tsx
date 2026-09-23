import { HydrationBoundary } from "@tanstack/react-query";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { requireViewer } from "@/features/auth/server/dal";
import { prefetchDashboard } from "../server/prefetch-dashboard";

/**
 * Server boundary for live dashboard sections: verifies the session, then
 * seeds the client cache so the first paint has data without a round trip.
 * Reads the request, so render it inside <Suspense>.
 */
export async function HydratedDashboard({ children }: { children: ReactNode }) {
  // Monitoring data is always request-time; never bake it into the build output.
  await connection();
  await requireViewer();
  const state = await prefetchDashboard();
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
