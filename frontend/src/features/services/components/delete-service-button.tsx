"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { getErrorMessage } from "@/lib/http/api-error";
import { useDeleteService } from "../hooks/use-delete-service";
import type { Service } from "../schemas";

type DeleteServiceButtonProps = {
  service: Pick<Service, "id" | "name">;
  /** Called after the backend confirms the delete (e.g. to leave a detail page). */
  onDeleted?: () => void;
  variant?: "icon" | "full";
};

export function DeleteServiceButton({ service, onDeleted, variant = "icon" }: DeleteServiceButtonProps) {
  const [open, setOpen] = useState(false);
  const deleteService = useDeleteService({
    onDeleted: () => {
      setOpen(false);
      onDeleted?.();
    },
  });

  function handleOpenChange(next: boolean) {
    if (deleteService.isPending) return;
    if (next) deleteService.reset();
    setOpen(next);
  }

  return (
    <>
      {variant === "icon" ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleOpenChange(true)}
          aria-label={`Delete ${service.name}`}
          title="Delete service"
        >
          <Trash2 aria-hidden className="size-4" />
        </Button>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => handleOpenChange(true)}>
          <Trash2 aria-hidden className="size-4" />
          Delete service
        </Button>
      )}
      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
        title={`Delete ${service.name}?`}
        description="Monitoring stops and its check history and incidents are permanently removed."
      >
        {deleteService.isError && (
          <Alert title="Couldn't delete the service">{getErrorMessage(deleteService.error)}</Alert>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => handleOpenChange(false)} disabled={deleteService.isPending}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteService.mutate(service.id)}
            isLoading={deleteService.isPending}
          >
            {deleteService.isPending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
