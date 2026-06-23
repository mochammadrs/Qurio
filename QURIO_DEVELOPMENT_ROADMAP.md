# 🎯 Qurio — Development Roadmap & Implementation Guide

> Panduan pengembangan lanjutan dari MVP v1.0.0 menuju full stack application yang siap portofolio.

---

## 🎉 Status Update - June 23, 2026

### ✅ Completed Phases

**Phase 0: Technical Foundation** (June 2026)
- ✅ Testing infrastructure (Vitest + React Testing Library - 12 tests)
- ✅ Error Boundary implementation
- ✅ Code quality improvements (extracted AnimatedBackground)
- ✅ Accessibility enhancements (WCAG AA compliance)

**Phase 1: Backend & Authentication (v1.1.0)** (June 2026)
- ✅ Neon PostgreSQL + Prisma ORM (8 models)
- ✅ NextAuth v5 (Google + GitHub OAuth)
- ✅ User Dashboard (profile, stats, history)
- ✅ Score persistence & API routes
- ✅ Protected routes via middleware
- ✅ 7 production commits, 800+ lines of code

**Current Version:** v1.1.0 - Production Ready ✅

**Next Up:** Phase 1.5 - Admin Dashboard (v1.5.0)

For detailed changelog, see [CHANGELOG.md](CHANGELOG.md)

---

## 📌 Status Saat Ini (v1.1.0 - Backend Complete)

| Fitur | Status |
|---|---|
| 60 soal di 3 kategori | ✅ Done |
| Quiz engine + randomization | ✅ Done |
| Grading system A/B/C | ✅ Done |
| Sound effects (Web Audio API) | ✅ Done |
| Confetti celebration | ✅ Done |
| Animasi (Framer Motion) | ✅ Done |
| Responsive design | ✅ Done |
| Testing infrastructure | ✅ Done (12 tests) |
| Error handling | ✅ Done (Error Boundary) |
| Accessibility (WCAG AA) | ✅ Done |
| Backend / Database | ✅ Done (Neon + Prisma) |
| Autentikasi user | ✅ Done (NextAuth v5) |
| User Dashboard | ✅ Done (Profile + Stats) |
| Score Persistence | ✅ Done (API routes) |
| Admin Dashboard | ❌ Belum (Next: v1.5.0) |
| Leaderboard | ❌ Belum (v1.7.0) |
| Timer & Difficulty | ❌ Belum (v1.6.0) |
| Multiplayer | ❌ Belum (v2.0.0) |

---

## 🗺️ Roadmap Overview

```
v1.0.0 (Sekarang) → v1.1.0 (Backend + Auth) → v1.2.0 (Fitur Baru) → v2.0.0 (Multiplayer)
```

---

## 🚀 Phase 1 — Backend & Authentication (v1.1.0)

> **Goal:** Ubah Qurio dari frontend-only menjadi full stack app yang sesungguhnya.
> **Estimasi:** 3–4 minggu

### 1.1 Tech Stack Tambahan

```bash
# Install dependencies baru
npm install @prisma/client prisma
npm install next-auth@beta
npm install @auth/prisma-adapter
npm install bcryptjs
npm install -D @types/bcryptjs
```

### 1.2 Setup Database (Neon + Prisma)

> **Kenapa Neon?** Free tier tidak pernah di-pause meski berbulan-bulan tidak dibuka, unlimited proyek, dan PostgreSQL — jadi schema Prisma tidak perlu diubah sama sekali.

**Langkah-langkah:**

