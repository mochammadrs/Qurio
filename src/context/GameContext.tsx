"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { GameState, Category, UserAnswer, GameResult, Question } from "./types";
import { shuffleQuestions, shuffleQuestionOptions } from "@/utils/shuffle";

interface GameContextType extends GameState {
  startGame: (category: Category) => void;
  submitAnswer: (answerIndex: number, timeSpent?: number) => void;
  nextQuestion: () => void;
  resetGame: () => void;
  getResult: () => GameResult;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialState: GameState = {
  category: null,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  answers: [],
  isGameActive: false,
  isGameFinished: false,
  isSavingScore: false,
  saveError: null,
  categoryId: null,
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialState);

  /**
   * Start new game dengan kategori yang dipilih
   */
  const startGame = useCallback((category: Category) => {
    setGameState({
      category,
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      answers: [],
      isGameActive: true,
      isGameFinished: false,
      isSavingScore: false,
      saveError: null,
      categoryId: null,
    });

    (async () => {
      try {
        const res = await fetch(`/api/questions?category=${category}`);
        if (!res.ok) {
          const errText = await res.text();
          console.error("Fetch failed:", res.status, errText);
          throw new Error("Failed to fetch questions");
        }
        
        const data = await res.json();
        const categoryQuestions: Question[] = data.questions;
        
        if (!categoryQuestions || categoryQuestions.length === 0) {
          throw new Error("No questions found for this category");
        }
        
        const shuffled = shuffleQuestions(categoryQuestions);
        
        const limitedQuestions = shuffled.slice(0, 10);
        
        const questionsWithShuffledOptions = limitedQuestions.map(q => shuffleQuestionOptions(q));
        
        setGameState((prev) => ({
          ...prev,
          questions: questionsWithShuffledOptions,
        }));

        fetch("/api/categories")
          .then((res) => res.json())
          .then((data) => {
            const found = data.categories?.find(
              (c: { slug: string }) => c.slug === category,
            );
            if (found) {
              setGameState((prev) => ({ ...prev, categoryId: found.id }));
            }
          })
          .catch(() => {});
      } catch (error) {
        console.error("Error starting game:", error);
        setGameState((prev) => ({
          ...prev,
          saveError: "Gagal memuat soal. Silakan coba lagi.",
          isGameActive: false,
          questions: [],
        }));
      }
    })();
  }, []);

  /**
   * Submit jawaban user
   */
  const submitAnswer = useCallback((answerIndex: number, timeSpent?: number) => {
    if (!gameState.isGameActive || gameState.isGameFinished) return;

    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      isCorrect,
      timeSpent,
    };

    setGameState((prev) => ({
      ...prev,
      score: isCorrect ? prev.score + 10 : prev.score,
      answers: [...prev.answers, userAnswer],
    }));
  }, [gameState.isGameActive, gameState.isGameFinished, gameState.questions, gameState.currentQuestionIndex]);

  const saveScoreToDatabase = useCallback(async () => {
    const { categoryId, questions, answers } = gameState;
    if (!categoryId) return;

    setGameState((prev) => ({ ...prev, isSavingScore: true, saveError: null }));

    const totalQuestions = questions.length;

    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          totalQuestions,
          answers: answers.map((a) => ({
            questionId: a.questionId,
            selectedAnswer: a.selectedAnswer,
            timeSpent: a.timeSpent,
          })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setGameState((prev) => ({
          ...prev,
          isSavingScore: false,
          saveError: errorData.error || "Gagal menyimpan skor",
        }));
        return;
      }

      setGameState((prev) => ({ ...prev, isSavingScore: false }));
    } catch {
      setGameState((prev) => ({
        ...prev,
        isSavingScore: false,
        saveError: "Gagal menyimpan skor",
      }));
    }
  }, [gameState]);

  const nextQuestion = useCallback(() => {
    if (!gameState.isGameActive) return;

    const isLastQuestion = gameState.currentQuestionIndex >= gameState.questions.length - 1;

    if (isLastQuestion) {
      setGameState((prev) => ({
        ...prev,
        isGameActive: false,
        isGameFinished: true,
      }));

      saveScoreToDatabase();
    } else {
      setGameState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  }, [gameState.isGameActive, gameState.currentQuestionIndex, gameState.questions.length, saveScoreToDatabase]);

  /**
   * Reset game to initial state
   */
  const resetGame = useCallback(() => {
    setGameState(initialState);
  }, []);

  /**
   * Get game result
   */
  const getResult = useCallback((): GameResult => {
    const totalQuestions = gameState.questions.length;
    const correctAnswers = gameState.answers.filter((a) => a.isCorrect).length;
    const wrongAnswers = totalQuestions - correctAnswers;
    const percentage = (gameState.score / (totalQuestions * 10)) * 100;

    let grade: "A" | "B" | "C";
    if (percentage >= 80) grade = "A";
    else if (percentage >= 60) grade = "B";
    else grade = "C";

    return {
      score: gameState.score,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      percentage,
      grade,
      category: gameState.category || "umum",
    };
  }, [gameState]);

  const value: GameContextType = {
    ...gameState,
    startGame,
    submitAnswer,
    nextQuestion,
    resetGame,
    getResult,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

/**
 * Custom hook untuk menggunakan GameContext
 */
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("use Game must be used within a GameProvider");
  }
  return context;
}
