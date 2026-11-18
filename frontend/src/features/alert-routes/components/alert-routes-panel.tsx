"use client";

import { BellRing, Plus, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getErrorMessage } from "@/lib/http/api-error";
import { useCreateAlertRoute, useDeleteAlertRoute } from "../hooks/use-alert-route-actions";
import {
  alertProviderSchema,
  createAlertRouteSchema,
  type AlertRoute,
  type CreateAlertRouteInput,
} from "../schemas";

const emptyForm: CreateAlertRouteInput = {
  name: "",
  provider: "slack",
  webhook_url: "",
};

export function AlertRoutesPanel({ routes }: { routes: AlertRoute[] }) {
  const [open, setOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<AlertRoute | null>(null);
  const [values, setValues] = useState<CreateAlertRouteInput>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const createRoute = useCreateAlertRoute();
  const deleteRoute = useDeleteAlertRoute();

  function update(field: keyof CreateAlertRouteInput, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = createAlertRouteSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }
    createRoute.mutate(parsed.data, {
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
          <h3 className="font-medium text-foreground">Alert destinations</h3>
          <p className="mt-1 text-xs text-muted">
            Every active destination receives outage and recovery notifications.
          </p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus aria-hidden className="size-4" />
          Add destination
        </Button>
      </div>

      {routes.length === 0 ? (
        <EmptyState icon={BellRing} title="No destinations configured">
          Slack still uses the legacy SLACK_WEBHOOK_URL environment setting, if configured.
        </EmptyState>
      ) : (
        <ul className="divide-y divide-border">
          {routes.map((route) => (
            <li key={route.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{route.name}</p>
                <p className="mt-1 text-xs capitalize text-muted">{route.provider}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Remove alert destination: ${route.name}`}
                title="Remove alert destination"
                disabled={deleteRoute.isPending}
                onClick={() => {
                  deleteRoute.reset();
                  setRouteToDelete(route);
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
        title="Add alert destination"
        description="All monitored services send alerts to this destination. Its webhook URL is never included in dashboard responses."
      >
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Field id="alert-route-name" label="Name" error={fieldErrors.name?.[0]}>
            <Input
              id="alert-route-name"
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              maxLength={80}
              placeholder="On-call Slack"
              aria-invalid={fieldErrors.name ? true : undefined}
              aria-describedby={fieldErrors.name ? "alert-route-name-message" : undefined}
            />
          </Field>
          <Field id="alert-route-provider" label="Provider">
            <Select
              id="alert-route-provider"
              value={values.provider}
              onChange={(event) => {
                const provider = alertProviderSchema.safeParse(event.target.value);
                if (provider.success) update("provider", provider.data);
              }}
              options={[
                { value: "slack", label: "Slack" },
                { value: "discord", label: "Discord" },
              ]}
            />
          </Field>
          <Field
            id="alert-route-url"
            label="Incoming webhook URL"
            error={fieldErrors.webhook_url?.[0]}
            hint="Use an HTTPS incoming webhook URL for the selected provider."
          >
            <Input
              id="alert-route-url"
              type="url"
              inputMode="url"
              value={values.webhook_url}
              onChange={(event) => update("webhook_url", event.target.value)}
              autoComplete="off"
              aria-invalid={fieldErrors.webhook_url ? true : undefined}
              aria-describedby="alert-route-url-message"
            />
          </Field>
          {createRoute.isError && (
            <p role="alert" className="text-sm text-danger">
              {getErrorMessage(createRoute.error)}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={createRoute.isPending}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createRoute.isPending}>
              {createRoute.isPending ? "Adding…" : "Add destination"}
            </Button>
          </div>
        </form>
      </Dialog>
      <Dialog
        open={routeToDelete !== null}
        onOpenChange={(next) => {
          if (!deleteRoute.isPending && !next) {
            deleteRoute.reset();
            setRouteToDelete(null);
          }
        }}
        title="Remove this destination?"
        description="It will stop receiving outage and recovery notifications."
      >
        {deleteRoute.isError && (
          <p role="alert" className="text-sm text-danger">
            {getErrorMessage(deleteRoute.error)}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              deleteRoute.reset();
              setRouteToDelete(null);
            }}
            disabled={deleteRoute.isPending}
          >
            Keep destination
          </Button>
          <Button
            variant="danger"
            isLoading={deleteRoute.isPending}
            onClick={() => {
              if (!routeToDelete) return;
              deleteRoute.mutate(routeToDelete.id, {
                onSuccess: () => setRouteToDelete(null),
              });
            }}
          >
            Remove destination
          </Button>
        </div>
      </Dialog>
    </Card>
  );
}
