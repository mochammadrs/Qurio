"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { X, AlertCircle } from "lucide-react";

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={mode === "create" ? "Tambah pertanyaan" : "Edit pertanyaan"}
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === "create" ? "Tambah Pertanyaan" : "Edit Pertanyaan"}
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
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={fetchingCategories || submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <option value="">
                {fetchingCategories ? "Memuat kategori..." : "Pilih kategori"}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="question" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Pertanyaan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Masukkan pertanyaan..."
              rows={3}
              maxLength={charLimit}
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-none transition-all"
            />
            <div className="flex justify-end mt-1">
              <span
                className={`text-xs ${charCount > charLimit * 0.9 ? "text-red-500 font-semibold" : "text-gray-400"}`}
              >
                {charCount}/{charLimit}
              </span>
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="block text-sm font-semibold text-gray-700 mb-1.5">
              Opsi Jawaban <span className="text-red-500">*</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OPTION_LABELS.map((label, i) => (
                <div key={i}>
                  <label
                    htmlFor={`option-${i}`}
                    className="block text-xs font-medium text-gray-500 mb-1"
                  >
                    Opsi {label}
                  </label>
                  <input
                    id={`option-${i}`}
                    type="text"
                    value={options[i]}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`Jawaban ${label}`}
                    disabled={submitting}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="block text-sm font-semibold text-gray-700 mb-2">
              Jawaban Benar <span className="text-red-500">*</span>
            </legend>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Pilih jawaban benar">
              {OPTION_LABELS.map((label, i) => (
                <label
                  key={i}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 cursor-pointer transition-all font-bold text-sm ${
                    correctAnswer === i
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
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
            <label htmlFor="difficulty" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Tingkat Kesulitan <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
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
