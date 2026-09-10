import { getServices, getIncidents, getUptime } from "@/lib/api";
import StatusCard from "@/components/StatusCard";
import IncidentList from "@/components/IncidentList";
import ChatBox from "@/components/ChatBox";

export default async function DashboardPage() {
  let services = [];
  let incidents = [];
  let uptimes: Record<number, any> = {};

  try {
    services = await getServices();
    incidents = await getIncidents();
    const uptimeResults = await Promise.all(services.map((s) => getUptime(s.id)));
    uptimeResults.forEach((u) => (uptimes[u.service_id] = u));
  } catch {
    // Backend not reachable yet — page still renders with empty state
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-white">OpsPilot</h1>
        <p className="text-muted text-sm mt-1">
          Real-time service monitoring with AI-generated incident explanations.
        </p>
      </header>

      {services.length === 0 && (
        <div className="rounded-xl border border-border bg-surface p-6 text-muted text-sm mb-8">
          No services being monitored yet. Add one through the API at{" "}
          <code className="text-accent">POST /services/</code> to get started.
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {services.map((service) => (
          <StatusCard key={service.id} service={service} uptime={uptimes[service.id] || null} />
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-lg font-medium text-white mb-4">Incidents</h2>
          <IncidentList incidents={incidents} />
        </section>

        <section>
          <h2 className="text-lg font-medium text-white mb-4">AI Assistant</h2>
          <ChatBox />
        </section>
      </div>
    </main>
  );
}
