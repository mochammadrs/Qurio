import { Card } from "@/components/ui/Card";
import { Trophy, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreBoardProps {
  score: number;
  totalQuestions: number;
}

/**
 * ScoreBoard Component
 * Menampilkan skor real-time dengan Bento style & animated counter
 */
export function ScoreBoard({ score, totalQuestions }: ScoreBoardProps) {
  const maxScore = totalQuestions * 10;
  const percentage = (score / maxScore) * 100;
  const [displayScore, setDisplayScore] = useState(0);

  // Animated counter effect
  useEffect(() => {
    if (displayScore === score) return;
    
    const duration = 500;
    const steps = 20;
    const increment = (score - displayScore) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(prev => Math.min(prev + increment, score));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, displayScore]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <Card className="relative overflow-hidden bg-blue-500 text-white shadow-xl shadow-blue-300/50 p-6">
        {/* Decorative Elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <motion.div 
              className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <Trophy className="w-7 h-7 text-yellow-300" />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <p className="text-sm font-semibold opacity-90 tracking-wide uppercase">Skor Anda</p>
              </div>
              <p 
                className="text-4xl font-heading font-black tracking-tight"
                aria-live="polite"
                aria-atomic="true"
                aria-label={`Skor saat ini: ${Math.round(displayScore)} dari ${maxScore} poin`}
              >
                {Math.round(displayScore)}
              </p>
              <p className="text-xs opacity-80 mt-1 font-medium">dari {maxScore} poin maksimal</p>
            </div>
          </div>
          
          {/* Enhanced Progress */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold opacity-90">Progress</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span 
                  className="text-xs font-bold"
                  aria-label={`Progress ${Math.round(percentage)} persen`}
                >
                  {Math.round(percentage)}%
                </span>
              </div>
            </div>
            <div 
              className="relative bg-white/20 backdrop-blur-sm rounded-full h-2.5 overflow-hidden shadow-inner"
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progress kuis"
            >
              <motion.div
                className="absolute inset-0 bg-yellow-300 h-full rounded-full shadow-md"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
