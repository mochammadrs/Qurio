# 🎯 Qurio - Where Curiosity Begins

> Platform kuis interaktif yang mengubah proses belajar menjadi pengalaman yang menyenangkan dan engaging.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Status](https://img.shields.io/badge/status-Production_Ready-success)

**Qurio** adalah aplikasi web quiz modern yang dirancang untuk membuat pembelajaran menjadi lebih interaktif dan menyenangkan. Dengan 60 soal berkualitas di 3 kategori berbeda, sistem grading yang fair, dan sound effects yang immersive, Qurio memberikan pengalaman kuis yang complete.

---

## ✨ Features

### Core Features
- 🎯 **Interactive Quiz System:** 10 pertanyaan per sesi dari pool 60 soal berkualitas
- 📚 **3 Kategori Utama:** Agama, Sejarah, Pengetahuan Umum (masing-masing 20 soal)
- 🎨 **Modern UI Design:** Clean dan playful dengan animated elements
- 📱 **Fully Responsive:** Mobile-first design, optimal di semua devices
- ⚡ **Lightning Fast:** Next.js 16 dengan Turbopack untuk performa maksimal
- 🎭 **Smooth Animations:** Framer Motion untuk transitions yang buttery smooth

### User Experience
- 🏆 **Grade System:** Sistem grading A/B/C dengan visual feedback
- 🎵 **Sound Effects:** Web Audio API untuk feedback audio yang immersive
- 🎉 **Celebration Effects:** Confetti animation untuk high scores (≥80%)
- 💚 **Instant Feedback:** Real-time validation dengan color-coded indicators
- 📊 **Score Tracking:** Real-time score display dengan animated counter
- 🔀 **Smart Randomization:** Questions & options di-shuffle setiap game

### Technical Highlights
- ✅ **Type Safety:** Full TypeScript dengan strict mode
- ✅ **Data Validation:** Zod schema validation untuk runtime safety
- ✅ **State Management:** React Context API untuk global state
- ✅ **Performance:** Server & Client Components optimization
- ✅ **Code Quality:** ESLint + Prettier configuration

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x atau lebih tinggi (recommended: 20.x)
- **npm**, **yarn**, atau **pnpm** package manager
- **Git** untuk version control

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/qurio.git
cd qurio/qurio-web

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) dengan browser untuk melihat aplikasi.

### Available Scripts

```bash
# Development mode dengan hot reload
npm run dev

# Build untuk production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 🏗️ Project Structure

```
qurio-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   ├── play/page.tsx      # Quiz interface
│   │   └── result/page.tsx    # Result page
│   │
│   ├── components/            # React components
│   │   ├── game/             # Game components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # UI components
│   │
│   ├── context/              # React Context
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
│   └── utils/                # Utilities
│       └── cn.ts             # Classname utility
│
├── public/                    # Static files
├── MVP_QURIO_FINAL.md        # MVP documentation
└── README.md                 # This file
```

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework dengan Turbopack
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS

### Libraries & Tools
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Zod](https://zod.dev/)** - Schema validation
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[canvas-confetti](https://www.npmjs.com/package/canvas-confetti)** - Celebration effects
- **Web Audio API** - Sound generation

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

---

## 📖 How to Play

1. **Pilih Kategori**
   - Landing page menampilkan 3 kategori: Agama, Sejarah, Pengetahuan Umum
   - Click kategori untuk memulai quiz

2. **Mainkan Quiz**
   - Jawab 10 pertanyaan pilihan ganda
   - Setiap jawaban benar = 10 poin
   - Feedback langsung setelah submit
   - Score tracking real-time

3. **Lihat Hasil**
   - Grade A/B/C berdasarkan performa
   - Statistics breakdown
   - Motivational message
   - Option untuk main lagi

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

### ✅ Completed (MVP v1.0.0)

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

---

## 🔜 Future Roadmap

### Version 1.1.0 (Q1 2026)
- [ ] User authentication (email/social login)
- [ ] Personal leaderboard
- [ ] More categories (Sains, Geografi, Olahraga)
- [ ] Difficulty levels (Easy, Medium, Hard)
- [ ] Time limit per question

### Version 1.2.0 (Q2 2026)
- [ ] Multiplayer mode
- [ ] Real-time challenges
- [ ] Achievement system
- [ ] Profile customization
- [ ] Daily challenges

### Version 2.0.0 (Q3 2026)
- [ ] Mobile app (React Native)
- [ ] Offline mode (PWA)
- [ ] Community features
- [ ] Question submission by users
- [ ] Admin dashboard

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

### [1.0.0] - 2025-12-17
#### Added
- ✨ Initial release dengan MVP complete
- 🎯 60 soal di 3 kategori
- 🎨 Modern UI dengan Tailwind CSS 4
- 🎵 Sound effects dengan Web Audio API
- 🏆 Sistem grading A/B/C
- 🎉 Confetti celebration untuk high scores
- 📱 Fully responsive design
- ⚡ Performance optimization dengan Next.js 16

#### Fixed
- 🐛 Score counter animation (removed shake)
- 🐛 TypeScript warnings di useSoundEffects
- 🐛 Category card alignment issue
- 🐛 Result page layout optimization

#### Changed
- 🔄 Result page dengan compact layout
- 🔄 Enhanced motivational card design
- 🔄 Better spacing antar components
- 🔄 Improved .gitignore configuration

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

*Last Updated: December 17, 2025*
