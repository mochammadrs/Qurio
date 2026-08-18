"use client";

import { Question, UserAnswer } from "@/context/types";
import { Check, X } from "lucide-react";

interface AnswerReviewProps {
  questions: Question[];
  answers: UserAnswer[];
}

export function AnswerReview({ questions, answers }: AnswerReviewProps) {
  const answerMap = new Map<string, UserAnswer>();
  answers.forEach((a) => answerMap.set(a.questionId, a));

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <section className="w-full max-w-3xl mx-auto mt-8">
      <h2 className="headline-md text-text-primary mb-6">Review Jawaban</h2>
      <div className="flex flex-col gap-4">
        {questions.map((q, idx) => {
          const userAnswer = answerMap.get(q.id);
          const selectedIdx = userAnswer?.selectedAnswer ?? null;
          const isCorrect = userAnswer?.isCorrect ?? false;

          const getOptionClass = (optIdx: number) => {
            if (optIdx === q.correctAnswer) return "border-2 border-success-leaf bg-success-leaf/5";
            if (selectedIdx === optIdx && !isCorrect) return "border-2 border-error bg-error/5";
            return "border border-border bg-surface-card";
          };

          const getBadgeClass = (optIdx: number) => {
            if (optIdx === q.correctAnswer) return "border-success-leaf text-white bg-success-leaf";
            if (selectedIdx === optIdx && !isCorrect) return "border-error text-white bg-error";
            return "border border-border text-text-secondary";
          };

          return (
            <div key={q.id} className="border border-border bg-surface-card rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <span className="mono-xs text-text-muted">{idx + 1}</span>
                <h3 className="text-body-lg text-text-primary flex-1">{q.question}</h3>
                <span
                  className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full label-sm ${
                    isCorrect
                      ? "border-success-leaf text-white bg-success-leaf"
                      : "border-error text-white bg-error"
                  }`}
                >
                  {isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                </span>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                {q.options.map((option, optIdx) => (
                  <div
                    key={optIdx}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${getOptionClass(optIdx)}`}
                  >
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-full label-sm transition-colors ${getBadgeClass(optIdx)}`}
                    >
                      {optionLabels[optIdx]}
                    </span>
                    <span className="text-body-md text-text-primary">{option}</span>
                  </div>
                ))}
              </div>

              {q.explanation && (
                <div className="border-t border-border pt-3">
                  <p className="text-body-md text-text-secondary leading-relaxed">
                    <span className="label-sm text-text-muted font-medium">Penjelasan:</span>{" "}
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
