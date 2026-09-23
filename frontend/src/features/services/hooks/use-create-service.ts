"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardKeys } from "@/features/dashboard/query-keys";
import { unwrapAction } from "@/lib/actions/action-result";
import { createService } from "../actions";
import type { CreateServiceInput } from "../schemas";

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["services", "create"],
    mutationFn: (input: CreateServiceInput) => unwrapAction(createService(input)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
  });
}
