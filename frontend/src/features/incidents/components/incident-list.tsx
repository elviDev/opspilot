import { ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import type { IncidentWithService } from "../schemas";
import { IncidentCard } from "./incident-card";

export function IncidentList({ incidents }: { incidents: IncidentWithService[] }) {
  if (incidents.length === 0) {
    return (
      <EmptyState icon={ShieldCheck} title="No incidents recorded">
        When a service goes down, it shows up here with an AI-generated explanation.
      </EmptyState>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {incidents.map((incident) => (
        <li key={incident.id}>
          <IncidentCard incident={incident} />
        </li>
      ))}
    </ol>
  );
}
