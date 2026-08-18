"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { QuestionForm } from "@/components/admin/QuestionForm";
import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { Plus, Pencil, Trash2, BookOpen, AlertCircle, Search, X } from "lucide-react";
import { getCategoryIcon } from "@/utils/category-icons";

interface Category {
  id: string;
  name: string;
  slug: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const uniqueCategories = useMemo(() => {
    const map = new Map<string, Category>();
    questions.forEach((q) => map.set(q.category.id, q.category));
    return Array.from(map.values());
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        !searchQuery ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || q.category.id === categoryFilter;
      const matchesDifficulty =
        difficultyFilter === "all" || q.difficulty === difficultyFilter;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [questions, searchQuery, categoryFilter, difficultyFilter]);

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
          <h1 className="text-headline-lg text-text-primary mb-2">Kelola Pertanyaan</h1>
          <p className="text-body-md text-text-muted">Tambah, edit, atau hapus pertanyaan kuis.</p>
        </div>
        <Button variant="primary" size="md" onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Tambah Pertanyaan
        </Button>
      </div>

      {error && (
        <div className="p-4 border border-error/20 bg-error/5 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-error shrink-0" />
          <p className="text-error text-sm font-medium">{error}</p>
          <Button variant="ghost" size="sm" onClick={fetchQuestions} className="ml-auto text-error hover:bg-error/10">
            Coba Lagi
          </Button>
        </div>
      )}

      {questions.length > 0 && (
        <>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pertanyaan..."
              className="w-full pl-10 pr-10 py-2.5 rounded border border-border bg-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded border border-border bg-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
          >
            <option value="all">Semua Kategori</option>
            {uniqueCategories.map((cat) => {
              const Icon = getCategoryIcon(cat.slug);
              return (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              );
            })}
          </select>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2.5 rounded border border-border bg-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
          >
            <option value="all">Semua Tingkat</option>
            <option value="easy">Mudah</option>
            <option value="medium">Sedang</option>
            <option value="hard">Sulit</option>
          </select>
        </div>
        {(searchQuery || categoryFilter !== "all" || difficultyFilter !== "all") && (
          <p className="text-body-md text-text-muted">
            Menampilkan {filteredQuestions.length} dari {questions.length} pertanyaan
          </p>
        )}
        </>
      )}

      {questions.length === 0 && !error ? (
        <Card className="p-16 text-center border-dashed">
          <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="title-md text-text-primary mb-2">Belum ada pertanyaan</h3>
          <p className="text-body-md text-text-muted mb-8">
            Klik &quot;Tambah Pertanyaan&quot; untuk membuat pertanyaan pertama.
          </p>
          <Button variant="primary" onClick={handleCreate} className="flex items-center gap-2 mx-auto">
            <Plus className="w-5 h-5" />
            Tambah Pertanyaan
          </Button>
        </Card>
      ) : (
        filteredQuestions.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="w-8 h-8 text-text-muted mx-auto mb-4" />
            <h3 className="title-md text-text-primary mb-2">Tidak ada hasil</h3>
            <p className="text-body-md text-text-muted">
              Tidak ada pertanyaan yang cocok dengan filter Anda.
            </p>
          </Card>
        ) : (
        <Card className="p-0 border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface-container">
                  <th className="px-6 py-4 label-sm text-text-subtle uppercase tracking-wider">Pertanyaan</th>
                  <th className="px-6 py-4 label-sm text-text-subtle uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 label-sm text-text-subtle uppercase tracking-wider">Tingkat</th>
                  <th className="px-6 py-4 label-sm text-text-subtle uppercase tracking-wider">Jawaban</th>
                  <th className="px-6 py-4 label-sm text-text-subtle uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-text-primary max-w-md truncate">
                        {q.question}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-2 text-sm text-text-primary">
                        {(() => {
                          const Icon = getCategoryIcon(q.category.slug);
                          return <Icon className="w-4 h-4 text-primary" />;
                        })()}
                        {q.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="mono-xs px-2 py-1 bg-surface-container text-text-primary rounded">
                        {difficultyLabel(q.difficulty)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded border border-border text-text-primary text-xs font-bold bg-surface">
                        {String.fromCharCode(65 + q.correctAnswer)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEdit(q)}
                          className="text-text-muted hover:text-text-primary transition-colors p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded"
                          title="Edit"
                          aria-label={`Edit pertanyaan: ${q.question.slice(0, 40)}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(q)}
                          className="text-text-muted hover:text-error transition-colors p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-1 rounded"
                          title="Hapus"
                          aria-label={`Hapus pertanyaan: ${q.question.slice(0, 40)}`}
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
      ))}
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
      isOpen={!!deleteTarget}
      onClose={() => setDeleteTarget(null)}
      onConfirm={handleDeleteConfirm}
      questionText={deleteTarget?.question ?? ""}
      loading={deleteLoading}
    />

    </>
  );
}
