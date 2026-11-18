"use client";

import { CalendarClock, Plus, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LocalTime } from "@/components/ui/local-time";
import { Select } from "@/components/ui/select";
import { getErrorMessage } from "@/lib/http/api-error";
import type { Service } from "@/features/services/schemas";
import { useCreateMaintenanceWindow, useDeleteMaintenanceWindow } from "../hooks/use-maintenance-actions";
import {
  createMaintenanceWindowSchema,
  type CreateMaintenanceWindowInput,
  type MaintenanceWindow,
} from "../schemas";

const emptyForm: CreateMaintenanceWindowInput = {
  service_id: null,
  title: "",
  starts_at: "",
  ends_at: "",
};

export function MaintenancePanel({
  windows,
  services,
}: {
  windows: MaintenanceWindow[];
  services: Service[];
}) {
  const [open, setOpen] = useState(false);
  const [windowToDelete, setWindowToDelete] = useState<MaintenanceWindow | null>(null);
  const [values, setValues] = useState<CreateMaintenanceWindowInput>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const createWindow = useCreateMaintenanceWindow();
  const deleteWindow = useDeleteMaintenanceWindow();

  function update(field: keyof CreateMaintenanceWindowInput, value: string) {
    setValues((current) => ({
      ...current,
      [field]: field === "service_id" ? (value ? Number(value) : null) : value,
    }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = createMaintenanceWindowSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }
    createWindow.mutate(parsed.data, {
      onSuccess: () => {
        setValues(emptyForm);
        setOpen(false);
      },
    });
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-medium text-foreground">Maintenance windows</h3>
          <p className="mt-1 text-xs text-muted">Checks continue; incidents and alerts are suppressed.</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus aria-hidden className="size-4" />
          Schedule
        </Button>
      </div>

      {windows.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No upcoming maintenance">
          Schedule a window to silence incident notifications during planned work.
        </EmptyState>
      ) : (
        <ul className="divide-y divide-border">
          {windows.map((window) => (
            <li key={window.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{window.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {window.service_name ?? "All services"} · <LocalTime iso={window.starts_at} /> –{" "}
                  <LocalTime iso={window.ends_at} />
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Cancel maintenance window: ${window.title}`}
                title="Cancel maintenance window"
                disabled={deleteWindow.isPending}
                onClick={() => {
                  deleteWindow.reset();
                  setWindowToDelete(window);
                }}
              >
                <Trash2 aria-hidden className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Schedule maintenance"
        description="Incidents and alerts are suppressed for the selected services during this window."
      >
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Field id="maintenance-title" label="Description" error={fieldErrors.title?.[0]}>
            <Input
              id="maintenance-title"
              value={values.title}
              onChange={(event) => update("title", event.target.value)}
              maxLength={120}
              placeholder="Database upgrade"
              aria-invalid={fieldErrors.title ? true : undefined}
              aria-describedby={fieldErrors.title ? "maintenance-title-message" : undefined}
            />
          </Field>
          <Field id="maintenance-service" label="Services">
            <Select
              id="maintenance-service"
              value={values.service_id ?? ""}
              onChange={(event) => update("service_id", event.target.value)}
              options={[
                { value: "", label: "All services" },
                ...services.map((service) => ({ value: String(service.id), label: service.name })),
              ]}
            />
          </Field>
          <Field id="maintenance-start" label="Starts" error={fieldErrors.starts_at?.[0]}>
            <Input
              id="maintenance-start"
              type="datetime-local"
              value={values.starts_at}
              onChange={(event) => update("starts_at", event.target.value)}
              aria-invalid={fieldErrors.starts_at ? true : undefined}
              aria-describedby={fieldErrors.starts_at ? "maintenance-start-message" : undefined}
            />
          </Field>
          <Field id="maintenance-end" label="Ends" error={fieldErrors.ends_at?.[0]}>
            <Input
              id="maintenance-end"
              type="datetime-local"
              value={values.ends_at}
              onChange={(event) => update("ends_at", event.target.value)}
              aria-invalid={fieldErrors.ends_at ? true : undefined}
              aria-describedby={fieldErrors.ends_at ? "maintenance-end-message" : undefined}
            />
          </Field>
          {createWindow.isError && (
            <p role="alert" className="text-sm text-danger">
              {getErrorMessage(createWindow.error)}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={createWindow.isPending}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createWindow.isPending}>
              {createWindow.isPending ? "Scheduling…" : "Schedule window"}
            </Button>
          </div>
        </form>
      </Dialog>
      <Dialog
        open={windowToDelete !== null}
        onOpenChange={(next) => {
          if (!deleteWindow.isPending && !next) {
            deleteWindow.reset();
            setWindowToDelete(null);
          }
        }}
        title="Cancel this maintenance window?"
        description="Monitoring alerts will resume for the affected services."
      >
        {deleteWindow.isError && (
          <p role="alert" className="text-sm text-danger">
            {getErrorMessage(deleteWindow.error)}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              deleteWindow.reset();
              setWindowToDelete(null);
            }}
            disabled={deleteWindow.isPending}
          >
            Keep window
          </Button>
          <Button
            variant="danger"
            isLoading={deleteWindow.isPending}
            onClick={() => {
              if (!windowToDelete) return;
              deleteWindow.mutate(windowToDelete.id, {
                onSuccess: () => setWindowToDelete(null),
              });
            }}
          >
            Cancel window
          </Button>
        </div>
      </Dialog>
    </Card>
  );
}
