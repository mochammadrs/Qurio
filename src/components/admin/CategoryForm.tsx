"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { X, AlertCircle } from "lucide-react";

type FormMode = "create" | "edit";

interface CategoryFormProps {
  mode: FormMode;
  initialData?: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    emoji: string | null;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const SLUG_REGEX = /^[a-z0-9-]+$/;

export function CategoryForm({ mode, initialData, onSuccess, onCancel }: CategoryFormProps) {
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [emoji, setEmoji] = useState(initialData?.emoji ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);

  const validateSlug = useCallback((value: string): string | null => {
    if (!value) return "Slug tidak boleh kosong";
    if (!SLUG_REGEX.test(value)) return "Hanya huruf kecil, angka, dan tanda hubung (-)";
    if (value.length > 50) return "Slug maksimal 50 karakter";
    return null;
  }, []);

  const handleSlugChange = (value: string) => {
    const lower = value.toLowerCase();
    setSlug(lower);
    setSlugError(validateSlug(lower));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const slugErr = validateSlug(slug);
    if (slugErr) {
      setSlugError(slugErr);
      return;
    }

    if (!name.trim()) {
      setError("Nama kategori tidak boleh kosong");
      return;
    }
    if (name.length > 100) {
      setError("Nama kategori maksimal 100 karakter");
      return;
    }
    if (description.length > 500) {
      setError("Deskripsi maksimal 500 karakter");
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, string> = {
        slug: slug.trim(),
        name: name.trim(),
        description: description.trim(),
        emoji: emoji.trim(),
      };

      const url =
        mode === "create"
          ? "/api/admin/categories"
          : `/api/admin/categories/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        if (res.status === 409) {
          setError("Slug sudah digunakan. Gunakan slug yang berbeda.");
        } else {
          throw new Error(data.error || `Gagal ${mode === "create" ? "menambah" : "mengubah"} kategori`);
        }
        return;
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      setSlug(initialData.slug);
      setName(initialData.name);
      setDescription(initialData.description ?? "");
      setEmoji(initialData.emoji ?? "");
    }
  }, [initialData]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={mode === "create" ? "Tambah kategori" : "Edit kategori"}
    >
      <Card className="w-full max-w-lg p-0">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === "create" ? "Tambah Kategori" : "Edit Kategori"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Tutup form"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="contoh-kategori"
              maxLength={50}
              disabled={submitting || mode === "edit"}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
            {slugError && <p className="text-xs text-red-500 mt-1">{slugError}</p>}
            {!slugError && <p className="text-xs text-gray-400 mt-1">Huruf kecil, angka, dan tanda hubung</p>}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nama <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Kategori"
              maxLength={100}
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Deskripsi <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi kategori..."
              rows={3}
              maxLength={500}
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="emoji" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Emoji <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <input
              id="emoji"
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🔬"
              maxLength={10}
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1"
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={submitting} className="flex-1">
              {submitting ? "Menyimpan..." : mode === "create" ? "Tambah" : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
