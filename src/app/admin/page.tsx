"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import {
  Users,
  BookOpen,
  Trophy,
  TrendingUp,
  FolderOpen,
  BarChart3,
} from "lucide-react";
import { getCategoryIcon } from "@/utils/category-icons";

interface CategoryBreakdown {
  id: string;
  name: string;
  slug: string;
  questionCount: number;
  gameCount: number;
  avgPercentage: number;
}

interface RecentScore {
  id: string;
  userName: string;
  userImage: string | null;
  categoryName: string;
  categorySlug: string;
  score: number;
  percentage: number;
  grade: string;
  completedAt: string;
}

interface Stats {
  totals: {
    users: number;
    questions: number;
    games: number;
    avgScore: number;
    avgPercentage: number;
  };
  gradeDistribution: Record<string, number>;
  categoryBreakdown: CategoryBreakdown[];
  recentScores: RecentScore[];
}

const GRADE_COLORS: Record<string, string> = {
  A: "bg-emerald-500",
  B: "bg-primary",
  C: "bg-amber-500",
  D: "bg-orange-500",
  F: "bg-danger-rose",
};

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <Card className="flex items-center gap-4">
      <div
        className={"w-12 h-12 rounded-lg flex items-center justify-center " + accent}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-headline-md text-text-primary">{value}</p>
        <p className="label-sm text-text-muted">{label}</p>
      </div>
    </Card>
  );
}

export default function AdminIndexPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat statistik");
        return res.json();
      })
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-body-md text-error">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const maxGameCount = Math.max(
    1,
    ...stats.categoryBreakdown.map((c) => c.gameCount),
  );
  const maxGradeCount = Math.max(
    1,
    ...Object.values(stats.gradeDistribution),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-headline-lg text-text-primary mb-2">
            Dashboard Admin
          </h1>
          <p className="text-body-md text-text-muted">
            Ringkasan aktivitas platform Qurio.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 label-sm text-primary hover:opacity-80 transition-opacity"
          >
            <FolderOpen className="w-4 h-4" />
            Kelola Kategori
          </Link>
          <Link
            href="/admin/questions"
            className="inline-flex items-center gap-2 label-sm text-primary hover:opacity-80 transition-opacity"
          >
            <BookOpen className="w-4 h-4" />
            Kelola Pertanyaan
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Pengguna"
          value={stats.totals.users}
          accent="bg-primary/10 text-primary"
        />
        <StatCard
          icon={BookOpen}
          label="Total Soal"
          value={stats.totals.questions}
          accent="bg-emerald-500/10 text-emerald-600"
        />
        <StatCard
          icon={Trophy}
          label="Total Permainan"
          value={stats.totals.games}
          accent="bg-amber-500/10 text-amber-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Rata-rata Skor"
          value={`${stats.totals.avgPercentage}%`}
          accent="bg-secondary/10 text-secondary"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="title-md text-text-primary mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Statistik per Kategori
          </h2>
          <div className="space-y-3">
            {stats.categoryBreakdown.map((cat) => (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center justify-between label-sm">
                  <span className="text-text-primary">
                    {(() => {
                      const Icon = getCategoryIcon(cat.slug);
                      return <Icon className="w-4 h-4 inline text-primary" />;
                    })()} {cat.name}
                  </span>
                  <span className="text-text-muted">
                    {cat.questionCount} soal · {cat.gameCount} main ·{" "}
                    {cat.avgPercentage}%
                  </span>
                </div>
                <div className="h-2 bg-surface-low rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${(cat.gameCount / maxGameCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="title-md text-text-primary mb-4">
            Distribusi Grade
          </h2>
          <div className="space-y-3">
            {["A", "B", "C", "D", "F"].map((grade) => {
              const count = stats.gradeDistribution[grade] ?? 0;
              return (
                <div key={grade} className="flex items-center gap-3">
                  <span className="label-sm w-6 text-text-primary font-semibold">
                    {grade}
                  </span>
                  <div className="flex-1 h-6 bg-surface-low rounded-full overflow-hidden">
                    <div
                      className={
                        "h-full rounded-full transition-all " +
                        (GRADE_COLORS[grade] ?? "bg-gray-400")
                      }
                      style={{
                        width: `${(count / maxGradeCount) * 100}%`,
                        minWidth: count > 0 ? "24px" : "0",
                      }}
                    />
                  </div>
                  <span className="label-sm text-text-muted w-10 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="title-md text-text-primary mb-4">Aktivitas Terbaru</h2>
        {stats.recentScores.length === 0 ? (
          <p className="text-body-md text-text-muted py-4 text-center">
            Belum ada aktivitas.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left label-sm text-text-muted py-2 pr-4">
                    Pengguna
                  </th>
                  <th className="text-left label-sm text-text-muted py-2 pr-4">
                    Kategori
                  </th>
                  <th className="text-right label-sm text-text-muted py-2 pr-4">
                    Skor
                  </th>
                  <th className="text-right label-sm text-text-muted py-2 pr-4">
                    Persentase
                  </th>
                  <th className="text-center label-sm text-text-muted py-2 pr-4">
                    Grade
                  </th>
                  <th className="text-right label-sm text-text-muted py-2">
                    Waktu
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentScores.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-border-subtle last:border-0"
                  >
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        {s.userImage ? (
                          <img
                            src={s.userImage}
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center">
                            <span className="text-xs text-text-muted">
                              {s.userName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="label-sm text-text-primary truncate max-w-[140px]">
                          {s.userName}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="label-sm text-text-secondary inline-flex items-center gap-1.5">
                        {(() => {
                          const Icon = getCategoryIcon(s.categorySlug);
                          return <Icon className="w-3.5 h-3.5 text-primary" />;
                        })()}
                        {s.categoryName}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-right">
                      <span className="label-sm text-text-primary font-medium">
                        {s.score}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-right">
                      <span className="label-sm text-text-secondary">
                        {s.percentage}%
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-center">
                      <span
                        className={
                          "inline-block w-7 h-7 leading-7 text-center rounded-full label-sm font-semibold text-white " +
                          (GRADE_COLORS[s.grade] ?? "bg-gray-400")
                        }
                      >
                        {s.grade}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="label-sm text-text-muted">
                        {new Date(s.completedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
