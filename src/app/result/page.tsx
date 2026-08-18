"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { RotateCcw, LayoutDashboard, LogIn, Share2 } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { AnswerReview } from "@/components/game/AnswerReview";
import { Category } from "@/context/types";
import { useSession } from "next-auth/react";

const categoryLabels: Record<Category, string> = {
  agama: "Agama Islam",
  sejarah: "Sejarah Nusantara",
  umum: "Pengetahuan Umum",
  geografi: "Geografi",
  "bahasa-sastra": "Bahasa & Sastra Indonesia",
  olahraga: "Olahraga",
};

export default function ResultPage() {
  const router = useRouter();
  const { isGameFinished, getResult, resetGame, category, saveError, questions, answers } = useGame();
  const { data: session } = useSession();

  useEffect(() => {
    if (!isGameFinished) {
      router.push("/");
    }
  }, [isGameFinished, router]);

  if (!isGameFinished) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-muted">Memuat...</p>
        </div>
      </div>
    );
  }

  const result = getResult();
  const { score, totalQuestions, percentage, grade } = result;
  const maxScore = totalQuestions * 10;
  const isGuest = !session?.user;

  const handlePlayAgain = () => {
    resetGame();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="max-w-3xl w-full mx-auto flex flex-col items-center text-center gap-8">
        <div className="space-y-2">
          <p className="label-sm text-text-muted uppercase tracking-wider">
            Hasil Kuis
          </p>
          <h1 className="headline-lg text-text-primary">
            {category ? categoryLabels[category] : "Kuis"}
          </h1>
        </div>

        <div className="relative w-full max-w-sm mx-auto aspect-square flex flex-col items-center justify-center rounded-full border border-border bg-surface">
          <div className="absolute inset-4 rounded-full border border-border/50" />
          <div className="absolute inset-8 rounded-full border border-border/50" />
          <div className="z-10 flex flex-col items-center gap-2">
            <span className="text-display-lg text-primary">{score}</span>
            <div className="h-px w-12 bg-border" />
            <span className="title-md text-text-secondary">{maxScore}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto">
          <div className="flex flex-col items-center p-4 border border-border rounded-lg bg-surface-low">
            <span className="label-sm text-text-muted mb-1">Grade</span>
            <span className="headline-lg text-text-primary">{grade}</span>
          </div>
          <div className="flex flex-col items-center p-4 border border-border rounded-lg bg-surface-low">
            <span className="label-sm text-text-muted mb-1">Akurasi</span>
            <span className="headline-lg text-text-primary">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>

        {isGuest && (
          <div className="w-full max-w-sm mx-auto border border-border bg-surface-low p-4 text-center">
            <p className="text-body-md text-text-secondary mb-3">
              Masuk untuk menyimpan skor dan melihat riwayat kuis Anda.
            </p>
            <Button
              size="sm"
              onClick={() => router.push("/login")}
              className="inline-flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Masuk Sekarang
            </Button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mx-auto pt-6 border-t border-border">
          <Button
            onClick={handlePlayAgain}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Main Lagi
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push("/dashboard")}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              const text = `Skor Qurio: ${score}/${maxScore} (${Math.round(percentage)}%, Grade ${grade})`;
              if (navigator.share) {
                await navigator.share({ title: "Hasil Qurio", text });
              } else {
                await navigator.clipboard.writeText(text);
              }
            }}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Bagikan
          </Button>
        </div>

        <AnswerReview questions={questions} answers={answers} />
      </div>
    </div>
  );
}
