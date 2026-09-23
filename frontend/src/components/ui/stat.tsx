import { cn } from "@/lib/utils/cn";

type StatProps = {
  value: string;
  label: string;
  emphasis?: "primary" | "secondary";
  align?: "start" | "end";
};

/** A label/value pair. Render inside a <dl>. */
export function Stat({ value, label, emphasis = "primary", align = "start" }: StatProps) {
  // dt precedes dd in the DOM for assistive tech; flex-col-reverse puts the value on top visually.
  return (
    <div className={cn("flex flex-col-reverse", align === "end" && "items-end")}>
      <dt className="text-xs text-muted">{label}</dt>
      <dd
        className={cn(
          "text-foreground",
          emphasis === "primary" ? "text-2xl font-semibold" : "text-lg font-medium",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
