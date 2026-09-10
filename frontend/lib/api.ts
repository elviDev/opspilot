const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Service = {
  id: number;
  name: string;
  url: string;
  is_active: boolean;
  created_at: string;
};

export type Incident = {
  id: number;
  service_id: number;
  started_at: string;
  resolved_at: string | null;
  ai_summary: string | null;
  status: string;
};

export type Uptime = {
  service_id: number;
  uptime_percent: number;
  avg_response_time_ms: number | null;
  total_checks: number;
};

export async function getServices(): Promise<Service[]> {
  const res = await fetch(`${API_BASE}/services/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export async function getIncidents(): Promise<Incident[]> {
  const res = await fetch(`${API_BASE}/incidents/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch incidents");
  return res.json();
}

export async function getUptime(serviceId: number): Promise<Uptime> {
  const res = await fetch(`${API_BASE}/checks/${serviceId}/uptime`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch uptime");
  return res.json();
}

export async function askChat(question: string, language: string): Promise<string> {
  const res = await fetch(`${API_BASE}/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, language }),
  });
  if (!res.ok) throw new Error("Failed to get chat response");
  const data = await res.json();
  return data.answer;
}
