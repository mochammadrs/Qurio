"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { BookOpen, History, Globe, Sparkles, Target, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { Category } from "@/context/types";

const categories = [
  {
    id: "agama" as Category,
    name: "Agama",
    description: "Pengetahuan tentang Islam & nilai-nilai keagamaan",
    icon: BookOpen,
    gradient: "bg-emerald-500",
    bgGradient: "from-emerald-50 to-teal-50",
    hoverGradient: "hover:from-emerald-100 hover:to-teal-100",
    iconColor: "text-emerald-600",
    emoji: "📖",
  },
  {
    id: "sejarah" as Category,
    name: "Sejarah",
    description: "Peristiwa penting dalam sejarah dunia & Indonesia",
    icon: History,
    gradient: "bg-amber-500",
    bgGradient: "from-amber-50 to-orange-50",
    hoverGradient: "hover:from-amber-100 hover:to-orange-100",
    iconColor: "text-amber-600",
    emoji: "🕰️",
  },
  {
    id: "umum" as Category,
    name: "Pengetahuan Umum",
    description: "Wawasan luas tentang dunia & kehidupan",
    icon: Globe,
    gradient: "bg-blue-500",
    bgGradient: "from-blue-50 to-indigo-50",
    hoverGradient: "hover:from-blue-100 hover:to-indigo-100",
    iconColor: "text-blue-600",
    emoji: "🌍",
  },
];

export default function Home() {
  const router = useRouter();
  const { startGame } = useGame();

  const handleCategorySelect = (categoryId: Category) => {
    startGame(categoryId);
    router.push("/play");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <AnimatedBackground variant="home" />
      
      <Header />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 text-[#5B8CFF] px-5 py-2.5 rounded-full mb-6 text-sm font-semibold border-2 border-blue-200 shadow-md">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Where Curiosity Begins
            <Sparkles className="w-4 h-4 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Welcome to Qurio
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Mulai petualangan belajarmu dengan kuis interaktif yang seru dan menantang! 🚀
          </p>
          {/* Decorative elements */}
          <div className="flex justify-center gap-3">
            <div className="px-4 py-2 bg-emerald-50 rounded-full border border-emerald-200 text-emerald-700 text-sm font-medium">📖 3 Kategori</div>
            <div className="px-4 py-2 bg-amber-50 rounded-full border border-amber-200 text-amber-700 text-sm font-medium">🎯 60 Soal</div>
            <div className="px-4 py-2 bg-blue-50 rounded-full border border-blue-200 text-blue-700 text-sm font-medium">🏆 Sistem Grade</div>
          </div>
        </div>

        {/* Category Selection Grid */}
        <div className="mb-16">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-3 text-center">
            Pilih Kategori 🎯
          </h2>
          <p className="text-center text-gray-600 mb-10">Pilih topik favoritmu dan mulai tantangan!</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className="group h-full animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card
                    className={`relative h-full cursor-pointer border-2 border-gray-200 bg-white hover:shadow-2xl hover:border-blue-400 hover:-translate-y-2 transition-all duration-300 overflow-hidden`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/50 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="flex flex-col h-full p-6">
                      {/* Icon Badge with glow effect */}
                      <div className="relative flex justify-center mb-4">
                        <div className={`absolute inset-0 ${category.gradient} rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                        <div className={`relative w-20 h-20 rounded-xl ${category.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                          <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                        </div>
                        {/* Sparkle decoration */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg" />
                      </div>
                      
                      {/* Category Info */}
                      <div className="flex-grow flex flex-col items-center text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <span className="text-xl">{category.emoji}</span>
                          <h3 className="text-xl font-heading font-bold text-gray-900">
                            {category.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                          {category.description}
                        </p>
                        {/* Stats badge */}
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700 mb-4">
                          <Sparkles className="w-3 h-3" />
                          20 Soal Tersedia
                        </div>
                      </div>
                      
                      {/* CTA Button */}
                      <Button 
                        variant="primary" 
                        size="md" 
                        className="w-full group-hover:shadow-lg"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Mulai Kuis
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                      </Button>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12 max-w-5xl mx-auto">
          <h3 className="text-3xl font-heading font-bold text-gray-900 mb-8 text-center">Kenapa Qurio? ✨</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-200">
              <div className="relative mb-4">
                <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-900">10 Pertanyaan</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Soal pilihan ganda yang menantang dan berkualitas</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-200">
              <div className="relative mb-4">
                <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-900">Sistem Poin</h4>
              <p className="text-sm text-gray-600 leading-relaxed">+10 poin untuk setiap jawaban benar</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-200">
              <div className="relative mb-4">
                <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-900">Grade System</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Dapatkan grade A, B, atau C</p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 border-0 shadow-2xl overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-4xl font-heading font-bold text-white">
                  Cara Bermain
                </h3>
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="text-2xl">✨</div>
                  <div>
                    <p className="text-white font-semibold mb-1">10 Pertanyaan Per Kuis</p>
                    <p className="text-white/80 text-sm">Soal pilihan ganda yang telah dikurasi</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <p className="text-white font-semibold mb-1">Jawaban Benar = +10 Poin</p>
                    <p className="text-white/80 text-sm">Raih skor maksimal 100 poin</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <p className="text-white font-semibold mb-1">Feedback Instan</p>
                    <p className="text-white/80 text-sm">Lihat jawaban benar/salah langsung</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <p className="text-white font-semibold mb-1">Dapatkan Grade</p>
                    <p className="text-white/80 text-sm">A (≥80%), B (60-79%), C (&lt;60%)</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
