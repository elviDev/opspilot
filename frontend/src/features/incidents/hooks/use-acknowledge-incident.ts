"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardKeys } from "@/features/dashboard/query-keys";
import type { DashboardSnapshot } from "@/features/dashboard/schemas";
import { unwrapAction } from "@/lib/actions/action-result";
import { acknowledgeIncident } from "../actions";

export function useAcknowledgeIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["incidents", "acknowledge"],
    mutationFn: (incidentId: number) => unwrapAction(acknowledgeIncident(incidentId)),
    onSuccess: (acknowledgement) => {
      queryClient.setQueryData<DashboardSnapshot>(dashboardKeys.snapshot(), (snapshot) =>
        snapshot && {
          ...snapshot,
          incidents: snapshot.incidents.map((incident) =>
            incident.id === acknowledgement.incident_id
              ? { ...incident, acknowledged_at: acknowledgement.acknowledged_at }
              : incident,
          ),
        },
      );
      return queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}
