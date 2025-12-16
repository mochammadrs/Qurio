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
    });
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

  /**
   * Next question atau finish game
   */
  const nextQuestion = useCallback(() => {
    if (!gameState.isGameActive) return;

    const isLastQuestion = gameState.currentQuestionIndex >= gameState.questions.length - 1;

    if (isLastQuestion) {
      // Finish game
      setGameState((prev) => ({
        ...prev,
        isGameActive: false,
        isGameFinished: true,
      }));
    } else {
      // Move to next question
      setGameState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  }, [gameState.isGameActive, gameState.currentQuestionIndex, gameState.questions.length]);

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