1. Buat akun di [neon.tech](https://neon.tech) → New Project
2. Isi nama project (contoh: `qurio`) → Create Project
3. Di dashboard Neon, buka tab **Connection Details**
4. Pilih connection string format **Prisma** → copy kedua URL (`DATABASE_URL` dan `DIRECT_URL`)
5. Buat file `.env.local` di root project:

```env
# .env.local

# Dari Neon Dashboard → Connection Details → Prisma
# DATABASE_URL  : pakai pooled connection (untuk query normal)
# DIRECT_URL    : pakai direct connection (untuk migrasi Prisma)
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]-pooler.neon.tech/[DBNAME]?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://[USER]:[PASSWORD]@[HOST].neon.tech/[DBNAME]?sslmode=require"

NEXTAUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

> 💡 **Generate NEXTAUTH_SECRET** dengan perintah ini di terminal:
> ```bash
> openssl rand -base64 32
> ```

### 1.3 Prisma Schema

Buat file `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")       // pooled connection — untuk query normal
  directUrl = env("DIRECT_URL")         // direct connection — untuk migrasi Prisma
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts  Account[]
  sessions  Session[]
  scores    Score[]
  _count    UserCount?
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Score {
  id         String   @id @default(cuid())
  userId     String
  category   String   // "agama" | "sejarah" | "pengetahuan-umum"
  score      Int      // 0–100
  grade      String   // "A" | "B" | "C"
  timeTaken  Int?     // dalam detik (untuk fitur timer nanti)
  createdAt  DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([category])
  @@index([score])
}
```

**Jalankan migrasi:**

```bash
npx prisma generate
npx prisma db push
```

### 1.4 Setup NextAuth

Buat file `src/lib/auth.ts`:

```typescript
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        return isValid ? user : null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
```

Buat file `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### 1.5 API Routes

**Simpan skor setelah quiz selesai** — `src/app/api/scores/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/scores — simpan skor baru
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category, score, grade, timeTaken } = await req.json();

  const newScore = await prisma.score.create({
    data: {
      userId: session.user.id,
      category,
      score,
      grade,
      timeTaken,
    },
  });

  return NextResponse.json(newScore, { status: 201 });
}

// GET /api/scores — ambil riwayat skor user yang login
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scores = await prisma.score.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(scores);
}
```

**Leaderboard** — `src/app/api/leaderboard/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;

  const leaderboard = await prisma.score.groupBy({
    by: ["userId"],
    where: category ? { category } : undefined,
    _max: { score: true },
    _count: { id: true },
    orderBy: { _max: { score: "desc" } },
    take: 10,
  });

  // Ambil nama user untuk ditampilkan
  const userIds = leaderboard.map((entry) => entry.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, image: true },
  });

  const result = leaderboard.map((entry) => {
    const user = users.find((u) => u.id === entry.userId);
    return {
      user: { name: user?.name ?? "Anonymous", image: user?.image },
      bestScore: entry._max.score,
      totalGames: entry._count.id,
    };
  });

  return NextResponse.json(result);
}
```

### 1.6 Struktur Folder Baru

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   ← NEW
│   │   ├── scores/route.ts               ← NEW
│   │   └── leaderboard/route.ts          ← NEW
│   ├── login/page.tsx                    ← NEW
│   ├── profile/page.tsx                  ← NEW
│   ├── leaderboard/page.tsx              ← NEW
│   ├── play/page.tsx
│   ├── result/page.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts                           ← NEW
│   └── prisma.ts                         ← NEW
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx                 ← NEW
│   │   └── UserMenu.tsx                  ← NEW
│   ├── leaderboard/
│   │   └── LeaderboardTable.tsx          ← NEW
│   ├── game/
│   ├── layout/
│   └── ui/
```

---

## 🎮 Phase 2 — Fitur Gameplay Baru (v1.2.0)

> **Goal:** Tambah fitur yang membuat gameplay lebih seru dan bervariasi.
> **Estimasi:** 2–3 minggu

### 2.1 Timer per Soal

Tambahkan countdown di `useQuizEngine.ts`:

```typescript
// src/hooks/useQuizEngine.ts — tambahkan state ini
const TIME_PER_QUESTION = 15; // detik

const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
const [isTimerActive, setIsTimerActive] = useState(false);

useEffect(() => {
  if (!isTimerActive || timeLeft <= 0) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        handleTimeUp(); // auto-submit jawaban kosong
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [isTimerActive, timeLeft]);

const handleTimeUp = () => {
  // Anggap salah jika waktu habis
  setIsAnswered(true);
  setSelectedAnswer(null);
  playWrongSound();
};

// Reset timer setiap pindah soal
const resetTimer = () => {
  setTimeLeft(TIME_PER_QUESTION);
  setIsTimerActive(true);
};
```

Buat komponen Timer — `src/components/game/Timer.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface TimerProps {
  timeLeft: number;
  total: number;
}

export function Timer({ timeLeft, total }: TimerProps) {
  const percentage = (timeLeft / total) * 100;
  const isUrgent = timeLeft <= 5;

  return (
    <div className="flex items-center gap-3">
      <motion.span
        key={timeLeft}
        animate={{ scale: isUrgent ? [1, 1.2, 1] : 1 }}
        className={`text-2xl font-bold tabular-nums ${
          isUrgent ? "text-red-500" : "text-gray-700"
        }`}
      >
        {timeLeft}s
      </motion.span>
      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            isUrgent ? "bg-red-500" : "bg-green-500"
          }`}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
```

### 2.2 Difficulty Levels

Update struktur data soal di `src/data/questions.ts`:

```typescript
// Tambahkan field difficulty ke setiap soal
export interface Question {
  id: string;
  category: "agama" | "sejarah" | "pengetahuan-umum";
  difficulty: "easy" | "medium" | "hard"; // ← BARU
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string; // ← BARU (opsional, untuk review jawaban)
}

// Contoh soal dengan difficulty
export const questions: Question[] = [
  {
    id: "agama-001",
    category: "agama",
    difficulty: "easy",
    question: "Berapa jumlah rukun Islam?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "5",
    explanation: "Lima Rukun Islam: Syahadat, Shalat, Zakat, Puasa, Haji.",
  },
  // ... soal lainnya
];
```

Tambah UI pemilih difficulty di landing page:

```tsx
// src/components/game/DifficultySelector.tsx
"use client";

type Difficulty = "all" | "easy" | "medium" | "hard";

const difficulties = [
  { value: "all", label: "Semua", color: "bg-gray-100 text-gray-700", emoji: "🎯" },
  { value: "easy", label: "Mudah", color: "bg-green-100 text-green-700", emoji: "🟢" },
  { value: "medium", label: "Sedang", color: "bg-yellow-100 text-yellow-700", emoji: "🟡" },
  { value: "hard", label: "Sulit", color: "bg-red-100 text-red-700", emoji: "🔴" },
];

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
}

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {difficulties.map((d) => (
        <button
          key={d.value}
          onClick={() => onChange(d.value as Difficulty)}
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            value === d.value
              ? `${d.color} ring-2 ring-offset-2 ring-current scale-105`
              : "bg-white text-gray-500 border hover:bg-gray-50"
          }`}
        >
          {d.emoji} {d.label}
        </button>
      ))}
    </div>
  );
}
```

### 2.3 Kategori Baru

Tambahkan kategori di `src/data/questions.ts`:

```typescript
// Kategori baru yang bisa ditambahkan
export type Category =
  | "agama"
  | "sejarah"
  | "pengetahuan-umum"
  | "sains"        // ← BARU
  | "geografi"     // ← BARU
  | "teknologi"    // ← BARU
  | "olahraga";    // ← BARU

