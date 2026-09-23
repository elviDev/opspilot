"use client";

import { ServerOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Stat } from "@/components/ui/stat";
import { StatusDot } from "@/components/ui/status-dot";
import { ServiceChecksPanel } from "@/features/checks/components/service-checks-panel";
import { DashboardQueryState } from "@/features/dashboard/components/dashboard-query-state";
import type { DashboardSnapshot } from "@/features/dashboard/schemas";
import { formatMs } from "@/lib/utils/format";
import { formatUptime, getServiceHealth, healthPresentation } from "../lib/health";
import type { ServiceWithUptime } from "../schemas";
import { DeleteServiceButton } from "./delete-service-button";

function ServiceHeader({ service }: { service: ServiceWithUptime }) {
  const router = useRouter();
  const health = healthPresentation[getServiceHealth(service.uptime)];
  const { uptime } = service;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="truncate text-2xl font-semibold text-foreground">{service.name}</h1>
            <StatusDot tone={health.tone} label={health.label} pulse={health.tone !== "neutral"} />
            <span className="text-sm text-muted">{health.label}</span>
          </div>
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="mt-1 block truncate text-sm text-muted hover:text-foreground hover:underline"
          >
            {service.url}
          </a>
        </div>
        <DeleteServiceButton service={service} variant="full" onDeleted={() => router.replace("/")} />
      </div>
      <dl className="grid grid-cols-3 gap-4 rounded-xl border border-border bg-surface p-5">
        <Stat value={formatUptime(uptime)} label="uptime" />
        <Stat value={formatMs(uptime?.avg_response_time_ms ?? null)} label="avg response" />
        <Stat value={uptime ? uptime.total_checks.toLocaleString() : "—"} label="total checks" />
      </dl>
    </div>
  );
}

function ServiceNotFound() {
  return (
    <EmptyState
      icon={ServerOff}
      title="This service isn't monitored anymore"
      action={
        <Link href="/" className="text-sm font-medium text-accent hover:underline">
          Back to the dashboard
        </Link>
      }
    >
      It may have been deleted.
    </EmptyState>
  );
}

export function ServiceDetail({ serviceId }: { serviceId: number }) {
  const selectService = useCallback(
    (snapshot: DashboardSnapshot) => snapshot.services.find((service) => service.id === serviceId) ?? null,
    [serviceId],
  );

  return (
    <DashboardQueryState select={selectService} fallback={<Skeleton className="h-40 w-full rounded-xl" />}>
      {(service) =>
        service ? (
          <div className="flex flex-col gap-6">
            <ServiceHeader service={service} />
            <ServiceChecksPanel serviceId={serviceId} />
          </div>
        ) : (
          <ServiceNotFound />
        )
      }
    </DashboardQueryState>
  );
}
