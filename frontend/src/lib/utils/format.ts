const localDateTime = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const utcDateTime = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

export function formatDateTime(iso: string, { utc = false } = {}): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return utc ? `${utcDateTime.format(date)} UTC` : localDateTime.format(date);
}

export function formatDuration(fromIso: string, toIso: string): string {
  const ms = new Date(toIso).getTime() - new Date(fromIso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "—";

  const minutes = Math.round(ms / 60_000);
  if (minutes < 1) return "under a minute";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours < 24) return remainder ? `${hours}h ${remainder}m` : `${hours}h`;

  return `${Math.floor(hours / 24)}d ${hours % 24}h`;
}

export function formatPercent(value: number): string {
  // At most two decimals, without trailing zeros (97.5%, not 97.50%).
  return `${Number(value.toFixed(2))}%`;
}

export function formatMs(value: number | null): string {
  return value == null ? "—" : `${Math.round(value)}ms`;
}
