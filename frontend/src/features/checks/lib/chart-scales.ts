/** Pure helpers for the response-time chart (no React, no DOM). */

export type LinearScale = (value: number) => number;

export function linearScale([d0, d1]: [number, number], [r0, r1]: [number, number]): LinearScale {
  const span = d1 - d0 || 1;
  return (value) => r0 + ((value - d0) / span) * (r1 - r0);
}

/** Rounds a raw step up to 1, 2, 2.5 or 5 × 10ⁿ so ticks land on clean numbers. */
function niceStep(rawStep: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const residual = rawStep / magnitude;
  const nice = residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 2.5 ? 2.5 : residual <= 5 ? 5 : 10;
  return nice * magnitude;
}

/** Ticks from 0 up to a clean maximum that covers `max`. */
export function niceTicks(max: number, targetCount = 4): number[] {
  if (!Number.isFinite(max) || max <= 0) return [0, 100];
  const step = niceStep(max / targetCount);
  const top = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round(top / step) + 1 }, (_, index) => index * step);
}

/** Index of the point whose x is closest to `x`. `xs` must be sorted ascending. */
export function nearestIndex(xs: number[], x: number): number {
  let low = 0;
  let high = xs.length - 1;
  while (low < high) {
    const mid = (low + high) >> 1;
    if ((xs[mid] ?? 0) < x) low = mid + 1;
    else high = mid;
  }
  if (low > 0 && Math.abs((xs[low - 1] ?? 0) - x) <= Math.abs((xs[low] ?? 0) - x)) return low - 1;
  return low;
}

/**
 * Splits points into runs of consecutive non-null values, so the line breaks
 * where a check has no response time instead of interpolating across it.
 */
export function contiguousRuns<T>(points: T[], hasValue: (point: T) => boolean): T[][] {
  const runs: T[][] = [];
  let current: T[] = [];
  for (const point of points) {
    if (hasValue(point)) {
      current.push(point);
    } else if (current.length) {
      runs.push(current);
      current = [];
    }
  }
  if (current.length) runs.push(current);
  return runs;
}
