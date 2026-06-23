# 🎯 Qurio - Where Curiosity Begins

> Platform kuis interaktif yang mengubah proses belajar menjadi pengalaman yang menyenangkan dan engaging.

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Status](https://img.shields.io/badge/status-Production_Ready-success)

**Qurio** adalah aplikasi web quiz modern dengan sistem autentikasi dan persistensi data yang lengkap. Dengan 60 soal berkualitas di 3 kategori berbeda, sistem grading yang fair, user dashboard untuk tracking progres, dan OAuth authentication, Qurio memberikan pengalaman kuis yang complete dan scalable.

---

## ✨ Features

### Core Features
- 🎯 **Interactive Quiz System:** 10 pertanyaan per sesi dari pool 60 soal berkualitas
- 📚 **3 Kategori Utama:** Agama, Sejarah, Pengetahuan Umum (masing-masing 20 soal)
- 🔐 **User Authentication:** OAuth login dengan Google dan GitHub
- 👤 **User Dashboard:** Profile, statistics, dan quiz history tracking
- 💾 **Data Persistence:** Scores tersimpan di database (Neon PostgreSQL)
- 🎨 **Modern UI Design:** Clean dan playful dengan animated elements
- 📱 **Fully Responsive:** Mobile-first design, optimal di semua devices
- ⚡ **Lightning Fast:** Next.js 16 dengan Turbopack untuk performa maksimal
- 🎭 **Smooth Animations:** Framer Motion untuk transitions yang buttery smooth

### User Experience
- 🏆 **Grade System:** Sistem grading A/B/C dengan visual feedback
- 📊 **Progress Tracking:** Dashboard dengan statistics (total games, avg score, best score)
- 📜 **Quiz History:** Riwayat quiz lengkap dengan tanggal dan grade
- 🎵 **Sound Effects:** Web Audio API untuk feedback audio yang immersive
- 🎉 **Celebration Effects:** Confetti animation untuk high scores (≥80%)
- 💚 **Instant Feedback:** Real-time validation dengan color-coded indicators
- 🔀 **Smart Randomization:** Questions & options di-shuffle setiap game
- 🔒 **Protected Routes:** Content hanya bisa diakses setelah login

### Technical Highlights
- ✅ **Type Safety:** Full TypeScript dengan strict mode
- ✅ **Database:** Prisma ORM dengan Neon PostgreSQL
- ✅ **Authentication:** NextAuth v5 dengan OAuth providers
- ✅ **Testing:** Vitest + React Testing Library (12 tests)
- ✅ **Error Handling:** Error Boundary untuk graceful error recovery
- ✅ **Accessibility:** WCAG AA compliant (keyboard nav, ARIA labels)
- ✅ **State Management:** React Context API untuk global state
- ✅ **Performance:** Server & Client Components optimization
- ✅ **Code Quality:** ESLint + Prettier configuration

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x atau lebih tinggi (recommended: 20.x)
- **npm**, **yarn**, atau **pnpm** package manager
- **Git** untuk version control
- **Neon Account** untuk PostgreSQL database (gratis)
- **Google Cloud Console** untuk OAuth credentials
- **GitHub Account** untuk OAuth credentials

### Installation

```bash
# Clone repository
git clone https://github.com/mochammadrs/qurio.git
cd qurio/qurio-web

# Install dependencies
npm install
```

### Environment Setup

1. **Copy environment template:**
```bash
cp .env.example .env
```

2. **Setup Neon PostgreSQL:**
   - Buat account di [Neon](https://neon.tech)
   - Create new project (pilih Singapore region)
   - Copy connection string dari dashboard
   - Paste ke `.env` sebagai `DATABASE_URL` dan `DIRECT_URL`

3. **Setup OAuth Providers:**
   
   **Google OAuth:**
   - Buka [Google Cloud Console](https://console.cloud.google.com/)
   - Create project → Enable OAuth Consent Screen
   - Create OAuth 2.0 Client ID (Web application)
   - Add callback: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID dan Secret ke `.env`

   **GitHub OAuth:**
   - Buka [GitHub Developer Settings](https://github.com/settings/developers)
   - Register new OAuth App
   - Add callback: `http://localhost:3000/api/auth/callback/github`
   - Copy Client ID dan Secret ke `.env`

4. **Generate NextAuth Secret:**
```bash
npx auth secret
```
Copy output ke `.env` sebagai `NEXTAUTH_SECRET`

5. **Setup Database:**
```bash
# Push Prisma schema to database
npx prisma db push

# Seed database dengan 60 questions
npx prisma db seed

# (Optional) Open Prisma Studio untuk view data
npx prisma studio
```

6. **Run Development Server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) dengan browser untuk melihat aplikasi.

📚 **Detailed Setup Guide:** Lihat `docs/BACKEND_SETUP.md` untuk step-by-step instructions.

### Available Scripts

```bash
# Development mode dengan hot reload
npm run dev

# Run tests
npm test

# Run tests dengan UI
npm run test:ui

# Build untuk production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Database commands
npx prisma studio      # Open database GUI
npx prisma db push     # Push schema changes
npx prisma db seed     # Seed database
npx prisma generate    # Generate Prisma Client
```

---

## 🏗️ Project Structure

```
qurio-web/
├── prisma/
│   ├── schema.prisma          # Database schema (8 models)
│   └── seed.ts               # Database seed script
│
├── docs/
│   └── BACKEND_SETUP.md      # Backend setup guide
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/
│   │   │   └── login/        # Login page
│   │   ├── api/              # API Routes
│   │   │   ├── auth/         # NextAuth endpoints
│   │   │   ├── categories/   # Category API
│   │   │   └── scores/       # Score API
│   │   ├── dashboard/        # User dashboard
│   │   ├── play/             # Quiz interface
│   │   ├── result/           # Result page
│   │   └── layout.tsx        # Root layout
│   │
│   ├── components/
│   │   ├── auth/             # Auth components
│   │   │   └── SessionProvider.tsx
│   │   ├── dashboard/        # Dashboard components
│   │   │   ├── ProfileCard.tsx
│   │   │   ├── QuizHistory.tsx
│   │   │   └── Statistics.tsx
│   │   ├── error/            # Error handling
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── ErrorFallback.tsx
│   │   ├── game/             # Game components
│   │   │   ├── QuestionCard.tsx
│   │   │   └── ScoreBoard.tsx
│   │   └── ui/               # UI components
│   │       ├── AnimatedBackground.tsx
│   │       └── Button.tsx
│   │
│   ├── context/              # React Context
│   │   ├── __tests__/        # Context tests
│   │   │   └── GameContext.test.tsx
│   │   ├── GameContext.tsx   # Game state
│   │   └── types.ts          # Context types
│   │
│   ├── data/
│   │   └── questions.ts      # Question database (60 soal)
│   │
│   ├── hooks/                # Custom hooks
│   │   ├── useQuizEngine.ts  # Quiz logic
│   │   └── useSoundEffects.ts # Sound system
│   │
│   ├── lib/
│   │   └── prisma.ts         # Prisma client singleton
│   │
│   ├── test/
│   │   └── setup.ts          # Test configuration
│   │
│   └── utils/                # Utilities
│       └── cn.ts             # Classname utility
│
├── auth.ts                   # NextAuth configuration
├── middleware.ts             # Route protection
├── vitest.config.ts          # Test configuration
├── .env                      # Environment variables (not committed)
├── .env.example              # Environment template
├── MVP_QURIO_FINAL.md        # MVP documentation
├── QURIO_DEVELOPMENT_ROADMAP.md # Development phases
└── README.md                 # This file
```

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework dengan Turbopack
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS

### Backend & Database
- **[Prisma 5](https://www.prisma.io/)** - Next-generation ORM
- **[Neon PostgreSQL](https://neon.tech/)** - Serverless PostgreSQL (Singapore region)
- **[NextAuth.js v5](https://next-auth.js.org/)** - Authentication library
- **OAuth Providers** - Google & GitHub authentication

### Libraries & Tools
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Zod](https://zod.dev/)** - Schema validation
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[canvas-confetti](https://www.npmjs.com/package/canvas-confetti)** - Celebration effects
- **Web Audio API** - Sound generation

### Testing & Quality
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[@testing-library/react](https://testing-library.com/)** - React testing utilities
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

---

## 📖 How to Play

1. **Login/Register**
   - Buka aplikasi → Click "Mulai Kuis"
   - Akan redirect ke halaman login
   - Pilih "Sign in with Google" atau "Sign in with GitHub"
   - Authorize aplikasi (sekali saja)

2. **Pilih Kategori**
   - Setelah login, pilih kategori: Agama, Sejarah, atau Pengetahuan Umum
   - Click kategori untuk memulai quiz

3. **Mainkan Quiz**
   - Jawab 10 pertanyaan pilihan ganda
   - Setiap jawaban benar = 10 poin
   - Feedback langsung setelah submit
   - Score tracking real-time

4. **Lihat Hasil**
   - Grade A/B/C berdasarkan performa
   - Statistics breakdown
   - Motivational message
   - **NEW:** Score otomatis tersimpan ke database

5. **Dashboard**
   - Click "Lihat Dashboard" untuk melihat:
     - Profile information
     - Total games played
     - Average score & best score
     - Quiz history lengkap dengan grades
   - Track progress dari waktu ke waktu

---

## 🎯 Grading System

| Grade | Persentase | Keterangan |
|-------|------------|------------|
| **A** | 80-100% | Luar Biasa! 🎉 |
| **B** | 60-79% | Bagus Sekali! 👏 |
| **C** | 0-59% | Terus Berlatih! 💪 |

---

## 🎵 Sound Effects

Qurio menggunakan **Web Audio API** untuk generate sound effects secara programmatic:

- **Correct Answer:** Upward chime (C5 → E5 → G5) - 400ms
- **Wrong Answer:** Downward buzz (A3 → A2) - 300ms
- **Button Click:** Subtle tap (800Hz) - 50ms
- **Celebration:** 5-note sequence untuk high scores

Sound effects dapat di-toggle on/off dan tidak memerlukan external audio files.

---

## 📊 Development Progress

### ✅ Completed (MVP v1.0.0 - December 2025)

#### Phase 1: Foundation (Week 1)
- [x] Project setup dengan Next.js 16 + TypeScript
- [x] Tailwind CSS 4 configuration
- [x] Folder structure & architecture
- [x] Question database (60 soal)
- [x] Data validation dengan Zod

#### Phase 2: Core Features (Week 2)
- [x] Landing page design
- [x] Quiz engine implementation
- [x] Question randomization
- [x] Score calculation system
- [x] Result page with grading

#### Phase 3: Enhancements (Week 3)
- [x] Framer Motion animations
- [x] Sound effects system
- [x] Confetti celebration
- [x] Responsive design
- [x] Category cards enhancement
- [x] Result page optimization

#### Phase 4: Polish (Week 4)
- [x] UI/UX improvements
- [x] Performance optimization
- [x] Bug fixes & testing
- [x] Documentation
- [x] Production ready

### ✅ Completed (Phase 0 - Technical Foundation - June 2026)
- [x] Testing infrastructure (Vitest + React Testing Library)
- [x] Error Boundary implementation
- [x] Code quality improvements (extracted AnimatedBackground)
- [x] Accessibility enhancements (WCAG AA - keyboard nav, ARIA labels)
- [x] 12 automated tests written and passing

### ✅ Completed (v1.1.0 - Backend & Authentication - June 2026)

#### Week 1: Database & Authentication
- [x] Prisma ORM setup (8 database models)
- [x] Neon PostgreSQL integration (Singapore region)
- [x] NextAuth v5 implementation
- [x] Google OAuth provider
- [x] GitHub OAuth provider
- [x] Protected routes via middleware
- [x] Session management (JWT strategy)

#### Week 1: User Dashboard
- [x] User dashboard page (profile, stats, history)
- [x] Profile section with OAuth profile pictures
- [x] Statistics tracking (total games, avg score, best score)
- [x] Quiz history display with grades
- [x] Score persistence to database
- [x] API routes (GET/POST /api/scores, GET /api/categories)
- [x] GameContext integration with database
- [x] Logout functionality

**Current Status:** v1.1.0 Production Ready ✅

---

## 🔜 Future Roadmap

### Version 1.5.0 - Admin Dashboard (Q3 2026)
- [ ] Admin authentication & role-based access control
- [ ] Admin dashboard untuk manage questions
- [ ] CRUD interface untuk categories
- [ ] Bulk import questions (CSV/JSON)
- [ ] Question preview & validation
- [ ] User management interface

### Version 1.6.0 - Enhanced Gameplay (Q3 2026)
- [ ] Timer per question (configurable)
- [ ] Difficulty levels (Easy, Medium, Hard)
- [ ] More question categories (expand beyond 3)
- [ ] Question shuffle modes
- [ ] Hints system (50:50, skip question)
- [ ] Power-ups & boosters

### Version 1.7.0 - Leaderboard & Social (Q4 2026)
- [ ] Global leaderboard (per category & all-time)
- [ ] Friend system (add/remove friends)
- [ ] Compare scores with friends
- [ ] Social sharing (share results to social media)
- [ ] Achievement system & badges
- [ ] Daily challenges

### Version 2.0.0 - Multiplayer (Q1 2027)
- [ ] Real-time multiplayer quiz rooms
- [ ] Socket.io integration
- [ ] Matchmaking system
- [ ] Ranked matches with ELO rating
- [ ] Live leaderboard during game
- [ ] Chat & reactions
- [ ] Mobile app (React Native)
- [ ] Offline mode (PWA)

**Note:** Roadmap subject to change based on user feedback and priorities.

---

## 🤝 Contributing

Contributions are welcome! Ikuti langkah berikut:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Update documentation bila ada perubahan
- Test di multiple devices sebelum PR
- Maintain code consistency

---

## 🐛 Bug Reports

Jika menemukan bug, silakan buat issue dengan detail:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (jika applicable)
- Browser & OS info

---

## 📝 Changelog

For detailed changelog, see [CHANGELOG.md](CHANGELOG.md)

### Recent Updates

**v1.1.0 (June 2026) - Backend & Authentication**
- ✨ User authentication with Google & GitHub OAuth
- 💾 Database integration with Neon PostgreSQL + Prisma
- 📊 User dashboard with profile, statistics, and quiz history
- 🔒 Protected routes with middleware
- ✅ Testing infrastructure with 12 automated tests
- ♿ Accessibility improvements (WCAG AA)
- 🐛 Error Boundary for graceful error handling

**v1.0.0 (December 2025) - MVP Launch**
- 🎯 60 questions across 3 categories
- 🏆 Grading system (A/B/C)
- 🎵 Sound effects & confetti
- 📱 Fully responsive design

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Mochammad Rizky Septian**
- GitHub: [@mochammadrs](https://github.com/mochammadrs)
- Email: rizkyseptian401@gmail.com

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animation library
- **Lucide** - Beautiful icon set
- **Vercel** - Deployment platform
- **Community** - Inspiration and support

---

## ⭐ Show Your Support

Jika project ini membantu kamu, berikan ⭐ di GitHub!

---

**Built with ❤️ and ☕ - Making Learning Fun Again!**

*Last Updated: June 23, 2026*
