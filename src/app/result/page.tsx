"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Header } from "@/components/layout/Header";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trophy, Target, TrendingUp, Home, RotateCcw, Sparkles } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { useSoundEffects } from "@/hooks/useSoundEffects";

export default function ResultPage() {
  const router = useRouter();
  const { isGameFinished, getResult, resetGame, category } = useGame();
  const { playCelebrationSound } = useSoundEffects();
  
  // Redirect if no game finished
  useEffect(() => {
    if (!isGameFinished) {
      router.push("/");
    }
  }, [isGameFinished, router]);

  // Trigger confetti for high scores
  useEffect(() => {
    if (isGameFinished) {
      const result = getResult();
      if (result && result.percentage >= 80) {
        // Fire confetti after small delay
        const timer = setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          // Play celebration sound
          playCelebrationSound();
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isGameFinished, getResult, playCelebrationSound]);

  if (!isGameFinished) {
    return (
      <div className="min-h-screen bg-bg-canvas flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const result = getResult();
  const { score, totalQuestions, correctAnswers, wrongAnswers, percentage, grade } = result;
  const maxScore = totalQuestions * 10;
  
  // Get grade info
  const getGradeInfo = (g: string) => {
    if (g === "A") return { bgColor: "bg-green-500" };
    if (g === "B") return { bgColor: "bg-blue-500" };
    return { bgColor: "bg-amber-500" };
  };

  const gradeInfo = getGradeInfo(grade);

  const handlePlayAgain = () => {
    resetGame();
    router.push("/");
  };

  const handleGoHome = () => {
    resetGame();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
      <AnimatedBackground variant="result" />
      
      <Header />

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Result Card */}
        <Card className="text-center mb-6 bg-white border border-gray-200 shadow-lg">
          <div className="py-3">
            {/* Trophy Icon */}
            <div className="flex justify-center mb-3">
              <div className="relative">
                {/* Glow effect */}
                <div className={`absolute inset-0 ${gradeInfo.bgColor} rounded-full blur-xl opacity-40 animate-pulse-slow`} />
                {/* Main trophy */}
                <div className={`relative w-14 h-14 ${gradeInfo.bgColor} rounded-full flex items-center justify-center shadow-2xl border-3 border-white animate-bounce-in`}>
                  <Trophy className="w-7 h-7 text-white" strokeWidth={2.5} fill="white" />
                </div>
                {/* Sparkles */}
                <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-yellow-400 rounded-full shadow-lg animate-pulse" />
                <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-yellow-300 rounded-full shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>

            {/* Grade Badge - Centered */}
            <div className="mb-4 flex flex-col items-center">
              <div className="relative mb-3">
                {/* Decorative background */}
                <div className={`absolute inset-0 ${gradeInfo.bgColor} rounded-2xl blur-lg opacity-30`} />
                {/* Main badge */}
                <div className={`relative w-20 h-20 ${gradeInfo.bgColor} rounded-2xl flex items-center justify-center shadow-2xl border-3 border-white ring-2 ring-gray-100 animate-bounce-in`}>
                  <span className="text-5xl font-heading font-bold text-white drop-shadow-lg">
                    {grade}
                  </span>
                </div>
                {/* Corner decorations */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full shadow-lg" />
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-purple-400 rounded-full shadow-lg" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                {percentage >= 80 ? "Luar Biasa! 🎉" : percentage >= 60 ? "Bagus Sekali! 👏" : "Terus Berlatih! 💪"}
              </h1>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border-2 border-blue-200">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <p className="text-gray-700 text-base font-semibold">
                  Kategori: <span className="capitalize text-[#5B8CFF]">{category}</span>
                </p>
              </div>
            </div>

            {/* Score Display */}
            <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white rounded-xl p-4 mb-4 shadow-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-400/20 rounded-full blur-xl" />
              
              <div className="relative">
                <p className="text-sm font-bold mb-1 opacity-90 flex items-center justify-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Skor Akhir Kamu
                  <Sparkles className="w-3 h-3" />
                </p>
                <p className="text-4xl font-heading font-black mb-2 drop-shadow-lg">{score}</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="h-2 w-48 bg-white/20 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-300 via-white to-yellow-300 rounded-full transition-all duration-700 shadow-lg"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <p className="text-base font-semibold opacity-90">dari {maxScore} poin • {Math.round(percentage)}%</p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-center mb-1">
                  <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Target className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <p className="text-[10px] text-blue-700 mb-0.5 font-semibold uppercase tracking-wide">Total Soal</p>
                <p className="text-2xl font-bold text-blue-900">{totalQuestions}</p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-3 border-2 border-green-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-center mb-1">
                  <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <p className="text-[10px] text-green-700 mb-0.5 font-semibold uppercase tracking-wide">Benar</p>
                <p className="text-2xl font-bold text-green-900">{correctAnswers}</p>
              </div>
              
              <div className="bg-red-50 rounded-xl p-3 border-2 border-red-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-center mb-1">
                  <div className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-lg text-white font-bold">✗</span>
                  </div>
                </div>
                <p className="text-[10px] text-red-700 mb-0.5 font-semibold uppercase tracking-wide">Salah</p>
                <p className="text-2xl font-bold text-red-900">{wrongAnswers}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={handlePlayAgain}
                className="flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="font-semibold">Main Lagi</span>
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={handleGoHome}
                className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Home className="w-4 h-4" />
                <span className="font-semibold">Ke Beranda</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Motivational Message */}
        <Card className="relative bg-gradient-to-br from-blue-500 to-indigo-600 border-0 shadow-2xl overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-300 rounded-full blur-3xl" />
          </div>
          
          <div className="relative flex items-center gap-4 py-5 px-5">
            {/* Icon container with glow */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-white rounded-2xl blur-lg opacity-50" />
              <div className="relative w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-4xl">
                  {percentage >= 80 ? "🎉" : percentage >= 60 ? "💪" : "📚"}
                </span>
              </div>
              {/* Sparkle decorations */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full shadow-lg animate-pulse" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-300 rounded-full shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            
            {/* Message content */}
            <div className="flex-1">
              <h3 className="text-white text-lg font-heading font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {percentage >= 80 ? "Luar Biasa!" : percentage >= 60 ? "Bagus Sekali!" : "Semangat!"}
              </h3>
              <p className="text-white/95 text-sm font-medium leading-relaxed">
                {percentage >= 80 
                  ? "Hebat sekali! Kamu memiliki pemahaman yang sangat baik. Pertahankan prestasimu!"
                  : percentage >= 60
                  ? "Bagus! Terus tingkatkan pengetahuanmu dengan berlatih lebih banyak lagi!"
                  : "Jangan menyerah! Belajar lagi dan coba ulang untuk hasil lebih baik. Kamu pasti bisa!"}
              </p>
              {/* Decorative bottom badge */}
              <div className="mt-3 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
                <span className="text-white text-xs font-semibold">Keep Learning & Growing</span>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
