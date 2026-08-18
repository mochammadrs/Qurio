"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { QuestionCard } from "@/components/game/QuestionCard";
import { useQuizEngine } from "@/hooks/useQuizEngine";
import { useGame } from "@/context/GameContext";
import { Category } from "@/context/types";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

const categoryLabels: Record<Category, string> = {
  agama: "Agama",
  sejarah: "Sejarah",
  umum: "Pengetahuan Umum",
  geografi: "Geografi",
  "bahasa-sastra": "Bahasa & Sastra",
  olahraga: "Olahraga",
};

export default function PlayPage() {
  const router = useRouter();
  const { category, saveError, startGame } = useGame();
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    selectedAnswer,
    isAnswerSubmitted,
    isGameActive,
    isGameFinished,
    timeLeft,
    questionDuration,
    handleSelectAnswer,
    getAnswerFeedback,
  } = useQuizEngine();

  useEffect(() => {
    if (isGameFinished) {
      router.push("/result");
    }
  }, [isGameFinished, router]);

  useEffect(() => {
    if (!isGameActive && !isGameFinished && !saveError && !category) {
      router.push("/");
    }
  }, [isGameActive, isGameFinished, saveError, category, router]);

  if (saveError && !isGameActive && !isGameFinished) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center border border-border bg-surface-card p-8">
            <AlertTriangle className="w-10 h-10 text-error mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="headline-md text-text-primary mb-2">Gagal Memuat Soal</h2>
            <p className="text-body-md text-text-secondary mb-6">{saveError}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  if (category) {
                    startGame(category);
                  }
                }}
                className="flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Coba Lagi
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push("/")}
                className="flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Kembali
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-muted">Memuat pertanyaan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-start pt-8 pb-12 px-6 max-w-3xl mx-auto w-full">
        <div className="w-full mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="label-sm text-text-secondary uppercase tracking-wider">
              Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}
            </span>
            <span className="label-sm text-primary font-bold">
              Kategori: {category ? categoryLabels[category] : ""}
            </span>
          </div>
          <div className="h-2 w-full bg-surface-low rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-in-out"
              style={{
                width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="w-full mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="label-sm text-text-secondary uppercase tracking-wider">
              Waktu
            </span>
            <span
              className={`label-sm font-bold ${
                timeLeft <= 3
                  ? "text-error"
                  : timeLeft <= Math.ceil(questionDuration * 0.4)
                    ? "text-primary"
                    : "text-text-secondary"
              }`}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="h-1.5 w-full bg-surface-low rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                timeLeft <= 3
                  ? "bg-error"
                  : timeLeft <= Math.ceil(questionDuration * 0.4)
                    ? "bg-primary"
                    : "bg-success-leaf"
              }`}
              style={{
                width: `${(timeLeft / questionDuration) * 100}%`,
              }}
            />
          </div>
        </div>

        <QuestionCard
          question={currentQuestion.question}
          options={currentQuestion.options}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          onSelectAnswer={handleSelectAnswer}
          selectedAnswer={selectedAnswer}
          getAnswerFeedback={getAnswerFeedback}
          isAnswerSubmitted={isAnswerSubmitted}
        />
      </main>
    </div>
  );
}
