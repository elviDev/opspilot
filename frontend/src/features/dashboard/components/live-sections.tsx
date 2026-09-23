"use client";

import { IncidentList } from "@/features/incidents/components/incident-list";
import { ServiceGrid } from "@/features/services/components/service-grid";
import type { DashboardSnapshot } from "../schemas";
import { DashboardQueryState } from "./dashboard-query-state";
import { IncidentListSkeleton, ServiceGridSkeleton } from "./skeletons";

const selectServices = (snapshot: DashboardSnapshot) => snapshot.services;
const selectIncidents = (snapshot: DashboardSnapshot) => snapshot.incidents;

export function LiveServices() {
  return (
    <DashboardQueryState select={selectServices} fallback={<ServiceGridSkeleton />}>
      {(services) => <ServiceGrid services={services} />}
    </DashboardQueryState>
  );
}

export function LiveIncidents() {
  return (
    <DashboardQueryState select={selectIncidents} fallback={<IncidentListSkeleton />}>
      {(incidents) => <IncidentList incidents={incidents} />}
    </DashboardQueryState>
  );
}
