import "server-only";
import { dehydrate, type DehydratedState } from "@tanstack/react-query";
import { cache } from "react";
import { getQueryClient } from "@/lib/query/get-query-client";
import { checkKeys } from "../query-keys";
import { getServiceChecks } from "./get-service-checks";

/** Seeds the client cache with a service's checks. Never throws. */
export const prefetchServiceChecks = cache(async (serviceId: number): Promise<DehydratedState> => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: checkKeys.byService(serviceId),
    queryFn: () => getServiceChecks(serviceId),
  });
  return dehydrate(queryClient);
});
