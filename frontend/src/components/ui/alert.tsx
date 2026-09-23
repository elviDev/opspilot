import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type AlertProps = {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function Alert({ title, children, action, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn("flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm", className)}
    >
      <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-danger" />
      <div className="flex-1">
        <p className="font-medium text-foreground">{title}</p>
        {children && <div className="mt-1 text-muted">{children}</div>}
      </div>
      {action}
    </div>
  );
}
