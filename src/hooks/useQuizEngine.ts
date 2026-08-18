import { useState, useCallback, useEffect, useRef } from "react";
import { useGame } from "@/context/GameContext";
import { Question } from "@/context/types";
import { useSoundEffects } from "./useSoundEffects";

const DIFFICULTY_DURATION: Record<string, number> = {
  easy: 30,
  medium: 20,
  hard: 15,
};

const DEFAULT_DURATION = 20;
const ADVANCE_DELAY = 1500;
const TIMEOUT_ADVANCE_DELAY = 800;
const TIMEOUT_ANSWER = -1;

function getDuration(difficulty?: string): number {
  if (difficulty && DIFFICULTY_DURATION[difficulty] !== undefined) {
    return DIFFICULTY_DURATION[difficulty];
  }
  return DEFAULT_DURATION;
}

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
  const [timeLeft, setTimeLeft] = useState(0);

  const currentQuestion: Question | null =
    questions.length > 0 ? questions[currentQuestionIndex] : null;

  const questionDuration = currentQuestion
    ? getDuration(currentQuestion.difficulty)
    : DEFAULT_DURATION;

  // Reset state when question index changes (conditional logic, not in effect)
  if (currentQuestionIndex !== lastQuestionIndex) {
    if (selectedAnswer !== null || isAnswerSubmitted || showFeedback) {
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setShowFeedback(false);
    }
    setTimeLeft(questionDuration);
    setLastQuestionIndex(currentQuestionIndex);
  }

  const timeoutHandlerRef = useRef<() => void>(() => {});
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleAdvance = useCallback(
    (delay: number) => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = setTimeout(() => {
        nextQuestion();
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
        setShowFeedback(false);
      }, delay);
    },
    [nextQuestion],
  );

  // Handle waktu habis: submit sebagai jawaban salah lalu lanjut
  const handleTimeout = useCallback(() => {
    if (isAnswerSubmitted || !currentQuestion) return;

    setIsAnswerSubmitted(true);
    setShowFeedback(true);
    setSelectedAnswer(TIMEOUT_ANSWER);

    submitAnswer(TIMEOUT_ANSWER, questionDuration);
    playWrongSound();

    scheduleAdvance(TIMEOUT_ADVANCE_DELAY);
  }, [
    isAnswerSubmitted,
    currentQuestion,
    submitAnswer,
    questionDuration,
    playWrongSound,
    scheduleAdvance,
  ]);

  timeoutHandlerRef.current = handleTimeout;

  // Countdown interval — berjalan saat game aktif dan belum dijawab
  useEffect(() => {
    if (!isGameActive || isAnswerSubmitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return prev;
        if (prev === 1) {
          timeoutHandlerRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameActive, isAnswerSubmitted]);

  // Cleanup advance timer saat unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  /**
   * Handle answer selection
   */
  const handleSelectAnswer = useCallback(
    (answerIndex: number) => {
      if (isAnswerSubmitted) return; // Prevent multiple selections

      playClickSound();

      const spent = questionDuration - timeLeft;
      setSelectedAnswer(answerIndex);
      setIsAnswerSubmitted(true);
      setShowFeedback(true);

      // Submit answer to context
      submitAnswer(answerIndex, spent);

      // Check if answer is correct and play appropriate sound
      if (currentQuestion && answerIndex === currentQuestion.correctAnswer) {
        playCorrectSound();
      } else {
        playWrongSound();
      }

      scheduleAdvance(ADVANCE_DELAY);
    },
    [
      isAnswerSubmitted,
      submitAnswer,
      currentQuestion,
      questionDuration,
      timeLeft,
      playClickSound,
      playCorrectSound,
      playWrongSound,
      scheduleAdvance,
    ],
  );

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
  const getAnswerFeedback = useCallback(
    (optionIndex: number) => {
      if (!showFeedback || selectedAnswer === null) return "default";

      if (!currentQuestion) return "default";

      // Show correct answer in green
      if (optionIndex === currentQuestion.correctAnswer) return "correct";

      // Show selected wrong answer in red
      if (optionIndex === selectedAnswer && !isCorrectAnswer()) return "wrong";

      return "default";
    },
    [showFeedback, selectedAnswer, currentQuestion, isCorrectAnswer],
  );

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
    timeLeft,
    questionDuration,
    handleSelectAnswer,
    isCorrectAnswer,
    getAnswerFeedback,
    answeredCount: answers.length,
  };
}