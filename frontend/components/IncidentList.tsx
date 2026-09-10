import { Incident } from "@/lib/api";

export default function IncidentList({ incidents }: { incidents: Incident[] }) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 text-muted text-sm">
        No incidents recorded yet. Once a service goes down, it'll show up here with an AI-generated explanation.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {incidents.map((incident) => (
        <div key={incident.id} className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                incident.status === "open"
                  ? "bg-danger/20 text-danger"
                  : "bg-accent/20 text-accent"
              }`}
            >
              {incident.status === "open" ? "Ongoing" : "Resolved"}
            </span>
            <span className="text-xs text-muted">
              {new Date(incident.started_at).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-200 leading-relaxed">
            {incident.ai_summary || "AI summary not available yet."}
          </p>
        </div>
      ))}
    </div>
  );
}
