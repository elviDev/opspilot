"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { StatusDot } from "@/components/ui/status-dot";
import { formatMs } from "@/lib/utils/format";
import { formatUptime, getServiceHealth, healthPresentation } from "../lib/health";
import type { ServiceWithUptime } from "../schemas";
import { DeleteServiceButton } from "./delete-service-button";

export function ServiceCard({ service }: { service: ServiceWithUptime }) {
  const { uptime } = service;
  const health = healthPresentation[getServiceHealth(uptime)];

  return (
    <Card className="flex flex-col gap-3">
      <CardHeader>
        <CardTitle className="min-w-0 truncate">
          <Link href={`/services/${service.id}`} className="hover:text-accent hover:underline">
            {service.name}
          </Link>
        </CardTitle>
        <div className="flex shrink-0 items-center gap-1">
          <StatusDot tone={health.tone} label={health.label} pulse={health.tone !== "neutral"} className="mr-1" />
          <DeleteServiceButton service={service} />
        </div>
      </CardHeader>
      <a
        href={service.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="truncate text-sm text-muted hover:text-foreground hover:underline"
      >
        {service.url}
      </a>
      <dl className="mt-2 flex items-end justify-between">
        <Stat value={formatUptime(uptime)} label="uptime" />
        <Stat
          value={formatMs(uptime?.avg_response_time_ms ?? null)}
          label="avg response"
          emphasis="secondary"
          align="end"
        />
      </dl>
    </Card>
  );
}
