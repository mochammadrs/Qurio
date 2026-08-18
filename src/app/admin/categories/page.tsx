"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { Plus, Pencil, Trash2, FolderOpen, AlertCircle } from "lucide-react";
import { getCategoryIcon } from "@/utils/category-icons";

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  _count?: {
    questions: number;
  };
}

type FormMode = "create" | "edit" | null;

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) {
        if (res.status === 403) {
          router.push("/dashboard");
          return;
        }
        throw new Error("Gagal memuat data kategori");
      }
      const data = (await res.json()) as { categories: Category[] };
      setCategories(data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    if (session.user.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    fetchCategories();
  }, [session, status, router, fetchCategories]);

  const handleCreate = () => {
    setEditingCategory(null);
    setFormMode("create");
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormMode("edit");
  };

  const handleFormSuccess = () => {
    setFormMode(null);
    setEditingCategory(null);
    fetchCategories();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        if (res.status === 400) {
          throw new Error("Tidak bisa hapus kategori yang memiliki pertanyaan.");
        }
        throw new Error(data.error || "Gagal menghapus kategori");
      }
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus kategori");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (status === "loading" || (session && loading)) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="h-10 bg-surface-container rounded w-64 animate-pulse" />
          <div className="h-6 bg-surface-container rounded w-48 animate-pulse" />
        </div>
        <Card className="p-0 border-border overflow-hidden">
          <div className="h-96 bg-surface-container animate-pulse" />
        </Card>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <>
      <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-headline-lg text-text-primary mb-2">Kelola Kategori</h1>
          <p className="text-body-md text-text-muted">Tambah, edit, atau hapus kategori kuis.</p>
        </div>
        <Button variant="primary" size="md" onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Tambah Kategori
        </Button>
      </div>

      {error && (
        <div className="p-4 border border-error/20 bg-error/5 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-error shrink-0" />
          <p className="text-error text-sm font-medium">{error}</p>
          <Button variant="ghost" size="sm" onClick={fetchCategories} className="ml-auto text-error hover:bg-error/10">
            Coba Lagi
          </Button>
        </div>
      )}

      {categories.length === 0 && !error ? (
        <Card className="p-16 text-center border-dashed">
          <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center mx-auto mb-6">
            <FolderOpen className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="title-md text-text-primary mb-2">Belum ada kategori</h3>
          <p className="text-body-md text-text-muted mb-8">
            Klik &quot;Tambah Kategori&quot; untuk membuat kategori pertama.
          </p>
          <Button variant="primary" onClick={handleCreate} className="flex items-center gap-2 mx-auto">
            <Plus className="w-5 h-5" />
            Tambah Kategori
          </Button>
        </Card>
      ) : (
        <Card className="p-0 border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface-container">
                  <th className="px-6 py-4 label-sm text-text-subtle uppercase tracking-wider">Ikon</th>
                  <th className="px-6 py-4 label-sm text-text-subtle uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 label-sm text-text-subtle uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-4 label-sm text-text-subtle uppercase tracking-wider">Pertanyaan</th>
                  <th className="px-6 py-4 label-sm text-text-subtle uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-6 py-5">
                      {(() => {
                        const Icon = getCategoryIcon(cat.slug);
                        return <Icon className="w-5 h-5 text-primary" />;
                      })()}
                    </td>
                    <td className="px-6 py-5 mono-xs text-text-primary">{cat.slug}</td>
                    <td className="px-6 py-5 text-sm font-medium text-text-primary">{cat.name}</td>
                    <td className="px-6 py-5">
                      <span className="mono-xs px-2 py-1 bg-surface-container text-text-primary rounded">
                        {cat._count?.questions ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-text-muted hover:text-text-primary transition-colors p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded"
                          title="Edit"
                          aria-label={`Edit kategori: ${cat.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="text-text-muted hover:text-error transition-colors p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-1 rounded"
                          title="Hapus"
                          aria-label={`Hapus kategori: ${cat.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>

    {formMode && (
      <CategoryForm
        mode={formMode}
        initialData={editingCategory ?? undefined}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setFormMode(null);
          setEditingCategory(null);
        }}
      />
    )}

    <DeleteDialog
      isOpen={!!deleteTarget}
      onClose={() => setDeleteTarget(null)}
      onConfirm={handleDeleteConfirm}
      questionText={deleteTarget?.name ?? ""}
      loading={deleteLoading}
    />

    </>
  );
}
