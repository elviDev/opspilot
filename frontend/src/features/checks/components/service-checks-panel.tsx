"use client";

import { Activity, RotateCw } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/http/api-error";
import { cn } from "@/lib/utils/cn";
import { useServiceChecks } from "../hooks/use-service-checks";
import { ChecksTable } from "./checks-table";
import { ResponseTimeChart } from "./response-time-chart";

export function ServiceChecksPanel({ serviceId }: { serviceId: number }) {
  const { data: checks, error, isError, isFetching, refetch } = useServiceChecks(serviceId);

  if (checks === undefined) {
    if (!isError) return <Skeleton className="h-80 w-full rounded-xl" />;
    return (
      <Alert
        title="Couldn't load check history"
        action={
          <Button variant="secondary" size="sm" onClick={() => void refetch()} isLoading={isFetching}>
            {!isFetching && <RotateCw aria-hidden className="size-3.5" />}
            Retry
          </Button>
        }
      >
        {getErrorMessage(error)}
      </Alert>
    );
  }

  if (checks.length === 0) {
    return (
      <EmptyState icon={Activity} title="No checks yet">
        The first check runs on the next scheduled interval, usually within a minute.
      </EmptyState>
    );
  }

  return (
    // Refetches keep the previous render (dimmed) instead of flashing a skeleton.
    <div className={cn("flex flex-col gap-6 transition-opacity", isFetching && "opacity-80")}>
      <Card className="flex flex-col gap-4">
        <CardHeader>
          <CardTitle>Response time</CardTitle>
          <p className="text-xs text-muted">Last {checks.length} checks</p>
        </CardHeader>
        <ResponseTimeChart checks={checks} />
      </Card>
      <Card className="flex flex-col gap-2">
        <CardTitle>Recent checks</CardTitle>
        <ChecksTable checks={checks} />
      </Card>
    </div>
  );
}
