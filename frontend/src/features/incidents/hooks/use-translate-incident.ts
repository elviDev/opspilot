"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LanguageCode } from "@/config/languages";
import { dashboardKeys } from "@/features/dashboard/query-keys";
import type { DashboardSnapshot } from "@/features/dashboard/schemas";
import { unwrapAction } from "@/lib/actions/action-result";
import { translateIncident } from "../actions";

type TranslateInput = { incidentId: number; language: LanguageCode };

export function useTranslateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["incidents", "translate"],
    mutationFn: (input: TranslateInput) => unwrapAction(translateIncident(input)),
    onSuccess: (updated) => {
      // Show the new summary immediately, then reconcile with the server.
      queryClient.setQueryData<DashboardSnapshot>(dashboardKeys.snapshot(), (snapshot) =>
        snapshot && {
          ...snapshot,
          incidents: snapshot.incidents.map((incident) =>
            incident.id === updated.id ? { ...incident, ai_summary: updated.ai_summary } : incident,
          ),
        },
      );
      return queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}
