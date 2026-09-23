"use client";

import { formatDateTime } from "@/lib/utils/format";
import { useIsClient } from "@/lib/utils/use-is-client";

/**
 * Renders a timestamp in the viewer's timezone. The server (and hydration
 * pass) render UTC so markup matches, then the client swaps to local time.
 */
export function LocalTime({ iso, className }: { iso: string; className?: string }) {
  const isClient = useIsClient();
  return (
    <time dateTime={iso} className={className}>
      {formatDateTime(iso, { utc: !isClient })}
    </time>
  );
}
