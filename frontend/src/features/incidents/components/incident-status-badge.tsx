import { Badge } from "@/components/ui/badge";
import type { IncidentStatus } from "../schemas";

const presentation = {
  open: { tone: "danger", label: "Ongoing" },
  resolved: { tone: "success", label: "Resolved" },
} as const satisfies Record<IncidentStatus, unknown>;

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  const { tone, label } = presentation[status];
  return <Badge tone={tone}>{label}</Badge>;
}
