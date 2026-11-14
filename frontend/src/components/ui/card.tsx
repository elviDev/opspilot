import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("neu-raised min-w-0 rounded-2xl border border-white/10 bg-surface p-5", className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex items-center justify-between gap-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 className={cn("font-medium text-foreground", className)} {...props} />;
}
