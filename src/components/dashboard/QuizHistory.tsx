"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QuizResult, GradeBadge } from "@/components/dashboard/Statistics";
import { Trophy, ChevronDown, ChevronUp, Calendar } from "lucide-react";

interface QuizHistoryProps {
  history: QuizResult[];
}

type SortOrder = "newest" | "oldest";

export function QuizHistory({ history }: QuizHistoryProps) {
  const sorted = [...history].sort((a, b) => {
    const diff = new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    return diff;
  });

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="p-6" aria-label="Riwayat kuis">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-gray-900">Riwayat Kuis</h3>
        </div>
        <span className="text-sm text-gray-500">
          {history.length} kuis diselesaikan
        </span>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">Belum ada riwayat kuis</p>
          <p className="text-sm text-gray-400 mt-1">
            Selesaikan kuis pertama untuk melihat statistikmu!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((result, index) => (
            <div
              key={result.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
              aria-label={`Kuis ${result.category}: ${result.score}/${result.totalQuestions} benar, grade ${result.grade}`}
            >
              <div className="flex items-center justify-center w-8 text-sm font-bold text-gray-400 shrink-0">
                #{index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {result.category}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(result.completedAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {result.score}/{result.totalQuestions}
                  </p>
                  <p className="text-xs text-gray-500">{result.percentage}%</p>
                </div>
                <GradeBadge grade={result.grade} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
