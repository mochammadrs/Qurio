"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AlertTriangle } from "lucide-react";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  questionText: string;
  loading: boolean;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  questionText,
  loading,
}: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-desc"
    >
      <Card className="w-full max-w-md p-0 border-border">
        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded bg-error/10 flex items-center justify-center shrink-0 mb-6">
              <AlertTriangle className="w-6 h-6 text-error" />
            </div>
            <div className="flex-1">
              <h3 id="delete-dialog-title" className="text-title-md text-text-primary mb-2">
                Hapus data ini?
              </h3>
              <p id="delete-dialog-desc" className="text-body-md text-text-muted mb-6">
                Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen.
              </p>
              <div className="p-4 rounded border border-border bg-surface-container">
                <p className="text-sm text-text-primary italic line-clamp-2">&ldquo;{questionText}&rdquo;</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 px-8 pb-8">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
