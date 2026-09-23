"use client";

import { Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ActionError, type FieldErrors } from "@/lib/actions/action-result";
import { getErrorMessage } from "@/lib/http/api-error";
import { useCreateService } from "../hooks/use-create-service";
import { createServiceSchema, SERVICE_NAME_MAX_LENGTH, type CreateServiceInput } from "../schemas";

const emptyForm: CreateServiceInput = { name: "", url: "" };

function AddServiceForm({ onDone }: { onDone: () => void }) {
  const [values, setValues] = useState<CreateServiceInput>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const createService = useCreateService();

  function update(field: keyof CreateServiceInput, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Same schema the Server Action enforces; checked here for instant feedback.
    const parsed = createServiceSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }
    createService.mutate(parsed.data, {
      onSuccess: onDone,
      onError: (error) => {
        if (error instanceof ActionError && error.fieldErrors) setFieldErrors(error.fieldErrors);
      },
    });
  }

  const formError =
    createService.isError && !(createService.error instanceof ActionError && createService.error.fieldErrors)
      ? getErrorMessage(createService.error)
      : undefined;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Field id="service-name" label="Name" error={fieldErrors.name?.[0]}>
        <Input
          id="service-name"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          maxLength={SERVICE_NAME_MAX_LENGTH}
          placeholder="Payments API"
          autoComplete="off"
          autoFocus
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "service-name-message" : undefined}
        />
      </Field>
      <Field
        id="service-url"
        label="URL"
        error={fieldErrors.url?.[0]}
        hint="Checked on a schedule. A non-2xx response or timeout counts as down."
      >
        <Input
          id="service-url"
          type="url"
          inputMode="url"
          value={values.url}
          onChange={(event) => update("url", event.target.value)}
          placeholder="https://api.example.com/health"
          autoComplete="off"
          aria-invalid={fieldErrors.url ? true : undefined}
          aria-describedby="service-url-message"
        />
      </Field>
      {formError && <Alert title="Couldn't add the service">{formError}</Alert>}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onDone} disabled={createService.isPending}>
          Cancel
        </Button>
        <Button type="submit" isLoading={createService.isPending}>
          {createService.isPending ? "Adding…" : "Add service"}
        </Button>
      </div>
    </form>
  );
}

export function AddServiceDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="size-4" />
        Add service
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Add a service"
        description="OpsPilot starts checking it on the next scheduled run."
      >
        {/* Mounted only while open, so every opening starts with a fresh form. */}
        <AddServiceForm onDone={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
