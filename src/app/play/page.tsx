"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { QuestionCard } from "@/components/game/QuestionCard";
import { ScoreBoard } from "@/components/game/ScoreBoard";
import { useQuizEngine } from "@/hooks/useQuizEngine";

export default function PlayPage() {
  const router = useRouter();
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    score,
    selectedAnswer,
    isAnswerSubmitted,
    isGameActive,
    isGameFinished,
    handleSelectAnswer,
    getAnswerFeedback,
  } = useQuizEngine();

  // Redirect to home if no active game
  useEffect(() => {
    if (!isGameActive && !isGameFinished) {
      router.push("/");
    }
  }, [isGameActive, isGameFinished, router]);

  // Redirect to result when game finished
  useEffect(() => {
    if (isGameFinished) {
      router.push("/result");
    }
  }, [isGameFinished, router]);

  // Show loading if no question
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-400 border-b-transparent rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="text-lg font-semibold text-gray-700 animate-pulse">Memuat Pertanyaan...</p>
          <p className="text-sm text-gray-500 mt-2">Siapkan dirimu! 🎯</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple-200/30 rounded-full blur-3xl animate-float-slow" />
      </div>
      
      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - ScoreBoard */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ScoreBoard score={score} totalQuestions={totalQuestions} />
            </div>
          </div>

          {/* Main Content - Question */}
          <div className="lg:col-span-3">
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
          </div>
        </div>
      </main>
    </div>
  );
}

