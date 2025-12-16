/**
 * TypeScript Types & Interfaces untuk Qurio
 */

export type Category = "agama" | "sejarah" | "umum";

export interface Question {
  id: string;
  category: Category;
  question: string;
  options: string[];
  correctAnswer: number; // Index dari options (0-3)
}

export interface GameState {
  category: Category | null;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  answers: UserAnswer[];
  isGameActive: boolean;
  isGameFinished: boolean;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent?: number; // untuk future feature
}

export interface GameResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  grade: "A" | "B" | "C";
  category: Category;
}
