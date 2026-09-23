"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LocalTime } from "@/components/ui/local-time";
import { formatMs } from "@/lib/utils/format";
import type { Check } from "../schemas";

const COLLAPSED_ROWS = 20;

/**
 * Table view of the checks the chart plots, newest first. It can expand to
 * every charted check, so no value is reachable only by hovering the chart.
 */
export function ChecksTable({ checks }: { checks: Check[] }) {
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? checks : checks.slice(0, COLLAPSED_ROWS);

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            {expanded ? `All ${checks.length}` : `Most recent ${rows.length}`} checks, newest first
          </caption>
          <thead className="text-xs text-muted">
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-4 font-medium">Checked</th>
              <th scope="col" className="py-2 pr-4 font-medium">Status</th>
              <th scope="col" className="py-2 pr-4 text-right font-medium">HTTP</th>
              <th scope="col" className="py-2 text-right font-medium">Response</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map((check) => (
              <tr key={check.id} className="border-b border-border/60 last:border-0">
                <td className="py-2 pr-4 whitespace-nowrap text-muted">
                  <LocalTime iso={check.checked_at} />
                </td>
                <td className="py-2 pr-4">
                  <Badge tone={check.is_up ? "success" : "danger"}>{check.is_up ? "Up" : "Down"}</Badge>
                </td>
                <td className="py-2 pr-4 text-right text-foreground">{check.status_code ?? "—"}</td>
                <td className="py-2 text-right text-foreground">{formatMs(check.response_time_ms)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {checks.length > COLLAPSED_ROWS && (
        <Button variant="ghost" size="sm" className="self-start" onClick={() => setExpanded((value) => !value)}>
          {expanded ? "Show fewer" : `Show all ${checks.length} checks`}
        </Button>
      )}
    </div>
  );
}
