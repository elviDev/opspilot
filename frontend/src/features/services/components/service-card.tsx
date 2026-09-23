import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusDot } from "@/components/ui/status-dot";
import { cn } from "@/lib/utils/cn";
import { formatMs, formatPercent } from "@/lib/utils/format";
import { getServiceHealth, healthPresentation } from "../lib/health";
import type { ServiceWithUptime } from "../schemas";

type MetricProps = {
  value: string;
  label: string;
  emphasis?: "primary" | "secondary";
};

function Metric({ value, label, emphasis = "primary" }: MetricProps) {
  // dt precedes dd in the DOM for assistive tech; flex-col-reverse puts the value on top visually.
  return (
    <div className={cn("flex flex-col-reverse", emphasis === "secondary" && "items-end")}>
      <dt className="text-xs text-muted">{label}</dt>
      <dd
        className={cn(
          "text-foreground tabular-nums",
          emphasis === "primary" ? "text-2xl font-semibold" : "text-lg font-medium",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

export function ServiceCard({ service }: { service: ServiceWithUptime }) {
  const { uptime } = service;
  const health = healthPresentation[getServiceHealth(uptime)];

  return (
    <Card className="flex flex-col gap-3">
      <CardHeader>
        <CardTitle className="truncate">{service.name}</CardTitle>
        <StatusDot tone={health.tone} label={health.label} pulse={health.tone !== "neutral"} />
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
        <Metric value={uptime ? formatPercent(uptime.uptime_percent) : "—"} label="uptime" />
        <Metric value={formatMs(uptime?.avg_response_time_ms ?? null)} label="avg response" emphasis="secondary" />
      </dl>
    </Card>
  );
}
