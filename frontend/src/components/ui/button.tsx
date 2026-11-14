import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "./spinner";

const variants = {
  primary: "neu-accent bg-accent text-background hover:bg-accent/90",
  secondary: "neu-raised border border-white/10 bg-surface text-foreground hover:bg-surface-hover",
  ghost: "text-muted hover:bg-surface-hover hover:text-foreground",
  danger: "bg-danger text-white hover:bg-danger/90",
} as const;

const sizes = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-4 text-sm",
  icon: "size-8",
} as const;

export type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        "neu-pressable inline-flex shrink-0 items-center justify-center rounded-xl font-medium transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {isLoading && <Spinner className="size-4" />}
      {children}
    </button>
  );
}
