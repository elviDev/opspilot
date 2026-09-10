import { Service, Uptime } from "@/lib/api";

export default function StatusCard({ service, uptime }: { service: Service; uptime: Uptime | null }) {
  const isHealthy = (uptime?.uptime_percent ?? 100) >= 99;

  return (
    <div className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-white">{service.name}</h3>
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isHealthy ? "bg-accent" : "bg-danger"
          } animate-pulse`}
        />
      </div>
      <p className="text-sm text-muted truncate">{service.url}</p>
      <div className="flex items-end justify-between mt-2">
        <div>
          <p className="text-2xl font-semibold text-white">
            {uptime ? `${uptime.uptime_percent}%` : "—"}
          </p>
          <p className="text-xs text-muted">uptime</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium text-white">
            {uptime?.avg_response_time_ms ? `${Math.round(uptime.avg_response_time_ms)}ms` : "—"}
          </p>
          <p className="text-xs text-muted">avg response</p>
        </div>
      </div>
    </div>
  );
}
