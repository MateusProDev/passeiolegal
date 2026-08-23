"use client";

import { useCallback } from "react";
import toast from "react-hot-toast";

interface UseDeleteEntityOptions {
  /** API segment of the entity, e.g. "tours" for DELETE /api/tours/[id]. */
  entityType: string;
  successMessage: string;
  errorMessage: string;
  /** Shown in a native confirmation prompt before deleting, when provided. */
  confirmMessage?: string;
  onDeleted?: () => void;
}

/**
 * Returns a delete handler with the shared confirm/toast/refresh behaviour
 * used by the admin listings.
 */
export function useDeleteEntity({
  entityType,
  successMessage,
  errorMessage,
  confirmMessage,
  onDeleted,
}: UseDeleteEntityOptions) {
  return useCallback(
    async (id: string) => {
      if (confirmMessage && !confirm(confirmMessage)) return;

      try {
        const response = await fetch(`/api/${entityType}/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Delete failed");
        toast.success(successMessage);
        onDeleted?.();
      } catch (error) {
        toast.error(errorMessage);
      }
    },
    [entityType, successMessage, errorMessage, confirmMessage, onDeleted]
  );
}
