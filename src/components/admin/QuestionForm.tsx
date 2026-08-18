"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { X, AlertCircle } from "lucide-react";
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
  explanation?: string | null;
}

type FormMode = "create" | "edit";

interface QuestionFormProps {
  mode: FormMode;
  initialData?: Question;
  onSuccess: () => void;
  onCancel: () => void;
}

const DIFFICULTIES = [
  { value: "", label: "Pilih tingkat (opsional)" },
  { value: "easy", label: "Mudah" },
  { value: "medium", label: "Sedang" },
  { value: "hard", label: "Sulit" },
];

const OPTION_LABELS = ["A", "B", "C", "D"];

export function QuestionForm({ mode, initialData, onSuccess, onCancel }: QuestionFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [question, setQuestion] = useState(initialData?.question ?? "");
  const [options, setOptions] = useState<string[]>(
    initialData?.options ?? ["", "", "", ""],
  );
  const [correctAnswer, setCorrectAnswer] = useState<number>(
    initialData?.correctAnswer ?? 0,
  );
  const [difficulty, setDifficulty] = useState(initialData?.difficulty ?? "");
  const [explanation, setExplanation] = useState(initialData?.explanation ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Gagal memuat kategori");
        const data = (await res.json()) as { categories: Category[] };
        setCategories(data.categories);
      } catch {
        setError("Gagal memuat daftar kategori");
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleOptionChange = useCallback((index: number, value: string) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const validate = (): string | null => {
    if (!categoryId) return "Kategori harus dipilih";
    if (!question.trim()) return "Pertanyaan tidak boleh kosong";
    if (question.length > 500) return "Pertanyaan maksimal 500 karakter";
    for (let i = 0; i < 4; i++) {
      if (!options[i].trim()) return `Opsi ${OPTION_LABELS[i]} tidak boleh kosong`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {
        categoryId,
        question: question.trim(),
        options: options.map((o) => o.trim()),
        correctAnswer,
      };
      if (difficulty) body.difficulty = difficulty;
      if (explanation.trim()) body.explanation = explanation.trim();

      const url =
        mode === "create"
          ? "/api/admin/questions"
          : `/api/admin/questions/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || `Gagal ${mode === "create" ? "menambah" : "mengubah"} pertanyaan`);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const charCount = question.length;
  const charLimit = 500;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20"
      role="dialog"
      aria-modal="true"
      aria-label={mode === "create" ? "Tambah pertanyaan" : "Edit pertanyaan"}
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-title-md text-text-primary">
            {mode === "create" ? "Tambah Pertanyaan" : "Edit Pertanyaan"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 hover:bg-surface-container transition-colors rounded-sm"
            aria-label="Tutup form"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded border border-error/20 bg-error/5">
              <AlertCircle className="w-5 h-5 text-error shrink-0" />
              <p className="text-sm text-error font-medium">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="category" className="block label-sm text-text-subtle mb-2">
              Kategori
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={fetchingCategories || submitting}
              className="w-full px-4 py-2.5 rounded border border-border bg-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
            >
              <option value="">
                {fetchingCategories ? "Memuat..." : "Pilih kategori"}
              </option>
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.slug);
                return (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label htmlFor="question" className="block label-sm text-text-subtle mb-2">
              Pertanyaan
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Masukkan pertanyaan..."
              rows={3}
              maxLength={charLimit}
              disabled={submitting}
              className="w-full px-4 py-2.5 rounded border border-border bg-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 resize-none"
            />
            <div className="flex justify-end mt-1">
              <span
                className={`text-xs ${charCount > charLimit * 0.9 ? "text-error" : "text-text-subtle"}`}
              >
                {charCount}/{charLimit}
              </span>
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="block label-sm text-text-subtle mb-3">
              Opsi Jawaban
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {OPTION_LABELS.map((label, i) => (
                <div key={i}>
                  <input
                    type="text"
                    value={options[i]}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`Opsi ${label}`}
                    disabled={submitting}
                    className="w-full px-4 py-2.5 rounded border border-border bg-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="block label-sm text-text-subtle mb-3">
              Jawaban Benar
            </legend>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Pilih jawaban benar">
              {OPTION_LABELS.map((label, i) => (
                <label
                  key={i}
                  className={`flex items-center justify-center w-12 h-12 rounded border cursor-pointer transition-all font-bold text-sm ${
                    correctAnswer === i
                      ? "border-primary bg-surface-container text-primary"
                      : "border-border bg-surface text-text-muted hover:border-text-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="correctAnswer"
                    value={i}
                    checked={correctAnswer === i}
                    onChange={() => setCorrectAnswer(i)}
                    disabled={submitting}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="difficulty" className="block label-sm text-text-subtle mb-2">
              Tingkat Kesulitan
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={submitting}
              className="w-full px-4 py-2.5 rounded border border-border bg-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="explanation" className="block label-sm text-text-subtle mb-2">
              Penjelasan (opsional)
            </label>
            <textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Penjelasan jawaban yang ditampilkan setelah kuis selesai..."
              rows={3}
              maxLength={2000}
              disabled={submitting}
              className="w-full px-4 py-2.5 rounded border border-border bg-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 resize-none"
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${explanation.length > 1800 ? "text-error" : "text-text-subtle"}`}>
                {explanation.length}/2000
              </span>
            </div>
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
