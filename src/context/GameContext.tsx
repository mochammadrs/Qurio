"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { GameState, Category, UserAnswer, GameResult } from "./types";
import { getQuestionsByCategory, shuffleQuestions, shuffleQuestionOptions } from "@/data/questions";

interface GameContextType extends GameState {
  startGame: (category: Category) => void;
  submitAnswer: (answerIndex: number) => void;
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
    // Get questions for selected category
    const categoryQuestions = getQuestionsByCategory(category);
    
    // Shuffle questions
    const shuffled = shuffleQuestions(categoryQuestions);
    
    // Take only 10 questions per game
    const limitedQuestions = shuffled.slice(0, 10);
    
    // Shuffle options untuk setiap soal
    const questionsWithShuffledOptions = limitedQuestions.map(q => shuffleQuestionOptions(q));
    
    setGameState({
      category,
      questions: questionsWithShuffledOptions,
      currentQuestionIndex: 0,
      score: 0,
      answers: [],
      isGameActive: true,
      isGameFinished: false,
      isSavingScore: false,
      saveError: null,
      categoryId: null,
    });

    // Fetch categoryId untuk score saving (non-blocking)
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
  }, []);

  /**
   * Submit jawaban user
   */
  const submitAnswer = useCallback((answerIndex: number) => {
    if (!gameState.isGameActive || gameState.isGameFinished) return;

    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      isCorrect,
    };

    setGameState((prev) => ({
      ...prev,
      score: isCorrect ? prev.score + 10 : prev.score,
      answers: [...prev.answers, userAnswer],
    }));
  }, [gameState.isGameActive, gameState.isGameFinished, gameState.questions, gameState.currentQuestionIndex]);

  const saveScoreToDatabase = useCallback(async () => {
    const { categoryId, questions, answers, score } = gameState;
    if (!categoryId) return;

    setGameState((prev) => ({ ...prev, isSavingScore: true, saveError: null }));

    const totalQuestions = questions.length;
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const wrongAnswers = totalQuestions - correctAnswers;
    const percentage = (score / (totalQuestions * 10)) * 100;

    let grade: "A" | "B" | "C";
    if (percentage >= 80) grade = "A";
    else if (percentage >= 60) grade = "B";
    else grade = "C";

    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          score,
          totalQuestions,
          correctAnswers,
          wrongAnswers,
          percentage,
          grade,
        }),
      });

      if (!res.ok) {
        setGameState((prev) => ({
          ...prev,
          isSavingScore: false,
          saveError: "Failed to save score",
        }));
        return;
      }

      setGameState((prev) => ({ ...prev, isSavingScore: false }));
    } catch {
      setGameState((prev) => ({
        ...prev,
        isSavingScore: false,
        saveError: "Failed to save score",
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
