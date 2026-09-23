export const checkKeys = {
  all: ["checks"] as const,
  byService: (serviceId: number) => [...checkKeys.all, "service", serviceId] as const,
};

export const CHECKS_POLL_INTERVAL_MS = 30_000;
