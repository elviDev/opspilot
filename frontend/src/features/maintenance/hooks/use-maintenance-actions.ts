"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardKeys } from "@/features/dashboard/query-keys";
import { unwrapAction } from "@/lib/actions/action-result";
import { createMaintenanceWindow, deleteMaintenanceWindow } from "../actions";
import type { CreateMaintenanceWindowInput } from "../schemas";

export function useCreateMaintenanceWindow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["maintenance", "create"],
    mutationFn: (input: CreateMaintenanceWindowInput) =>
      unwrapAction(createMaintenanceWindow(input)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
  });
}

export function useDeleteMaintenanceWindow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["maintenance", "delete"],
    mutationFn: (id: number) => unwrapAction(deleteMaintenanceWindow(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
  });
}