export const categoryConfig = {
  agama: { label: "Agama", emoji: "🕌", color: "from-green-400 to-green-600" },
  sejarah: { label: "Sejarah", emoji: "📜", color: "from-amber-400 to-amber-600" },
  "pengetahuan-umum": { label: "Pengetahuan Umum", emoji: "🌍", color: "from-blue-400 to-blue-600" },
  sains: { label: "Sains", emoji: "🔬", color: "from-purple-400 to-purple-600" },
  geografi: { label: "Geografi", emoji: "🗺️", color: "from-teal-400 to-teal-600" },
  teknologi: { label: "Teknologi", emoji: "💻", color: "from-indigo-400 to-indigo-600" },
  olahraga: { label: "Olahraga", emoji: "⚽", color: "from-orange-400 to-orange-600" },
};
```

### 2.4 Review Jawaban di Halaman Hasil

Update `src/app/result/page.tsx` — tambahkan section review:

```tsx
// Setelah skor ditampilkan, tampilkan review per soal
<section className="mt-8 space-y-4">
  <h2 className="text-xl font-bold">📋 Review Jawaban</h2>
  {answeredQuestions.map((q, index) => (
    <div
      key={q.id}
      className={`p-4 rounded-xl border-2 ${
        q.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
      }`}
    >
      <p className="font-medium text-sm text-gray-500">Soal {index + 1}</p>
      <p className="font-semibold mt-1">{q.question}</p>
      <p className={`mt-2 text-sm ${q.isCorrect ? "text-green-700" : "text-red-700"}`}>
        Jawaban kamu: <strong>{q.selectedAnswer ?? "Tidak dijawab"}</strong>
      </p>
      {!q.isCorrect && (
        <p className="text-sm text-gray-700 mt-1">
          Jawaban benar: <strong>{q.correctAnswer}</strong>
        </p>
      )}
      {q.explanation && (
        <p className="text-xs text-gray-500 mt-2 italic">💡 {q.explanation}</p>
      )}
    </div>
  ))}
