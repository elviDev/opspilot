"use client";

import { RotateCw } from "lucide-react";
import type { ReactNode } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/http/api-error";
import { useDashboard } from "../hooks/use-dashboard";
import type { DashboardSnapshot } from "../schemas";

type DashboardQueryStateProps<T> = {
  select: (snapshot: DashboardSnapshot) => T;
  fallback: ReactNode;
  children: (data: T) => ReactNode;
};

/**
 * Single place that maps the dashboard query's loading/error states to UI,
 * so sections only describe how to render their data.
 */
export function DashboardQueryState<T>({ select, fallback, children }: DashboardQueryStateProps<T>) {
  const { data, error, isError, isFetching, refetch } = useDashboard(select);

  if (data === undefined) {
    if (!isError) return fallback;
    return (
      <Alert
        title="Couldn't load monitoring data"
        action={
          <Button variant="secondary" size="sm" onClick={() => void refetch()} isLoading={isFetching}>
            {!isFetching && <RotateCw aria-hidden className="size-3.5" />}
            Retry
          </Button>
        }
      >
        {getErrorMessage(error, "The monitoring API is unreachable.")}
      </Alert>
    );
  }

  return children(data);
}
