import type { ReactNode } from "react";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

/**
 * Label + control + message. The control must set aria-describedby to
 * `${id}-message` and aria-invalid when `error` is present.
 */
export function Field({ id, label, error, hint, children }: FieldProps) {
  const message = error ?? hint;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {message && (
        <p id={`${id}-message`} role={error ? "alert" : undefined} className={error ? "text-sm text-danger" : "text-xs text-muted"}>
          {message}
        </p>
      )}
    </div>
  );
}
