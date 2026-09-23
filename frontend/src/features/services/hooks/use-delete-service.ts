"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkKeys } from "@/features/checks/query-keys";
import { dashboardKeys } from "@/features/dashboard/query-keys";
import type { DashboardSnapshot } from "@/features/dashboard/schemas";
import { unwrapAction } from "@/lib/actions/action-result";
import { deleteService } from "../actions";

type UseDeleteServiceOptions = {
  onDeleted?: (serviceId: number) => void;
};

/**
 * Not optimistic on purpose: the confirm dialog stays open (and can show an
 * error) until the backend confirms. On success the service and its incidents
 * are dropped from the cache immediately, then reconciled with the server.
 * `onDeleted` runs at the hook level so it fires even when the triggering
 * component unmounts as a result of the cache update.
 */
export function useDeleteService({ onDeleted }: UseDeleteServiceOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["services", "delete"],
    mutationFn: (serviceId: number) => unwrapAction(deleteService(serviceId)),
    onSuccess: ({ id }) => {
      onDeleted?.(id);
      queryClient.setQueryData<DashboardSnapshot>(dashboardKeys.snapshot(), (snapshot) =>
        snapshot && {
          services: snapshot.services.filter((service) => service.id !== id),
          incidents: snapshot.incidents.filter((incident) => incident.service_id !== id),
        },
      );
      queryClient.removeQueries({ queryKey: checkKeys.byService(id) });
      return queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}
