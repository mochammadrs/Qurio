import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import {
  CheckCircle2,
  Zap,
  LayoutGrid,
  Trophy,
  Pencil,
  Bell,
  Lock,
  ChevronRight,
  LogOut,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      scores: {
        include: { category: true },
        orderBy: { completedAt: "desc" },
      },
    },
  });

  if (!user) redirect("/login");

  const totalQuizzes = user.scores.length;
  const avgScore =
    totalQuizzes > 0
      ? Math.round(
          user.scores.reduce((sum, s) => sum + s.percentage, 0) / totalQuizzes
        )
      : 0;

  const categoryCount: Record<string, { name: string; count: number }> = {};
  for (const s of user.scores) {
    const catName = s.category.name;
    if (!categoryCount[catName]) categoryCount[catName] = { name: catName, count: 0 };
    categoryCount[catName].count++;
  }
  const favoriteCategory =
    Object.values(categoryCount).sort((a, b) => b.count - a.count)[0]?.name ||
    "-";

  const joinDate = user.createdAt.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const recentScores = user.scores.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow w-full max-w-container mx-auto px-6 lg:px-8 py-10">
        <section className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
          <div className="w-24 h-24 rounded-full border border-surface-dim overflow-hidden flex-shrink-0 bg-surface-high">
            {user.image ? (
              <img
                src={user.image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-headline-lg font-bold text-primary">
                {user.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-headline-lg text-primary mb-1">
              {user.name || "User"}
            </h1>
            <p className="text-body-md text-secondary mb-3">
              Bergabung sejak {joinDate}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {favoriteCategory !== "-" && (
                <span className="px-3 py-1 rounded-full border border-surface-dim text-label-sm text-on-surface-variant bg-background">
                  {favoriteCategory}
                </span>
              )}
              {avgScore >= 80 && (
                <span className="px-3 py-1 rounded-full border border-surface-dim text-label-sm text-on-surface-variant bg-background">
                  Pencapaian Gemilang
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 md:mt-0 hidden md:block">
            <button className="px-4 py-2 bg-transparent border border-primary text-primary text-label-sm rounded-lg hover:bg-surface-container-low transition-colors">
              Ubah Profil
            </button>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-title-md text-on-surface mb-4">Statistik Belajar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-background border border-surface-dim rounded-xl p-4 flex flex-col hover:bg-surface-container-low transition-colors">
              <CheckCircle2 className="text-primary mb-2" size={24} />
              <span className="text-display-lg text-on-surface mb-1">{totalQuizzes}</span>
              <span className="text-label-sm text-secondary">Kuis Selesai</span>
            </div>
            <div className="bg-background border border-surface-dim rounded-xl p-4 flex flex-col hover:bg-surface-container-low transition-colors">
              <Zap className="text-primary mb-2" size={24} />
              <span className="text-display-lg text-on-surface mb-1">{avgScore}%</span>
              <span className="text-label-sm text-secondary">Rata-rata Skor</span>
            </div>
            <div className="bg-background border border-surface-dim rounded-xl p-4 flex flex-col hover:bg-surface-container-low transition-colors">
              <LayoutGrid className="text-primary mb-2" size={24} />
              <span className="text-title-md text-on-surface mb-1 mt-auto">{favoriteCategory}</span>
              <span className="text-label-sm text-secondary mt-1">Kategori Favorit</span>
            </div>
            <div className="bg-background border border-surface-dim rounded-xl p-4 flex flex-col hover:bg-surface-container-low transition-colors">
              <Trophy className="text-primary mb-2" size={24} />
              <span className="text-title-md text-on-surface mb-1 mt-auto">
                {avgScore >= 80 ? "Pencapaian Gemilang" : avgScore >= 60 ? "Pembelajar Konsisten" : "Pemula Aktif"}
              </span>
              <span className="text-label-sm text-secondary mt-1">Pencapaian Terakhir</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <section className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-title-md text-on-surface">Aktivitas Terakhir</h2>
            </div>
            <div className="bg-background border border-surface-dim rounded-xl overflow-hidden">
              {recentScores.length === 0 ? (
                <div className="p-6 text-center text-secondary text-body-md">
                  Belum ada aktivitas kuis.
                </div>
              ) : (
                <div className="divide-y divide-surface-dim">
                  {recentScores.map((s) => (
                    <div
                      key={s.id}
                      className="flex justify-between items-center p-4 hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <div>
                        <h3 className="text-body-md text-on-surface font-medium">
                          {s.category.name}
                        </h3>
                        <p className="text-label-sm text-secondary mt-1">
                          {new Date(s.completedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-title-md text-primary">
                        {s.correctAnswers}/{s.totalQuestions}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="lg:col-span-1">
            <h2 className="text-title-md text-on-surface mb-4">Pengaturan</h2>
            <div className="bg-background border border-surface-dim rounded-xl overflow-hidden flex flex-col">
              <button className="w-full flex items-center gap-4 p-4 hover:bg-surface-container-low transition-colors border-b border-surface-dim text-left">
                <Pencil className="text-secondary" size={20} />
                <span className="text-body-md text-on-surface flex-grow">Ubah Profil</span>
                <ChevronRight className="text-surface-dim" size={20} />
              </button>
              <button className="w-full flex items-center gap-4 p-4 hover:bg-surface-container-low transition-colors border-b border-surface-dim text-left">
                <Bell className="text-secondary" size={20} />
                <span className="text-body-md text-on-surface flex-grow">Notifikasi</span>
                <ChevronRight className="text-surface-dim" size={20} />
              </button>
              <button className="w-full flex items-center gap-4 p-4 hover:bg-surface-container-low transition-colors border-b border-surface-dim text-left">
                <Lock className="text-secondary" size={20} />
                <span className="text-body-md text-on-surface flex-grow">Keamanan &amp; Privasi</span>
                <ChevronRight className="text-surface-dim" size={20} />
              </button>
              <Link
                href="/api/auth/signout"
                className="w-full flex items-center gap-4 p-4 hover:bg-error-container/50 transition-colors text-left group"
              >
                <LogOut className="text-error" size={20} />
                <span className="text-body-md text-error flex-grow font-medium">Keluar</span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-surface-low border-t border-surface-dim mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 lg:px-8 py-10 max-w-container mx-auto gap-4">
          <div className="text-title-md font-bold text-primary">
            Qurio
          </div>
          <div className="flex gap-4 text-label-sm text-on-surface-variant">
            <Link href="#" className="hover:text-primary transition-colors opacity-80">Tentang</Link>
            <Link href="#" className="hover:text-primary transition-colors opacity-80">Privasi</Link>
            <Link href="#" className="hover:text-primary transition-colors opacity-80">Syarat</Link>
            <Link href="#" className="hover:text-primary transition-colors opacity-80">Kontak</Link>
          </div>
          <div className="text-label-sm text-secondary">
            &copy; 2026 Qurio Indonesia. Temukan Pengetahuan.
          </div>
        </div>
      </footer>
    </div>
  );
}
