"use client";

import { useMemo, useState, type KeyboardEvent, type PointerEvent } from "react";
import { formatMs } from "@/lib/utils/format";
import { useElementWidth } from "@/lib/utils/use-element-width";
import { contiguousRuns, linearScale, nearestIndex, niceTicks } from "../lib/chart-scales";
import type { Check } from "../schemas";

const HEIGHT = 240;
const MARGIN = { top: 12, right: 56, bottom: 28, left: 48 };

type Point = {
  id: number;
  time: number;
  value: number | null;
  isUp: boolean;
  statusCode: number | null;
};

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" });
const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function toPoints(checks: Check[]): Point[] {
  return checks
    .map((check) => ({
      id: check.id,
      time: new Date(check.checked_at).getTime(),
      value: check.response_time_ms,
      isUp: check.is_up,
      statusCode: check.status_code,
    }))
    .filter((point) => Number.isFinite(point.time))
    .sort((a, b) => a.time - b.time);
}

function linePath(points: Point[], x: (t: number) => number, y: (v: number) => number): string {
  return points.map((point, index) => `${index ? "L" : "M"}${x(point.time)},${y(point.value ?? 0)}`).join("");
}

/**
 * Single-series response-time line. Failed checks are drawn as shaded outage
 * bands (a different form, not just a different color) so they stay legible
 * for color-blind readers; the checks table carries every value as text.
 */
