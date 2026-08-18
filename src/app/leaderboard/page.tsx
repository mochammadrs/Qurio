"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Trophy } from "lucide-react";
import { getCategoryIcon } from "@/utils/category-icons";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

interface LeaderboardEntry {
  id: string;
  user: { name: string | null; image: string | null };
  category: { name: string; slug: string };
  score: number;
  percentage: number;
  grade: string;
  completedAt: string;
}

interface LeaderboardResponse {
  topScores: LeaderboardEntry[];
  perfectScores: LeaderboardEntry[];
  userRank: {
    rank: number;
    score: number;
    percentage: number;
    grade: string;
  } | null;
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        if (!res.ok) throw new Error("Gagal memuat leaderboard");
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "border-success-leaf bg-success-leaf/10 text-success-leaf";
      case "B":
        return "border-primary bg-primary/10 text-primary";
      default:
        return "border-error bg-error/10 text-error";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-muted">Memuat leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center border border-border bg-surface-card p-8">
            <Trophy className="w-10 h-10 text-error mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="headline-md text-text-primary mb-2">Gagal Memuat Leaderboard</h2>
            <p className="text-body-md text-text-secondary mb-6">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />
      <main className="flex-grow w-full max-w-container mx-auto px-6 lg:px-8 py-12 flex flex-col gap-12">
        <section className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-display-lg text-text-primary">Leaderboard</h1>
          <p className="text-body-lg text-text-secondary">
            Lihat peringkat pemain teratas dan bandingkan skor Anda.
          </p>
        </section>

        {data?.userRank && (
          <section className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-primary" />
                <div>
                  <p className="label-sm text-text-muted">Peringkat Anda</p>
                  <p className="text-headline-md text-text-primary">#{data.userRank.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="label-sm text-text-muted">Skor Terbaik</p>
                <p className="text-headline-md text-text-primary">{data.userRank.score}</p>
                <p className="text-sm text-text-secondary">
                  {data.userRank.percentage}% · Grade {data.userRank.grade}
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="title-md text-text-primary">Top 10 Skor Tertinggi</h2>
          <div className="grid gap-4">
            {data?.topScores.map((entry, idx) => (
              <Card key={entry.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${idx === 0 ? "border-amber-400 bg-amber-400/10" : idx === 1 ? "border-gray-400 bg-gray-400/10" : idx === 2 ? "border-amber-600 bg-amber-600/10" : "border-border bg-surface-low"} text-headline-lg font-bold ${idx <= 2 ? "text-primary" : "text-text-secondary"}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="title-md text-text-primary truncate">{entry.user.name || "Anonymous"}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full mono-xs ${getGradeColor(entry.grade)}`}>
                        {entry.grade}
                      </span>
                    </div>
                    <p className="text-body-md text-text-secondary flex items-center gap-1">
                      {(() => {
                        const Icon = getCategoryIcon(entry.category.slug);
                        return <Icon className="w-4 h-4 text-primary" />;
                      })()} {entry.category.name}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-display-lg text-text-primary font-bold">{entry.score}</p>
                  <p className="text-sm text-text-muted">{formatDate(entry.completedAt)}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {data?.perfectScores.length && (
          <section className="space-y-4 border-t border-border pt-8">
            <h2 className="title-md text-text-primary flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              Skor Sempurna (100%)
            </h2>
            <div className="grid gap-4">
              {data.perfectScores.map((entry, idx) => (
                <Card key={entry.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 bg-amber-400/5 border-amber-400/20">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-amber-400 bg-amber-400/10 text-headline-lg font-bold text-amber-600">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="title-md text-text-primary truncate">{entry.user.name || "Anonymous"}</p>
                      <p className="text-body-md text-text-secondary flex items-center gap-1">
                        {(() => {
                          const Icon = getCategoryIcon(entry.category.slug);
                          return <Icon className="w-4 h-4 text-primary" />;
                        })()} {entry.category.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-display-lg text-text-primary font-bold">{entry.score}</p>
                    <p className="text-sm text-text-muted">{formatDate(entry.completedAt)}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}