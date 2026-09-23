import { cn } from "@/lib/utils/cn";

const tones = {
  success: "bg-accent",
  danger: "bg-danger",
  warning: "bg-warning",
  neutral: "bg-muted",
} as const;

type StatusDotProps = {
  tone: keyof typeof tones;
  label: string;
  pulse?: boolean;
  className?: string;
};

export function StatusDot({ tone, label, pulse = false, className }: StatusDotProps) {
  return (
    <span role="img" aria-label={label} title={label} className={cn("relative flex size-2.5", className)}>
      {pulse && (
        <span className={cn("absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping", tones[tone])} />
      )}
      <span className={cn("relative size-2.5 rounded-full", tones[tone])} />
    </span>
  );
}
