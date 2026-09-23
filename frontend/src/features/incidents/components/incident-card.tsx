import { Card } from "@/components/ui/card";
import { LocalTime } from "@/components/ui/local-time";
import { formatDuration } from "@/lib/utils/format";
import type { IncidentWithService } from "../schemas";
import { IncidentStatusBadge } from "./incident-status-badge";
import { TranslateIncident } from "./translate-incident";

export function IncidentCard({ incident }: { incident: IncidentWithService }) {
  return (
    <Card>
      <article aria-labelledby={`incident-${incident.id}-title`} className="flex flex-col gap-2">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <IncidentStatusBadge status={incident.status} />
            <h3 id={`incident-${incident.id}-title`} className="text-sm font-medium text-foreground">
              {incident.service_name ?? `Service #${incident.service_id}`}
            </h3>
          </div>
          <p className="text-xs text-muted">
            <LocalTime iso={incident.started_at} />
            {incident.resolved_at && (
              <> · lasted {formatDuration(incident.started_at, incident.resolved_at)}</>
            )}
          </p>
        </header>
        <p className="text-sm leading-relaxed text-foreground/85">
          {incident.ai_summary || "AI summary not available yet."}
        </p>
        <footer className="mt-1 border-t border-border pt-3">
          <TranslateIncident incidentId={incident.id} />
        </footer>
      </article>
    </Card>
  );
}
