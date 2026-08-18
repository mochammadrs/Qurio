"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { ArrowRight, ArrowUpRight, BookOpen, Landmark, Globe, Map, BookText, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useGame } from "@/context/GameContext";
import { Category } from "@/context/types";

const categories = [
  {
    id: "agama" as Category,
    name: "Agama",
    description:
      "Perdalam pengetahuan spiritual dan teks-teks suci melalui asesmen terstruktur.",
    Icon: BookOpen,
  },
  {
    id: "sejarah" as Category,
    name: "Sejarah Indonesia",
    description:
      "Telusuri jejak masa lalu Nusantara dengan pertanyaan komprehensif.",
    Icon: Landmark,
  },
  {
    id: "umum" as Category,
    name: "Pengetahuan Umum",
    description:
      "Uji wawasan Anda terhadap dunia luas dalam format editorial yang bersih.",
    Icon: Globe,
  },
  {
    id: "geografi" as Category,
    name: "Geografi",
    description:
      "Uji pengetahuan geografi Indonesia & dunia — dari bendungan hingga benua.",
    Icon: Map,
  },
  {
    id: "bahasa-sastra" as Category,
    name: "Bahasa & Sastra",
    description:
      "Uji pemahaman bahasa, peribahasa, dan karya sastra klasik Indonesia.",
    Icon: BookText,
  },
  {
    id: "olahraga" as Category,
    name: "Olahraga",
    description:
      "Uji pengetahuan seputar aturan, tokoh, dan sejarah olahraga populer.",
    Icon: Trophy,
  },
];

export default function Home() {
  const router = useRouter();
  const { startGame } = useGame();
  const { data: session } = useSession();

  const handleCategorySelect = (categoryId: Category) => {
    startGame(categoryId);
    router.push("/play");
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center px-6 pt-12 pb-16 max-w-container mx-auto w-full">
        <section className="w-full flex flex-col items-center text-center mt-8 mb-12">
          <h1 className="text-display-lg text-text-primary max-w-3xl mb-4">
            Where Curiosity Begins
          </h1>
          <p className="text-body-lg text-text-secondary max-w-2xl mb-8">
            Platform pembelajaran editorial minimalis yang dirancang untuk
            memperdalam pemahaman Anda melalui kuis dan asesmen terfokus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => router.push("/dashboard")}>
              Mulai Sekarang
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() =>
                document
                  .getElementById("kategori")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </section>

        <section id="kategori" className="w-full mt-8 mb-12">
          <div className="flex items-center justify-between mb-6 border-b border-border pb-3">
            <h2 className="title-md text-text-primary">Eksplorasi Kategori</h2>
            <ArrowRight className="w-5 h-5 text-text-subtle" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="group block text-left border border-border p-6 bg-surface-card hover:bg-surface-low transition-colors min-h-[200px] flex flex-col justify-between cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <category.Icon
                    className="w-8 h-8 text-primary"
                    strokeWidth={1.5}
                  />
                  <ArrowUpRight className="w-5 h-5 text-text-subtle opacity-0 group-hover:text-primary group-hover:opacity-100 transition-all" />
                </div>
                <div>
                  <h3 className="title-md text-text-primary mb-1">
                    {category.name}
                  </h3>
                  <p className="text-body-md text-text-secondary line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="w-full my-8 py-12 border-t border-b border-border flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 max-w-lg">
            <h2 className="headline-lg text-text-primary mb-4">
              Desain Minimalis, Fokus Maksimal
            </h2>
            <p className="text-body-md text-text-secondary mb-6">
              Antarmuka kami menyingkirkan gangguan, menyisakan ruang bagi
              pikiran Anda untuk berkonsentrasi pada materi pembelajaran.
            </p>
            <div className="flex items-center gap-2 text-primary label-sm cursor-pointer hover:underline">
              <span>Lihat Cara Kerja</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
          <div className="flex-1 w-full aspect-[4/3] bg-surface-low flex items-center justify-center p-4 overflow-hidden relative group">
            <div className="w-3/4 h-3/4 border border-border bg-surface-card flex flex-col p-4 gap-3 transform group-hover:scale-105 transition-transform duration-500 ease-out">
              <div className="w-1/3 h-4 bg-border rounded" />
              <div className="w-full h-8 bg-surface-high mt-3 rounded" />
              <div className="w-full h-8 bg-surface-high rounded" />
              <div className="w-2/3 h-8 bg-surface-high rounded" />
              <div className="mt-auto flex justify-end gap-2">
                <div className="w-24 h-8 border border-primary rounded" />
                <div className="w-24 h-8 bg-primary rounded" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-surface-low border-t border-border mt-auto">
        <div className="max-w-container mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="title-md font-bold text-primary">Qurio</span>
            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="label-sm text-text-secondary hover:text-primary transition-colors"
              >
                Tentang
              </Link>
              <Link
                href="#"
                className="label-sm text-text-secondary hover:text-primary transition-colors"
              >
                Privasi
              </Link>
              <Link
                href="#"
                className="label-sm text-text-secondary hover:text-primary transition-colors"
              >
                Syarat
              </Link>
              <Link
                href="#"
                className="label-sm text-text-secondary hover:text-primary transition-colors"
              >
                Kontak
              </Link>
            </div>
            <span className="label-sm text-text-muted">
              &copy; 2026 Qurio Indonesia. Temukan Pengetahuan.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
