"use client";

import { IncidentList } from "@/features/incidents/components/incident-list";
import { AlertRoutesPanel } from "@/features/alert-routes/components/alert-routes-panel";
import { MaintenancePanel } from "@/features/maintenance/components/maintenance-panel";
import { ServiceGrid } from "@/features/services/components/service-grid";
import type { DashboardSnapshot } from "../schemas";
import { DashboardQueryState } from "./dashboard-query-state";
import { IncidentListSkeleton, ServiceGridSkeleton } from "./skeletons";

const selectServices = (snapshot: DashboardSnapshot) => snapshot.services;
const selectIncidents = (snapshot: DashboardSnapshot) => snapshot.incidents;
const selectMaintenance = (snapshot: DashboardSnapshot) => ({
  windows: snapshot.maintenance_windows,
  services: snapshot.services,
});
const selectAlertRoutes = (snapshot: DashboardSnapshot) => snapshot.alert_routes;

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

export function LiveMaintenance() {
  return (
    <DashboardQueryState select={selectMaintenance} fallback={null}>
      {({ windows, services }) => <MaintenancePanel windows={windows} services={services} />}
    </DashboardQueryState>
  );
}

export function LiveAlertRoutes() {
  return (
    <DashboardQueryState select={selectAlertRoutes} fallback={null}>
      {(routes) => <AlertRoutesPanel routes={routes} />}
    </DashboardQueryState>
  );
}
