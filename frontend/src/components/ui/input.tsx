import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export const fieldStyles = cn(
  "rounded-md border border-border bg-background text-sm text-foreground transition-colors outline-none",
  "placeholder:text-muted focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20",
  "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger",
);

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldStyles, "h-10 w-full px-3", className)} {...props} />;
}
