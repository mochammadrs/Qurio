import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, XCircle } from "lucide-react";

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

/**
 * QuestionCard Component
 * Menampilkan soal dan 4 opsi jawaban dalam grid 2x2 dengan Bento style
 */
export function QuestionCard({
  question,
  options,
  currentQuestion,
  totalQuestions,
  onSelectAnswer,
  selectedAnswer,
  getAnswerFeedback,
  isAnswerSubmitted = false,
}: QuestionCardProps) {
  const getFeedbackStyles = (index: number) => {
    if (!getAnswerFeedback) return "";
    
    const feedback = getAnswerFeedback(index);
    
    if (feedback === "correct") {
      return "border-success-leaf bg-green-50 ring-4 ring-success-leaf/30 shadow-lg shadow-green-200";
    }
    
    if (feedback === "wrong") {
      return "border-[#EF5350] bg-red-50 ring-4 ring-red-300 shadow-lg shadow-red-200 animate-shake";
    }
    
    return "";
  };

  const getFeedbackIcon = (index: number) => {
    if (!getAnswerFeedback) return null;
    
    const feedback = getAnswerFeedback(index);
    
    if (feedback === "correct") {
      return (
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-6 h-6 text-[#4CAF50]" />
          <span className="text-sm font-bold text-[#4CAF50]">Benar</span>
        </div>
      );
    }
    
    if (feedback === "wrong") {
      return (
        <div className="flex items-center gap-1.5">
          <XCircle className="w-6 h-6 text-[#EF5350]" />
          <span className="text-sm font-bold text-[#EF5350]">Salah</span>
        </div>
      );
    }
    
    return null;
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (isAnswerSubmitted) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectAnswer?.(index);
    }
  };

  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
    >
      <Card className="max-w-4xl mx-auto p-6 lg:p-8 bg-white shadow-lg border border-gray-200">
        {/* Question Counter */}
        <div className="mb-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" fill="white" />
            </div>
            <span 
              className="text-base font-semibold text-gray-800"
              aria-live="polite"
              aria-atomic="true"
            >
              Pertanyaan {currentQuestion} dari {totalQuestions}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-blue-100 border border-blue-300">
            <span 
              className="text-base font-bold text-blue-800"
              aria-label={`Progress ${Math.round((currentQuestion / totalQuestions) * 100)} persen`}
            >
              {Math.round((currentQuestion / totalQuestions) * 100)}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8 overflow-hidden">
          <motion.div
            className="bg-blue-500 h-full rounded-full shadow-md"
            initial={{ width: 0 }}
            animate={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Question Text */}
        <div className="mb-8 p-5 rounded-xl bg-gray-50 border border-gray-200">
          <h2 
            className="text-xl lg:text-2xl font-semibold text-gray-900 leading-relaxed"
            id={`question-${currentQuestion}`}
            tabIndex={0}
          >
            {question}
          </h2>
        </div>

        {/* Answer Options Grid */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          role="radiogroup"
          aria-label="Pilihan jawaban"
        >
          {options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => onSelectAnswer?.(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={isAnswerSubmitted}
              tabIndex={isAnswerSubmitted ? -1 : 0}
              aria-label={`Opsi ${String.fromCharCode(65 + index)}: ${option}`}
              aria-pressed={selectedAnswer === index}
              aria-disabled={isAnswerSubmitted}
              whileHover={{ scale: isAnswerSubmitted ? 1 : 1.02 }}
              whileTap={{ scale: isAnswerSubmitted ? 1 : 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                "group relative p-5 rounded-xl border-2 text-left transition-all duration-200",
                "bg-white hover:bg-blue-50 hover:border-primary-blue hover:shadow-md",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-70",
                "font-medium text-base text-gray-800",
                selectedAnswer === index && !isAnswerSubmitted && "border-primary-blue bg-blue-50 shadow-md",
                !isAnswerSubmitted && "border-gray-300",
                getFeedbackStyles(index)
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className={cn(
                    "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-all",
                    selectedAnswer === index && !isAnswerSubmitted 
                      ? "bg-blue-500 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-700"
                  )}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 leading-relaxed text-gray-900">{option}</span>
                </div>
                {getFeedbackIcon(index) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    {getFeedbackIcon(index)}
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
