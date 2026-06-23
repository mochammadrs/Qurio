"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AlertTriangle, X } from "lucide-react";

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-desc"
    >
      <Card className="w-full max-w-md p-0">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 id="delete-dialog-title" className="text-lg font-bold text-gray-900 mb-1">
                Hapus pertanyaan ini?
              </h3>
              <p id="delete-dialog-desc" className="text-sm text-gray-600 mb-3">
                Tindakan ini tidak dapat dibatalkan. Pertanyaan akan dihapus permanently.
              </p>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-sm text-gray-700 line-clamp-2 italic">&ldquo;{questionText}&rdquo;</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
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
