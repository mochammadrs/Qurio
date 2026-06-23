"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { Plus, Pencil, Trash2, FolderOpen, AlertCircle } from "lucide-react";

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  emoji: string | null;
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
          throw new Error("Tidak bisa hapus kategori yang memiliki pertanyaan. Hapus pertanyaan dulu.");
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded-2xl w-64 animate-pulse" />
            <div className="h-12 bg-gray-200 rounded-2xl w-48 animate-pulse" />
            <Card className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-2">
                Kelola Kategori
              </h1>
              <p className="text-gray-600">Tambah, edit, atau hapus kategori kuis.</p>
            </div>
            <Button variant="primary" size="md" onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Tambah Kategori</span>
            </Button>
          </div>

          {error && (
            <Card className="p-4 border-red-200 bg-red-50 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
              <Button variant="secondary" size="sm" onClick={fetchCategories} className="ml-auto">
                Coba Lagi
              </Button>
            </Card>
          )}

          {categories.length === 0 && !error ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada kategori</h3>
              <p className="text-gray-600 mb-6">
                Klik &quot;Tambah Kategori&quot; untuk membuat kategori pertama.
              </p>
              <Button variant="primary" onClick={handleCreate} className="flex items-center gap-2 mx-auto">
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Tambah Kategori</span>
              </Button>
            </Card>
          ) : (
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" role="table" aria-label="Daftar kategori">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Emoji
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Slug
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Nama
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Pertanyaan
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-lg" aria-hidden="true">
                            {cat.emoji || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono text-gray-700">{cat.slug}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {cat._count?.questions ?? 0}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEdit(cat)}
                              aria-label={`Edit kategori: ${cat.name}`}
                              className="flex items-center gap-1.5"
                            >
                              <Pencil className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setDeleteTarget(cat)}
                              aria-label={`Hapus kategori: ${cat.name}`}
                              className="flex items-center gap-1.5"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Hapus</span>
                            </Button>
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
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        questionText={deleteTarget?.name ?? ""}
        loading={deleteLoading}
      />
    </div>
  );
}
