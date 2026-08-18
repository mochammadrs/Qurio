import { Question } from "@/context/types";

export function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function shuffleQuestionOptions(question: Question): Question {
  const optionsWithIndex = question.options.map((opt, idx) => ({ opt, idx }));

  for (let i = optionsWithIndex.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
  }

  const newCorrectIndex = optionsWithIndex.findIndex((item) => item.idx === question.correctAnswer);

  return {
    ...question,
    options: optionsWithIndex.map((item) => item.opt),
    correctAnswer: newCorrectIndex,
  };
}
