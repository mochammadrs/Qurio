"use client";

import { useSession, signOut } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { Statistics, QuizResult } from "@/components/dashboard/Statistics";
import { QuizHistory } from "@/components/dashboard/QuizHistory";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, ArrowRight, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetch("/api/scores")
        .then((res) => res.json())
        .then((data) => {
          const formattedHistory: QuizResult[] = data.scores.map((score: any) => ({
            id: score.id,
            category: score.category.name,
            score: score.correctAnswers,
            totalQuestions: score.totalQuestions,
            percentage: score.percentage,
            grade: score.grade,
            completedAt: new Date(score.completedAt),
          }));
          setHistory(formattedHistory);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch scores:", err);
          setError("Gagal memuat data quiz");
          setLoading(false);
        });
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <div
              className="absolute inset-0 w-20 h-20 border-4 border-purple-400 border-b-transparent rounded-full animate-spin mx-auto"
              style={{ animationDirection: "reverse", animationDuration: "1s" }}
            />
          </div>
          <p className="text-lg font-semibold text-gray-700 animate-pulse">
            Memuat Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Silakan login terlebih dahulu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <AnimatedBackground variant="dashboard" />

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="space-y-6">
           <div className="flex justify-between items-start">
             <div>
               <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-2">
                 Dashboard
               </h1>
               <p className="text-gray-600">
                 Selamat datang kembali! Lihat progres belajarmu di sini.
               </p>
             </div>
             <div className="flex gap-3">
               {session.user.role === "admin" && (
                 <Link href="/admin/questions">
                   <Button variant="primary" size="md">
                     Admin Panel
                   </Button>
                 </Link>
               )}
               <Button
                 variant="danger"
                 size="md"
                 onClick={() => signOut({ callbackUrl: "/" })}
                 className="flex items-center gap-2"
               >
                 <LogOut className="w-4 h-4" />
                 <span className="font-semibold">Keluar</span>
               </Button>
             </div>
           </div>

           <ProfileCard />

           {loading ? (
             <div className="text-center py-12">
               <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
               <p className="text-gray-600">Memuat data quiz...</p>
             </div>
           ) : error ? (
             <div className="text-center py-12">
               <p className="text-red-600 mb-4">{error}</p>
               <Button variant="secondary" onClick={() => window.location.reload()}>
                 Coba Lagi
               </Button>
             </div>
           ) : (
             <>
               <Statistics history={history} />
               <QuizHistory history={history} />
             </>
           )}

           <div className="flex justify-center pt-4 pb-8">
             <Button
               variant="primary"
               size="lg"
               onClick={() => router.push("/")}
               aria-label="Main kuis baru"
             >
               <span className="flex items-center gap-2">
                 <BookOpen className="w-5 h-5" />
                 Main Kuis Baru
                 <ArrowRight className="w-5 h-5" />
               </span>
             </Button>
           </div>
         </div>
      </main>
    </div>
  );
}
