"use client";

import { Card } from "@/components/ui/Card";
import { Trophy, Target, TrendingUp, Award } from "lucide-react";

export interface QuizResult {
  id: string;
  category: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  grade: "A" | "B" | "C";
  completedAt: Date;
}

interface StatisticsProps {
  history: QuizResult[];
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case "A":
      return "text-green-600 bg-green-50 border-green-200";
    case "B":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "C":
      return "text-amber-600 bg-amber-50 border-amber-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function Statistics({ history }: StatisticsProps) {
  const totalGames = history.length;
  const avgScore = totalGames > 0
    ? Math.round(history.reduce((sum, h) => sum + h.percentage, 0) / totalGames)
    : 0;

  const bestScore = totalGames > 0
    ? Math.max(...history.map((h) => h.percentage))
    : 0;

  const bestCategory = totalGames > 0
    ? (() => {
        const categoryScores: Record<string, number[]> = {};
        history.forEach((h) => {
          if (!categoryScores[h.category]) categoryScores[h.category] = [];
          categoryScores[h.category].push(h.percentage);
        });
        const avgByCategory = Object.entries(categoryScores).map(([cat, scores]) => ({
          category: cat,
          avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        }));
        avgByCategory.sort((a, b) => b.avg - a.avg);
        return avgByCategory[0]?.category || "-";
      })()
    : "-";

  const totalCorrect = history.reduce((sum, h) => sum + h.score, 0);
  const totalQuestions = history.reduce((sum, h) => sum + h.totalQuestions, 0);

  const stats = [
    {
      label: "Total Kuis",
      value: totalGames.toString(),
      icon: Trophy,
      color: "from-amber-400 to-orange-500",
      bgColor: "bg-amber-50",
    },
    {
      label: "Rata-rata Skor",
      value: `${avgScore}%`,
      icon: TrendingUp,
      color: "from-blue-400 to-indigo-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "Skor Terbaik",
      value: `${bestScore}%`,
      icon: Award,
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
    },
    {
      label: "Kategori Terbaik",
      value: bestCategory,
      icon: Target,
      color: "from-emerald-400 to-teal-500",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className={`p-5 ${stat.bgColor} border-0`}
            aria-label={`${stat.label}: ${stat.value}`}
          >
            <div className="flex flex-col gap-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}
              >
                <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export function GradeBadge({ grade }: { grade: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold border ${getGradeColor(grade)}`}
      aria-label={`Grade ${grade}`}
    >
      {grade}
    </span>
  );
}