export function ResponseTimeChart({ checks }: { checks: Check[] }) {
  const [containerRef, width] = useElementWidth<HTMLDivElement>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const points = useMemo(() => toPoints(checks), [checks]);

  const layout = useMemo(() => {
    if (width === 0 || points.length === 0) return null;
    const first = points[0]!.time;
    const last = points[points.length - 1]!.time;
    const values = points.flatMap((point) => (point.value == null ? [] : [point.value]));
    const yTicks = niceTicks(Math.max(...values, 0));
    const plotRight = width - MARGIN.right;
    const plotBottom = HEIGHT - MARGIN.bottom;
    const x = linearScale([first, last], [MARGIN.left, plotRight]);
    const y = linearScale([0, yTicks[yTicks.length - 1] ?? 100], [plotBottom, MARGIN.top]);
    const spansDays = last - first > 24 * 60 * 60 * 1000;
    const xTickCount = Math.max(2, Math.min(5, Math.floor((plotRight - MARGIN.left) / 110)));
    const xTicks =
      points.length === 1
        ? [first]
        : Array.from({ length: xTickCount }, (_, index) => first + ((last - first) * index) / (xTickCount - 1));
    // Outage band width: about one check interval, never thinner than 3px.
    const bandWidth = Math.max(3, (plotRight - MARGIN.left) / Math.max(points.length - 1, 1));
    return { x, y, yTicks, xTicks, plotRight, plotBottom, spansDays, bandWidth, xs: points.map((p) => x(p.time)) };
  }, [points, width]);

  const runs = useMemo(() => contiguousRuns(points, (point) => point.value != null), [points]);
  const downCount = points.filter((point) => !point.isUp).length;
  const lastWithValue = [...points].reverse().find((point) => point.value != null);
  const active = activeIndex == null ? null : points[activeIndex];

  const summary = `Response time for the last ${points.length} checks${
    lastWithValue ? `, latest ${formatMs(lastWithValue.value)}` : ""
  }${downCount ? `, ${downCount} failed` : ""}. Full values are in the table below.`;

  function handlePointerMove(event: PointerEvent<SVGRectElement>) {
    if (!layout) return;
    const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!bounds) return;
    setActiveIndex(nearestIndex(layout.xs, event.clientX - bounds.left));
  }

  function handleKeyDown(event: KeyboardEvent<SVGSVGElement>) {
    const lastIndex = points.length - 1;
    const current = activeIndex ?? lastIndex;
    const next =
      event.key === "ArrowLeft" ? Math.max(0, current - 1)
      : event.key === "ArrowRight" ? Math.min(lastIndex, current + 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? lastIndex
      : null;
    if (next == null) return;
    event.preventDefault();
    setActiveIndex(next);
  }

  const formatTick = (time: number) => (layout?.spansDays ? dateTimeFormat : timeFormat).format(time);

  return (
    <div className="flex flex-col gap-3">
      <div ref={containerRef} className="relative h-60 w-full">
        {layout && (
          <svg
            width={width}
            height={HEIGHT}
            role="img"
            aria-label={summary}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onFocus={() => setActiveIndex((index) => index ?? points.length - 1)}
            onBlur={() => setActiveIndex(null)}
            className="overflow-visible rounded-md outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            {/* Gridlines + y-axis labels: recessive hairlines */}
            {layout.yTicks.map((tick) => (
              <g key={tick}>
                <line
                  x1={MARGIN.left}
                  x2={layout.plotRight}
                  y1={layout.y(tick)}
                  y2={layout.y(tick)}
                  className="stroke-border"
                  strokeWidth={1}
                  shapeRendering="crispEdges"
                />
                <text
                  x={MARGIN.left - 8}
                  y={layout.y(tick)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-muted text-[11px] tabular-nums"
                >
                  {tick.toLocaleString()}ms
                </text>
              </g>
            ))}

            {/* X-axis labels */}
            {layout.xTicks.map((tick, index) => (
              <text
                key={tick}
                x={layout.x(tick)}
                y={HEIGHT - 8}
                textAnchor={index === 0 ? "start" : index === layout.xTicks.length - 1 ? "end" : "middle"}
                className="fill-muted text-[11px] tabular-nums"
              >
                {formatTick(tick)}
              </text>
            ))}

            {/* Outage bands for failed checks */}
            {points.map((point) =>
              point.isUp ? null : (
                <rect
                  key={`down-${point.id}`}
                  x={layout.x(point.time) - layout.bandWidth / 2}
                  y={MARGIN.top}
                  width={layout.bandWidth}
                  height={layout.plotBottom - MARGIN.top}
                  className="fill-danger/20"
                />
              ),
            )}

            {/* Area wash + 2px line, broken where a check has no response time */}
            {runs.map((run) => {
              const line = linePath(run, layout.x, layout.y);
              const firstX = layout.x(run[0]!.time);
              const lastX = layout.x(run[run.length - 1]!.time);
              return (
                <g key={run[0]!.id}>
                  <path d={`${line}L${lastX},${layout.plotBottom}L${firstX},${layout.plotBottom}Z`} className="fill-accent/10" />
                  <path
                    d={line}
                    fill="none"
                    className="stroke-accent"
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}

            {/* Direct label at the line's end */}
            {lastWithValue?.value != null && (
              <g>
                <circle
                  cx={layout.x(lastWithValue.time)}
                  cy={layout.y(lastWithValue.value)}
                  r={4}
                  className="fill-accent stroke-surface"
                  strokeWidth={2}
                />
                <text
                  x={layout.x(lastWithValue.time) + 8}
                  y={layout.y(lastWithValue.value)}
                  dominantBaseline="middle"
                  className="fill-foreground text-xs font-medium tabular-nums"
                >
                  {formatMs(lastWithValue.value)}
                </text>
              </g>
            )}

            {/* Crosshair + hover marker */}
            {active && (
              <g pointerEvents="none">
                <line
                  x1={layout.x(active.time)}
                  x2={layout.x(active.time)}
                  y1={MARGIN.top}
                  y2={layout.plotBottom}
                  className="stroke-muted/60"
                  strokeWidth={1}
                  shapeRendering="crispEdges"
                />
                {active.value != null && (
                  <circle
                    cx={layout.x(active.time)}
                    cy={layout.y(active.value)}
                    r={5}
                    className={active.isUp ? "fill-accent stroke-surface" : "fill-danger stroke-surface"}
                    strokeWidth={2}
                  />
                )}
              </g>
            )}

            {/* Full-plot hit area: the crosshair snaps to the nearest check */}
            <rect
              x={MARGIN.left}
              y={MARGIN.top}
              width={Math.max(0, layout.plotRight - MARGIN.left)}
              height={layout.plotBottom - MARGIN.top}
              fill="transparent"
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setActiveIndex(null)}
            />
          </svg>
        )}

        {layout && active && (
          <div
            role="status"
            className="pointer-events-none absolute top-2 z-10 min-w-36 rounded-md border border-border bg-background/95 px-3 py-2 text-xs shadow-lg"
            style={
              layout.x(active.time) > width / 2
                ? { right: width - layout.x(active.time) + 12 }
                : { left: layout.x(active.time) + 12 }
            }
          >
            <p className="text-sm font-semibold text-foreground tabular-nums">
              {active.value != null ? formatMs(active.value) : "No response"}
            </p>
            <p className="flex items-center gap-1.5 text-muted">
              <span aria-hidden className={`h-0.5 w-3 rounded-full ${active.isUp ? "bg-accent" : "bg-danger"}`} />
              {active.isUp ? "Up" : "Down"}
              {active.statusCode != null && ` · HTTP ${active.statusCode}`}
            </p>
            <p className="mt-0.5 text-muted">{dateTimeFormat.format(active.time)}</p>
          </div>
        )}
      </div>

      {downCount > 0 && (
        <p className="flex items-center gap-2 text-xs text-muted">
          <span aria-hidden className="inline-block h-3 w-2 rounded-sm bg-danger/40" />
          Failed check ({downCount})
        </p>
      )}
    </div>
  );
}
