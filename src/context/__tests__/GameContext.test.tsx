import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { GameProvider, useGame } from '../GameContext';
import { Category, Question } from '../types';

// Wrapper untuk testing hooks
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GameProvider>{children}</GameProvider>
);

function createMockQuestions(category: Category): Question[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `${category}-${i + 1}`,
    category,
    question: `Soal ${category} ke-${i + 1}`,
    options: ['Opsi A', 'Opsi B', 'Opsi C', 'Opsi D'],
    correctAnswer: 0,
  }));
}

function mockFetchWith(questions: Question[]) {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);

    if (url.includes('/api/questions')) {
      return new Response(JSON.stringify({ questions }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.includes('/api/categories')) {
      return new Response(
        JSON.stringify({
          categories: [
            { id: 'cat-agama', slug: 'agama', name: 'Agama' },
            { id: 'cat-sejarah', slug: 'sejarah', name: 'Sejarah' },
            { id: 'cat-umum', slug: 'umum', name: 'Pengetahuan Umum' },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (url.includes('/api/scores')) {
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({}), { status: 404 });
  });
}

describe('GameContext', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetchWith(createMockQuestions('agama')));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('startGame', () => {
    it('should start game dengan kategori yang dipilih', async () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.startGame('agama');
      });

      await waitFor(() => expect(result.current.questions).toHaveLength(10));

      expect(result.current.category).toBe('agama');
      expect(result.current.isGameActive).toBe(true);
      expect(result.current.isGameFinished).toBe(false);
      expect(result.current.score).toBe(0);
    });

    it('should memuat 10 soal untuk setiap kategori', async () => {
      const categories: Category[] = ['agama', 'sejarah', 'umum'];
      const { result } = renderHook(() => useGame(), { wrapper });

      for (const category of categories) {
        vi.stubGlobal('fetch', mockFetchWith(createMockQuestions(category)));

        act(() => {
          result.current.resetGame();
          result.current.startGame(category);
        });

        await waitFor(() => expect(result.current.questions).toHaveLength(10));

        expect(result.current.questions).toHaveLength(10);
        expect(result.current.category).toBe(category);
        expect(
          result.current.questions.every((q) => q.category === category),
        ).toBe(true);
      }
    });
  });

  describe('submitAnswer', () => {
    it('should update score ketika jawaban benar', async () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.startGame('agama');
      });

      await waitFor(() => expect(result.current.questions).toHaveLength(10));

      const currentQuestion = result.current.questions[0];
      const correctAnswerIndex = currentQuestion.correctAnswer;

      act(() => {
        result.current.submitAnswer(correctAnswerIndex);
      });

      expect(result.current.score).toBe(10);
      expect(result.current.answers).toHaveLength(1);
      expect(result.current.answers[0].isCorrect).toBe(true);
    });

    it('should tidak update score ketika jawaban salah', async () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.startGame('agama');
      });

      await waitFor(() => expect(result.current.questions).toHaveLength(10));

      const currentQuestion = result.current.questions[0];
      const wrongAnswerIndex = (currentQuestion.correctAnswer + 1) % 4;

      act(() => {
        result.current.submitAnswer(wrongAnswerIndex);
      });

      expect(result.current.score).toBe(0);
      expect(result.current.answers).toHaveLength(1);
      expect(result.current.answers[0].isCorrect).toBe(false);
    });

    it('should tidak accept answer jika game tidak aktif', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.submitAnswer(0);
      });

      expect(result.current.answers).toHaveLength(0);
      expect(result.current.score).toBe(0);
    });
  });

  describe('nextQuestion', () => {
    it('should move ke question berikutnya', async () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.startGame('agama');
      });

      await waitFor(() => expect(result.current.questions).toHaveLength(10));

      const initialIndex = result.current.currentQuestionIndex;

      act(() => {
        result.current.submitAnswer(0);
        result.current.nextQuestion();
      });

      expect(result.current.currentQuestionIndex).toBe(initialIndex + 1);
      expect(result.current.isGameActive).toBe(true);
      expect(result.current.isGameFinished).toBe(false);
    });

    it('should finish game setelah soal terakhir', async () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.startGame('agama');
      });

      await waitFor(() => expect(result.current.questions).toHaveLength(10));

      // Answer semua 10 questions
      act(() => {
        for (let i = 0; i < 10; i++) {
          const currentQuestion = result.current.questions[result.current.currentQuestionIndex];
          result.current.submitAnswer(currentQuestion.correctAnswer);
          if (i < 9) {
            result.current.nextQuestion();
          }
        }
      });

      // Next dari soal terakhir harus finish game
      act(() => {
        result.current.nextQuestion();
      });

      expect(result.current.isGameActive).toBe(false);
      expect(result.current.isGameFinished).toBe(true);
      expect(result.current.answers).toHaveLength(10);
    });
  });

  describe('getResult', () => {
    it('should calculate grade A untuk score ≥80%', async () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.startGame('agama');
      });

      await waitFor(() => expect(result.current.questions).toHaveLength(10));

      // Answer 8 benar, 2 salah = 80%
      act(() => {
        for (let i = 0; i < 10; i++) {
          const currentQuestion = result.current.questions[result.current.currentQuestionIndex];
          if (i < 8) {
            // Jawaban benar
            result.current.submitAnswer(currentQuestion.correctAnswer);
          } else {
            // Jawaban salah
            const wrongAnswer = (currentQuestion.correctAnswer + 1) % 4;
            result.current.submitAnswer(wrongAnswer);
          }
          result.current.nextQuestion();
        }
      });

      const gameResult = result.current.getResult();

      expect(gameResult.grade).toBe('A');
      expect(gameResult.score).toBe(80);
      expect(gameResult.percentage).toBe(80);
      expect(gameResult.correctAnswers).toBe(8);
      expect(gameResult.wrongAnswers).toBe(2);
    });

    it('should calculate grade B untuk score 60-79%', async () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.startGame('sejarah');
      });

      await waitFor(() => expect(result.current.questions).toHaveLength(10));

      // Answer 7 benar, 3 salah = 70%
      act(() => {
        for (let i = 0; i < 10; i++) {
          const currentQuestion = result.current.questions[result.current.currentQuestionIndex];
          if (i < 7) {
            result.current.submitAnswer(currentQuestion.correctAnswer);
          } else {
            const wrongAnswer = (currentQuestion.correctAnswer + 1) % 4;
            result.current.submitAnswer(wrongAnswer);
          }
          result.current.nextQuestion();
        }
      });

      const gameResult = result.current.getResult();

      expect(gameResult.grade).toBe('B');
      expect(gameResult.score).toBe(70);
      expect(gameResult.percentage).toBe(70);
      expect(gameResult.correctAnswers).toBe(7);
    });

    it('should calculate grade C untuk score <60%', async () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.startGame('umum');
      });

      await waitFor(() => expect(result.current.questions).toHaveLength(10));

      // Answer 5 benar, 5 salah = 50%
      act(() => {
        for (let i = 0; i < 10; i++) {
          const currentQuestion = result.current.questions[result.current.currentQuestionIndex];
          if (i < 5) {
            result.current.submitAnswer(currentQuestion.correctAnswer);
          } else {
            const wrongAnswer = (currentQuestion.correctAnswer + 1) % 4;
            result.current.submitAnswer(wrongAnswer);
          }
          result.current.nextQuestion();
        }
      });

      const gameResult = result.current.getResult();

      expect(gameResult.grade).toBe('C');
      expect(gameResult.score).toBe(50);
      expect(gameResult.percentage).toBe(50);
      expect(gameResult.correctAnswers).toBe(5);
      expect(gameResult.wrongAnswers).toBe(5);
    });
  });

  describe('resetGame', () => {
    it('should reset game ke initial state', async () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      // Start dan play game
      act(() => {
        result.current.startGame('agama');
        result.current.submitAnswer(0);
        result.current.nextQuestion();
      });

      // Reset
      act(() => {
        result.current.resetGame();
      });

      expect(result.current.category).toBe(null);
      expect(result.current.questions).toHaveLength(0);
      expect(result.current.currentQuestionIndex).toBe(0);
      expect(result.current.score).toBe(0);
      expect(result.current.answers).toHaveLength(0);
      expect(result.current.isGameActive).toBe(false);
      expect(result.current.isGameFinished).toBe(false);
    });
  });
});
