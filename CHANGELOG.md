# Changelog

All notable changes to Qurio project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-06-23

### Added
- **Authentication System**
  - NextAuth v5 implementation with OAuth providers
  - Google OAuth login integration
  - GitHub OAuth login integration
  - JWT session strategy (30-day expiration)
  - Protected routes via middleware (/play, /result, /dashboard)
  - Login page with OAuth buttons
  - Session management with SessionProvider

- **Database Infrastructure**
  - Prisma ORM 5.22.0 setup
  - Neon PostgreSQL integration (Singapore region)
  - 8 database models: User, Account, Session, VerificationToken, Category, Question, Score, Answer
  - Database seed script (60 questions, 3 categories)
  - Prisma Client singleton for connection management

- **User Dashboard**
  - Dashboard page (/dashboard) with three sections
  - Profile section: user info, OAuth profile picture, join date
  - Statistics section: total games, average score, best score, best category
  - Quiz history: recent quiz results with grades, dates, scores
  - AnimatedBackground "dashboard" variant
  - Responsive layout (mobile + desktop)

- **API Routes**
  - GET /api/scores - Fetch user's score history with category details
  - POST /api/scores - Save quiz result to database
  - GET /api/categories - Fetch categories for slug→UUID mapping
  - Full authentication via NextAuth session
  - Proper error handling (401, 400, 500 status codes)

- **Score Persistence**
  - Auto-save quiz results to database after completion
  - GameContext integration with API routes
  - Non-blocking API calls (doesn't block result page)
  - Error state management (isSavingScore, saveError)

- **Testing Infrastructure**
  - Vitest 4.1.9 testing framework
  - @testing-library/react 16.3.2 for React component testing
  - jsdom environment configuration
  - 12 comprehensive tests for GameContext
  - Test scripts: test, test:ui, test:coverage

- **Error Handling**
  - ErrorBoundary component (class component)
  - ErrorFallback UI component
  - Graceful error recovery with "Try Again" and "Go Home" buttons
  - Console error logging in dev mode

- **Accessibility Improvements (WCAG AA)**
  - Keyboard navigation support (Enter/Space keys)
  - Focus indicators (focus-visible:ring)
  - ARIA labels (role, aria-label, aria-pressed, aria-disabled)
  - Screen reader support (aria-live regions)
  - Visual feedback beyond color (text labels with icons)

- **Navigation & UX**
  - Dashboard link on homepage (conditional - only when logged in)
  - "Lihat Dashboard" button on result page
  - Logout button in dashboard (top-right)
  - Protected route middleware for /dashboard

- **Configuration**
  - Image domain configuration for OAuth profile pictures (Google, GitHub)
  - Environment variable template (.env.example)
  - Comprehensive setup documentation (docs/BACKEND_SETUP.md)

### Changed
- **GameContext Enhancements**
  - Added categoryId state for database integration
  - Added isSavingScore and saveError state
  - Fetch categoryId at game start via API
  - saveScoreToDatabase() function for persistence
  - Updated types.ts with new state fields

- **Component Improvements**
  - AnimatedBackground component extracted (removed ~50 lines duplication)
  - AnimatedBackground variants: home, play, result, dashboard
  - QuestionCard with keyboard navigation and ARIA labels
  - ScoreBoard with aria-live and role="progressbar"

- **Project Structure**
  - New folders: prisma/, docs/, src/app/api/, src/app/dashboard/
  - New folders: src/components/dashboard/, src/components/auth/, src/components/error/
  - New folders: src/context/__tests__/, src/lib/, src/test/
  - Added auth.ts and middleware.ts at root

### Fixed
- OAuth profile pictures not loading (added image domains to next.config.ts)
- Import/export mismatches in login page components
- Module resolution for @/auth path (moved auth.ts to src/)
- TypeScript strict mode compliance across all new files

### Development
- 7 new git commits documenting Phase 0 and Phase 1
- Total: 800+ lines of code added
- Build time: ~4.5s (Next.js 16 with Turbopack)
- Test execution: ~60ms for 12 tests

---

## [1.0.0] - 2025-12-17

### Added
- **Initial MVP Release**
  - 60 questions across 3 categories (Agama, Sejarah, Pengetahuan Umum)
  - Interactive quiz system (10 questions per session)
  - Question randomization (Fisher-Yates algorithm)
  - Score calculation system (10 points per correct answer)
  - Grading system: A (≥80%), B (60-79%), C (<60%)

- **UI/UX**
  - Modern landing page with category selection
  - Quiz interface with QuestionCard and ScoreBoard
  - Result page with grade display and motivational messages
  - Framer Motion animations
  - AnimatedBackground with bubble effects
  - Confetti celebration for scores ≥80%
  - Fully responsive design (mobile-first)

- **Sound System**
  - Web Audio API integration
  - Programmatic sound generation
  - Correct answer: upward chime (C5→E5→G5)
  - Wrong answer: downward buzz (A3→A2)
  - Button click: subtle tap (800Hz)

- **Technical Foundation**
  - Next.js 16 with App Router
  - React 19 with Server/Client Components
  - TypeScript 5 with strict mode
  - Tailwind CSS 4 with utility-first approach
  - GameContext for state management
  - Custom hooks: useQuizEngine, useSoundEffects

### Fixed
- Score counter animation (removed shake effect)
- TypeScript warnings in useSoundEffects hook
- Category card alignment issues
- Result page layout optimization

### Changed
- Result page to compact layout
- Enhanced motivational card design
- Improved spacing between components
- Updated .gitignore configuration

---

## Git History

**Phase 1 Commits:**
- `c148d9c` - fix(config): add OAuth profile image domains
- `99232a6` - feat(dashboard): Phase 1 Day 3-4 - User dashboard complete
- `eaa36e1` - feat(auth): Phase 1 Day 2 - NextAuth v5 complete
- `948ebd1` - feat(backend): Phase 1 Day 1 - database setup complete

**Phase 0 Commits:**
- `8972309` - feat: add accessibility improvements (WCAG AA)
- `8f55021` - refactor: extract AnimatedBackground component
- `290b453` - feat: add testing infrastructure and error boundary

**MVP Commits:**
- `19e354c` - Qurio v1.0
- `f3a37e3` - Initial commit from Create Next App

---

## Upcoming

See [README.md](README.md#-future-roadmap) for future roadmap.

**Next Release: v1.5.0 - Admin Dashboard (Q3 2026)**
