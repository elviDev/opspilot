import { ServerOff } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import type { ServiceWithUptime } from "../schemas";
import { ServiceCard } from "./service-card";

export function ServiceGrid({ services }: { services: ServiceWithUptime[] }) {
  if (services.length === 0) {
    return (
      <EmptyState icon={ServerOff} title="No services monitored yet">
        Add one through the API at <code className="text-accent">POST /services/</code> to get started.
      </EmptyState>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <li key={service.id}>
          <ServiceCard service={service} />
        </li>
      ))}
    </ul>
  );
}