</section>
```

---

## 🏆 Phase 3 — Leaderboard & Profil (v1.3.0)

> **Goal:** Tambah fitur sosial yang mendorong kompetisi antar user.
> **Estimasi:** 1–2 minggu (setelah Phase 1 selesai)

### 3.1 Halaman Leaderboard

Buat `src/app/leaderboard/page.tsx`:

```tsx
import { prisma } from "@/lib/prisma";

// Fetch data langsung di server component
async function getLeaderboard(category?: string) {
  const scores = await prisma.score.groupBy({
    by: ["userId"],
    where: category ? { category } : undefined,
    _max: { score: true },
    orderBy: { _max: { score: "desc" } },
    take: 10,
  });

  const userIds = scores.map((s) => s.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, image: true },
  });

  return scores.map((s, index) => ({
    rank: index + 1,
    user: users.find((u) => u.id === s.userId),
    bestScore: s._max.score,
  }));
}

export default async function LeaderboardPage() {
  const data = await getLeaderboard();

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard</h1>
      <div className="space-y-3">
        {data.map((entry) => (
          <div
            key={entry.user?.id}
            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm"
          >
            <span className="text-2xl font-bold text-gray-300 w-8">
              #{entry.rank}
            </span>
            <img
              src={entry.user?.image ?? "/default-avatar.png"}
              alt={entry.user?.name ?? "User"}
              className="w-10 h-10 rounded-full"
            />
            <span className="flex-1 font-semibold">{entry.user?.name}</span>
            <span className="text-xl font-bold text-indigo-600">
              {entry.bestScore}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
```

### 3.2 Halaman Profil User

Buat `src/app/profile/page.tsx`:

```tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const scores = await prisma.score.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    totalGames: scores.length,
    bestScore: Math.max(...scores.map((s) => s.score), 0),
    avgScore:
      scores.length > 0
        ? Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length)
        : 0,
    gradeA: scores.filter((s) => s.grade === "A").length,
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <img
          src={session.user.image ?? "/default-avatar.png"}
          alt={session.user.name ?? "User"}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{session.user.name}</h1>
          <p className="text-gray-500">{session.user.email}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { label: "Total Main", value: stats.totalGames, emoji: "🎮" },
          { label: "Skor Terbaik", value: stats.bestScore, emoji: "⭐" },
          { label: "Rata-rata", value: stats.avgScore, emoji: "📊" },
          { label: "Grade A", value: stats.gradeA, emoji: "🏆" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-3xl mb-1">{stat.emoji}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Riwayat */}
      <h2 className="text-xl font-bold mb-4">Riwayat Permainan</h2>
      <div className="space-y-2">
        {scores.slice(0, 10).map((score) => (
          <div
            key={score.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
          >
            <div>
              <span className="font-medium capitalize">{score.category}</span>
              <span className="text-xs text-gray-400 ml-2">
                {new Date(score.createdAt).toLocaleDateString("id-ID")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{score.score}</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  score.grade === "A"
                    ? "bg-green-100 text-green-700"
                    : score.grade === "B"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {score.grade}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
```

---

## 🎮 Phase 4 — Multiplayer Real-time (v2.0.0)

> **Goal:** Fitur paling impactful — tantang teman secara langsung!
> **Estimasi:** 3–4 minggu
> **⚠️ Catatan:** Selesaikan Phase 1–3 dahulu sebelum ini.

### 4.1 Install Dependencies

```bash
npm install socket.io socket.io-client
npm install uuid
npm install -D @types/uuid
```

### 4.2 Skema Database Tambahan

Tambahkan ke `prisma/schema.prisma`:

```prisma
model GameRoom {
  id        String   @id @default(cuid())
  code      String   @unique @default(cuid()) // kode unik 6 karakter
  hostId    String
  status    String   @default("waiting") // "waiting" | "playing" | "finished"
  category  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  players   RoomPlayer[]
}

model RoomPlayer {
  id         String    @id @default(cuid())
  roomId     String
  userId     String
  score      Int       @default(0)
  isReady    Boolean   @default(false)
  finishedAt DateTime?

  room GameRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)
  user User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([roomId, userId])
}
```

### 4.3 Socket.io Server

Buat `src/server/socket.ts` (jalankan sebagai custom server):

```typescript
import { Server as SocketIOServer } from "socket.io";
import { prisma } from "@/lib/prisma";

export function initSocketServer(httpServer: any) {
  const io = new SocketIOServer(httpServer, {
    cors: { origin: process.env.NEXTAUTH_URL },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Buat room baru
    socket.on("create-room", async ({ userId, category }) => {
      const room = await prisma.gameRoom.create({
        data: { hostId: userId, category, code: generateRoomCode() },
      });
      socket.join(room.id);
      socket.emit("room-created", room);
    });

    // Join room yang ada
    socket.on("join-room", async ({ roomCode, userId }) => {
      const room = await prisma.gameRoom.findUnique({
        where: { code: roomCode },
        include: { players: { include: { user: true } } },
      });

      if (!room || room.status !== "waiting") {
        socket.emit("error", "Room tidak ditemukan atau sudah dimulai.");
        return;
      }

      await prisma.roomPlayer.upsert({
        where: { roomId_userId: { roomId: room.id, userId } },
        create: { roomId: room.id, userId },
        update: {},
      });

      socket.join(room.id);
      io.to(room.id).emit("player-joined", { roomId: room.id });
    });

    // Mulai game (host only)
    socket.on("start-game", async ({ roomId }) => {
      await prisma.gameRoom.update({
        where: { id: roomId },
        data: { status: "playing" },
      });
      io.to(roomId).emit("game-started", { roomId });
    });

    // Submit jawaban
    socket.on("submit-answer", async ({ roomId, userId, isCorrect }) => {
      if (isCorrect) {
        await prisma.roomPlayer.update({
          where: { roomId_userId: { roomId, userId } },
          data: { score: { increment: 10 } },
        });
      }

      const players = await prisma.roomPlayer.findMany({
        where: { roomId },
        include: { user: { select: { name: true } } },
      });

      io.to(roomId).emit("score-updated", players);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
```

### 4.4 Halaman Multiplayer

Buat `src/app/multiplayer/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MultiplayerPage() {
  const [roomCode, setRoomCode] = useState("");
  const [mode, setMode] = useState<"choose" | "create" | "join">("choose");
  const router = useRouter();

  const handleCreate = async () => {
    const res = await fetch("/api/rooms", {
      method: "POST",
      body: JSON.stringify({ category: "pengetahuan-umum" }),
      headers: { "Content-Type": "application/json" },
    });
    const room = await res.json();
    router.push(`/multiplayer/room/${room.code}`);
  };

  const handleJoin = () => {
    if (roomCode.length === 6) {
      router.push(`/multiplayer/room/${roomCode}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-4xl font-bold">⚔️ Multiplayer</h1>
      <p className="text-gray-500 text-center">Tantang temanmu secara real-time!</p>

      {mode === "choose" && (
        <div className="flex gap-4">
          <button
            onClick={() => setMode("create")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
          >
            🏠 Buat Room
          </button>
          <button
            onClick={() => setMode("join")}
            className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50"
          >
            🚀 Gabung Room
          </button>
        </div>
      )}

      {mode === "create" && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600">Pilih kategori lalu buat room:</p>
          <button
            onClick={handleCreate}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700"
          >
            Buat Room Sekarang
          </button>
          <button onClick={() => setMode("choose")} className="text-gray-400 text-sm underline">
            Kembali
          </button>
        </div>
      )}

      {mode === "join" && (
        <div className="flex flex-col items-center gap-4">
          <input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={6}
            placeholder="Masukkan kode room (6 karakter)"
            className="px-4 py-3 border-2 rounded-xl text-center text-xl tracking-widest font-mono uppercase focus:border-indigo-500 outline-none"
          />
          <button
            onClick={handleJoin}
            disabled={roomCode.length !== 6}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-40"
          >
            Gabung →
          </button>
          <button onClick={() => setMode("choose")} className="text-gray-400 text-sm underline">
            Kembali
          </button>
        </div>
      )}
    </main>
  );
}
```

---

## 🌐 Phase 5 — Deployment

> Deploy Qurio ke internet agar bisa dibagikan dan masuk portofolio!

### 5.1 Deploy ke Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Atau push ke GitHub dan connect repo di vercel.com
```

**Environment variables yang perlu diset di Vercel Dashboard:**

```
DATABASE_URL=        ← pooled connection URL dari Neon
DIRECT_URL=          ← direct connection URL dari Neon
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://qurio.vercel.app
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

> ⚠️ Jangan lupa tambahkan `DIRECT_URL` — Prisma butuh ini saat Vercel menjalankan migrasi di production.

### 5.2 Deploy ke Railway (Alternative, cocok untuk Socket.io)

Socket.io membutuhkan persistent server, Vercel tidak mendukung ini. Gunakan Railway:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login dan deploy
railway login
railway init
railway up
```

---

## 📋 Checklist Pengerjaan

### Phase 0 — Technical Foundation ✅ COMPLETE
- [x] Setup testing infrastructure (Vitest + React Testing Library)
- [x] Write comprehensive tests for GameContext (12 tests)
- [x] Implement Error Boundary
- [x] Create ErrorFallback component
- [x] Extract AnimatedBackground component (remove duplication)
- [x] Add keyboard navigation support
- [x] Add ARIA labels and accessibility features
- [x] Verify WCAG AA compliance

### Phase 1 — Backend & Auth ✅ COMPLETE
- [x] Buat akun & project di Neon (neon.tech)
- [x] Copy `DATABASE_URL` dan `DIRECT_URL` dari Neon dashboard
- [x] Install Prisma + NextAuth
- [x] Buat `prisma/schema.prisma`
- [x] Jalankan `npx prisma db push`
- [x] Setup `src/auth.ts` (moved from lib/)
- [x] Setup `src/lib/prisma.ts`
- [x] Buat API route `/api/scores` (GET + POST)
- [x] Buat API route `/api/categories` (GET)
- [x] Buat halaman `/login` dengan OAuth buttons
- [x] Buat halaman `/dashboard` dengan 3 sections
- [x] Buat components: ProfileCard, QuizHistory, Statistics
- [x] Integrasi simpan skor di GameContext
- [x] Setup middleware untuk protected routes
- [x] Add SessionProvider wrapper
- [x] Configure image domains untuk OAuth profile pics
- [x] Test login + simpan skor end-to-end

### Phase 2 — Fitur Gameplay
- [ ] Tambah field `difficulty` di semua 60 soal
- [ ] Tambah field `explanation` di soal (minimal 20 soal)
- [ ] Buat komponen `Timer.tsx`
- [ ] Integrasi timer ke `useQuizEngine.ts`
- [ ] Buat komponen `DifficultySelector.tsx`
- [ ] Tambah minimal 1 kategori baru (+ 20 soal)
- [ ] Buat section review jawaban di halaman result

### Phase 3 — Leaderboard & Profil
- [ ] Buat halaman `/leaderboard`
- [ ] Buat halaman `/profile`
- [ ] Tambah navigasi ke halaman baru di header
- [ ] Update navbar dengan user avatar + dropdown menu

### Phase 4 — Multiplayer
- [ ] Setup custom server dengan Socket.io
- [ ] Update Prisma schema (GameRoom, RoomPlayer)
- [ ] Buat socket server handler
- [ ] Buat halaman `/multiplayer`
- [ ] Buat halaman `/multiplayer/room/[code]`
- [ ] Test dengan 2 browser berbeda

### Phase 5 — Deployment
- [ ] Setup environment variables
- [ ] Deploy ke Vercel (Phase 1–3) atau Railway (Phase 4)
- [ ] Test di production
- [ ] Update README dengan live demo link

---

## 💡 Tips Portofolio

1. **Deploy setelah setiap Phase selesai** — biar ada live link yang bisa ditunjukkan
2. **Screenshot atau rekam demo GIF** — taruh di README dan portofolio website
3. **Tulis tech stack dengan jelas** di README (Next.js, Prisma, Neon, Socket.io, dsb)
4. **Commit message yang rapi** — recruiter kadang buka commit history
5. **Buat branch per fitur** — `feature/auth`, `feature/leaderboard`, `feature/multiplayer`

---

*Dibuat untuk Qurio oleh Claude — Juni 2026*
