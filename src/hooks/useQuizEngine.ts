import { useState, useCallback } from "react";
import { useGame } from "@/context/GameContext";
import { Question } from "@/context/types";
import { useSoundEffects } from "./useSoundEffects";

/**
 * Custom hook untuk quiz engine logic
 * Menangani interaksi user dengan soal & validasi jawaban
 */
export function useQuizEngine() {
  const {
    questions,
    currentQuestionIndex,
    score,
    answers,
    isGameActive,
    isGameFinished,
    submitAnswer,
    nextQuestion,
  } = useGame();

  const { playCorrectSound, playWrongSound, playClickSound } = useSoundEffects();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastQuestionIndex, setLastQuestionIndex] = useState(-1);

  const currentQuestion: Question | null = 
    questions.length > 0 ? questions[currentQuestionIndex] : null;

  // Reset state when question index changes (conditional logic, not in effect)
  if (currentQuestionIndex !== lastQuestionIndex) {
    if (selectedAnswer !== null || isAnswerSubmitted || showFeedback) {
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setShowFeedback(false);
    }
    setLastQuestionIndex(currentQuestionIndex);
  }

  /**
   * Handle answer selection
   */
  const handleSelectAnswer = useCallback((answerIndex: number) => {
    if (isAnswerSubmitted) return; // Prevent multiple selections

    // Play click sound
    playClickSound();

    setSelectedAnswer(answerIndex);
    setIsAnswerSubmitted(true);
    setShowFeedback(true);

    // Submit answer to context
    submitAnswer(answerIndex);

    // Check if answer is correct and play appropriate sound
    if (currentQuestion && answerIndex === currentQuestion.correctAnswer) {
      playCorrectSound();
    } else {
      playWrongSound();
    }

    // Auto advance to next question after delay
    setTimeout(() => {
      nextQuestion();
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setShowFeedback(false);
    }, 1500); // 1.5 second delay
  }, [isAnswerSubmitted, submitAnswer, nextQuestion, currentQuestion, playClickSound, playCorrectSound, playWrongSound]);

  /**
   * Check if selected answer is correct
   */
  const isCorrectAnswer = useCallback(() => {
    if (!currentQuestion || selectedAnswer === null) return null;
    return selectedAnswer === currentQuestion.correctAnswer;
  }, [currentQuestion, selectedAnswer]);

  /**
   * Get feedback color for selected answer
   */
  const getAnswerFeedback = useCallback((optionIndex: number) => {
    if (!showFeedback || selectedAnswer === null) return "default";
    
    if (!currentQuestion) return "default";

    // Show correct answer in green
    if (optionIndex === currentQuestion.correctAnswer) return "correct";
    
    // Show selected wrong answer in red
    if (optionIndex === selectedAnswer && !isCorrectAnswer()) return "wrong";
    
    return "default";
  }, [showFeedback, selectedAnswer, currentQuestion, isCorrectAnswer]);

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: questions.length,
    score,
    selectedAnswer,
    isAnswerSubmitted,
    showFeedback,
    isGameActive,
    isGameFinished,
    handleSelectAnswer,
    isCorrectAnswer,
    getAnswerFeedback,
    answeredCount: answers.length,
  };
}
