"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { QuestionForm } from "@/components/admin/QuestionForm";
import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { Plus, Pencil, Trash2, BookOpen, AlertCircle } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  emoji: string;
}

interface Question {
  id: string;
  categoryId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string | null;
  category: Category;
}

type FormMode = "create" | "edit" | null;

export default function AdminQuestionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/questions");
      if (!res.ok) {
        if (res.status === 403) {
          router.push("/dashboard");
          return;
        }
        throw new Error("Gagal memuat data pertanyaan");
      }
      const data = (await res.json()) as { questions: Question[] };
      setQuestions(data.questions);
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
    fetchQuestions();
  }, [session, status, router, fetchQuestions]);

  const handleCreate = () => {
    setEditingQuestion(null);
    setFormMode("create");
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormMode("edit");
  };

  const handleFormSuccess = () => {
    setFormMode(null);
    setEditingQuestion(null);
    fetchQuestions();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/questions/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Gagal menghapus pertanyaan");
      }
      setQuestions((prev) => prev.filter((q) => q.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus pertanyaan");
    } finally {
      setDeleteLoading(false);
    }
  };

  const difficultyLabel = (d: string | null) => {
    if (!d) return "-";
    const map: Record<string, string> = { easy: "Mudah", medium: "Sedang", hard: "Sulit" };
    return map[d] ?? d;
  };

  const difficultyColor = (d: string | null) => {
    if (!d) return "text-gray-500 bg-gray-100";
    const map: Record<string, string> = {
      easy: "text-green-700 bg-green-100",
      medium: "text-yellow-700 bg-yellow-100",
      hard: "text-red-700 bg-red-100",
    };
    return map[d] ?? "text-gray-600 bg-gray-100";
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
                Kelola Pertanyaan
              </h1>
              <p className="text-gray-600">Tambah, edit, atau hapus pertanyaan kuis.</p>
            </div>
            <Button variant="primary" size="md" onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Tambah Pertanyaan</span>
            </Button>
          </div>

          {error && (
            <Card className="p-4 border-red-200 bg-red-50 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
              <Button variant="secondary" size="sm" onClick={fetchQuestions} className="ml-auto">
                Coba Lagi
              </Button>
            </Card>
          )}

          {questions.length === 0 && !error ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada pertanyaan</h3>
              <p className="text-gray-600 mb-6">
                Klik &quot;Tambah Pertanyaan&quot; untuk membuat pertanyaan pertama.
              </p>
              <Button variant="primary" onClick={handleCreate} className="flex items-center gap-2 mx-auto">
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Tambah Pertanyaan</span>
              </Button>
            </Card>
          ) : (
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" role="table" aria-label="Daftar pertanyaan">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Pertanyaan
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Kategori
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Tingkat
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Jawaban Benar
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
                    {questions.map((q) => (
                      <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900 max-w-md truncate">
                            {q.question}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                            <span aria-hidden="true">{q.category.emoji}</span>
                            {q.category.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColor(q.difficulty)}`}
                          >
                            {difficultyLabel(q.difficulty)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                            {String.fromCharCode(65 + q.correctAnswer)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEdit(q)}
                              aria-label={`Edit pertanyaan: ${q.question}`}
                              className="flex items-center gap-1.5"
                            >
                              <Pencil className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setDeleteTarget(q)}
                              aria-label={`Hapus pertanyaan: ${q.question}`}
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
        <QuestionForm
          mode={formMode}
          initialData={editingQuestion ?? undefined}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setFormMode(null);
            setEditingQuestion(null);
          }}
        />
      )}

      <DeleteDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        questionText={deleteTarget?.question ?? ""}
        loading={deleteLoading}
      />
    </div>
  );
}
