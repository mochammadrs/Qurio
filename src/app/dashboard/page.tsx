"use client";

import { useSession, signOut } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Landmark, Globe, Map, BookText, Trophy } from "lucide-react";
import { Category } from "@/context/types";
import { useGame } from "@/context/GameContext";

const categories = [
  {
    id: "agama" as Category,
    name: "Agama",
    description:
      "Eksplorasi mendalam mengenai ajaran, sejarah, dan nilai-nilai spiritual.",
    Icon: BookOpen,
    count: 120,
  },
  {
    id: "sejarah" as Category,
    name: "Sejarah",
    description:
      "Pelajari peristiwa masa lalu yang membentuk peradaban dan dunia hari ini.",
    Icon: Landmark,
    count: 85,
  },
  {
    id: "umum" as Category,
    name: "Umum",
    description:
      "Uji wawasan Anda terhadap dunia luas dalam format editorial minimalis yang bersih.",
    Icon: Globe,
    count: 250,
  },
  {
    id: "geografi" as Category,
    name: "Geografi",
    description:
      "Uji pengetahuan geografi Indonesia & dunia — dari bendungan hingga benua.",
    Icon: Map,
    count: 15,
  },
  {
    id: "bahasa-sastra" as Category,
    name: "Bahasa & Sastra",
    description:
      "Uji pemahaman bahasa, peribahasa, dan karya sastra klasik Indonesia.",
    Icon: BookText,
    count: 15,
  },
  {
    id: "olahraga" as Category,
    name: "Olahraga",
    description:
      "Uji pengetahuan seputar aturan, tokoh, dan sejarah olahraga populer.",
    Icon: Trophy,
    count: 15,
  },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { startGame } = useGame();

  const handleCategorySelect = (categoryId: Category) => {
    startGame(categoryId);
    router.push("/play");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-muted">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-body-md text-text-secondary">
            Silakan login terlebih dahulu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />

      <main className="flex-grow w-full max-w-container mx-auto px-6 lg:px-8 py-12 flex flex-col gap-12">
        <section className="flex flex-col gap-2 max-w-2xl">
          <h2 className="text-display-lg text-text-primary">
            Pilih Kategori
          </h2>
          <p className="text-body-lg text-text-secondary">
            Jelajahi pengetahuan melalui kurasi pertanyaan pilihan kami. Temukan
            pemahaman baru dalam setiap sesi.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className="group text-left bg-surface-card border border-border rounded-xl p-6 h-full flex flex-col justify-between transition-all hover:bg-surface-low hover:border-primary/50 relative overflow-hidden cursor-pointer"
            >
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <category.Icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <span className="mono-xs bg-surface-low text-text-secondary px-2 py-1 rounded-full">
                  {category.count} Pertanyaan
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="title-md text-text-primary group-hover:text-primary transition-colors mb-2">
                  {category.name}
                </h3>
                <p className="text-body-md text-text-secondary">
                  {category.description}
                </p>
              </div>
            </button>
          ))}
        </section>

        <section className="bg-surface-high border border-border rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h4 className="title-md text-text-primary mb-1">
              Tantangan Harian
            </h4>
            <p className="text-body-md text-text-secondary">
              Selesaikan 5 pertanyaan campuran setiap hari untuk menjaga
              ketajaman wawasan Anda.
            </p>
          </div>
          <Button onClick={() => handleCategorySelect("umum")} className="whitespace-nowrap">
            Mulai Tantangan
          </Button>
        </section>
      </main>

      <footer className="bg-surface-low border-t border-border mt-auto">
        <div className="max-w-container mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="title-md font-bold text-primary">Qurio</span>
              <span className="label-sm text-text-muted">
                &copy; 2026 Qurio Indonesia. Temukan Pengetahuan.
              </span>
            </div>
            <nav className="flex flex-wrap items-center gap-6">
              <Link
                href="#"
                className="label-sm text-text-secondary hover:text-primary transition-colors opacity-80"
              >
                Tentang
              </Link>
              <Link
                href="#"
                className="label-sm text-text-secondary hover:text-primary transition-colors opacity-80"
              >
                Privasi
              </Link>
              <Link
                href="#"
                className="label-sm text-text-secondary hover:text-primary transition-colors opacity-80"
              >
                Syarat
              </Link>
              <Link
                href="#"
                className="label-sm text-text-secondary hover:text-primary transition-colors opacity-80"
              >
                Kontak
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
