import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

const tones = {
  success: "bg-accent/15 text-accent",
  danger: "bg-danger/15 text-danger",
  warning: "bg-warning/15 text-warning",
  neutral: "bg-muted/15 text-muted",
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({ tone = "neutral", className, ...props }: ComponentProps<"span"> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
}
