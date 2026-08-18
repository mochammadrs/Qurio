import { cn } from "@/utils/cn";
import { Check } from "lucide-react";

interface QuestionCardProps {
  question: string;
  options: string[];
  currentQuestion: number;
  totalQuestions: number;
  onSelectAnswer?: (index: number) => void;
  selectedAnswer?: number | null;
  getAnswerFeedback?: (index: number) => "default" | "correct" | "wrong";
  isAnswerSubmitted?: boolean;
}

export function QuestionCard({
  question,
  options,
  onSelectAnswer,
  selectedAnswer,
  getAnswerFeedback,
  isAnswerSubmitted = false,
}: QuestionCardProps) {
  const getOptionStyles = (index: number) => {
    if (isAnswerSubmitted && getAnswerFeedback) {
      const feedback = getAnswerFeedback(index);
      if (feedback === "correct")
        return "border-2 border-success-leaf bg-success-leaf/5";
      if (feedback === "wrong")
        return "border-2 border-error bg-error/5";
    }
    if (selectedAnswer === index) {
      return "border-2 border-primary bg-primary/5";
    }
    return "border border-border bg-surface-card hover:bg-surface-low hover:border-text-subtle";
  };

  const getBadgeStyles = (index: number) => {
    if (isAnswerSubmitted && getAnswerFeedback) {
      const feedback = getAnswerFeedback(index);
      if (feedback === "correct")
        return "bg-success-leaf text-white border-success-leaf";
      if (feedback === "wrong")
        return "bg-error text-white border-error";
    }
    if (selectedAnswer === index) {
      return "bg-primary text-on-primary border-primary";
    }
    return "border border-border text-text-secondary group-hover:border-primary group-hover:text-primary";
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (isAnswerSubmitted) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelectAnswer?.(index);
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="w-full bg-surface-card border border-border rounded-xl p-6 md:p-8 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
        <h2 className="headline-lg text-text-primary mb-3 relative z-10">
          {question}
        </h2>
        <p className="text-body-md text-text-secondary relative z-10">
          Pilih satu jawaban yang paling tepat dari pilihan di bawah ini.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-8" role="radiogroup" aria-label="Pilihan jawaban">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer?.(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={isAnswerSubmitted}
            tabIndex={isAnswerSubmitted ? -1 : 0}
            aria-label={`Opsi ${String.fromCharCode(65 + index)}: ${option}`}
            aria-pressed={selectedAnswer === index}
            className={cn(
              "group flex items-center justify-between w-full p-4 rounded-lg text-left transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed",
              getOptionStyles(index)
            )}
          >
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full label-sm transition-colors",
                  getBadgeStyles(index)
                )}
              >
                {isAnswerSubmitted && getAnswerFeedback?.(index) === "correct" ? (
                  <Check className="w-4 h-4" />
                ) : isAnswerSubmitted && getAnswerFeedback?.(index) === "wrong" ? (
                  <span className="text-sm font-bold">×</span>
                ) : (
                  String.fromCharCode(65 + index)
                )}
              </span>
              <span className="text-body-lg text-text-primary font-medium">
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
