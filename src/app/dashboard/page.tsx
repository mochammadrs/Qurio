"use client";

import { useSession, signOut } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { Statistics, QuizResult } from "@/components/dashboard/Statistics";
import { QuizHistory } from "@/components/dashboard/QuizHistory";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowRight, LogOut } from "lucide-react";

const mockHistory: QuizResult[] = [
  {
    id: "1",
    category: "Agama",
    score: 8,
    totalQuestions: 10,
    percentage: 80,
    grade: "A",
    completedAt: new Date("2025-06-20T10:30:00"),
  },
  {
    id: "2",
    category: "Sejarah",
    score: 7,
    totalQuestions: 10,
    percentage: 70,
    grade: "B",
    completedAt: new Date("2025-06-18T14:15:00"),
  },
  {
    id: "3",
    category: "Pengetahuan Umum",
    score: 9,
    totalQuestions: 10,
    percentage: 90,
    grade: "A",
    completedAt: new Date("2025-06-15T09:00:00"),
  },
  {
    id: "4",
    category: "Agama",
    score: 6,
    totalQuestions: 10,
    percentage: 60,
    grade: "B",
    completedAt: new Date("2025-06-10T16:45:00"),
  },
  {
    id: "5",
    category: "Sejarah",
    score: 5,
    totalQuestions: 10,
    percentage: 50,
    grade: "C",
    completedAt: new Date("2025-06-05T11:20:00"),
  },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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

           <ProfileCard />

           <Statistics history={mockHistory} />

           <QuizHistory history={mockHistory} />

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
