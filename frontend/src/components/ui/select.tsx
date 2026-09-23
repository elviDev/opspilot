import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";
import { fieldStyles } from "./input";

export type SelectOption = { value: string; label: string };

type SelectProps = Omit<ComponentProps<"select">, "children"> & {
  options: readonly SelectOption[];
};

export function Select({ options, className, ...props }: SelectProps) {
  return (
    <div className="relative inline-flex">
      <select className={cn(fieldStyles, "h-8 appearance-none py-0 pr-8 pl-2.5", className)} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
