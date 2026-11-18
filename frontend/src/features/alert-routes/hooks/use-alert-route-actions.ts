"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardKeys } from "@/features/dashboard/query-keys";
import { unwrapAction } from "@/lib/actions/action-result";
import { createAlertRoute, deleteAlertRoute } from "../actions";
import type { CreateAlertRouteInput } from "../schemas";

export function useCreateAlertRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["alert-routes", "create"],
    mutationFn: (input: CreateAlertRouteInput) => unwrapAction(createAlertRoute(input)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
  });
}

export function useDeleteAlertRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["alert-routes", "delete"],
    mutationFn: (id: number) => unwrapAction(deleteAlertRoute(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
  });
}
