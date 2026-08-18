"use client";

import Link from "next/link";
import { LogOut, User, LayoutDashboard, Menu, Sun, Moon, BarChart3, ShieldCheck } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useDarkMode } from "@/hooks/useDarkMode";

export function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isDark, toggle: toggleDark } = useDarkMode();

  useEffect(() => {
    setMounted(true);
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLoggedIn = !!session?.user;

  const navLinks = [
    { href: "/dashboard", label: "Agama" },
    { href: "/dashboard", label: "Sejarah" },
    { href: "/dashboard", label: "Umum" },
    { href: "/dashboard", label: "Geografi" },
    { href: "/dashboard", label: "Bahasa" },
    { href: "/dashboard", label: "Olahraga" },
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-container mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-headline-lg font-heading font-bold text-primary tracking-tight">
            Qurio
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-body-md text-text-secondary hover:text-primary transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/leaderboard"
            className="text-body-md text-text-secondary hover:text-primary transition-colors py-1 flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4" />
            Leaderboard
          </Link>
          {session?.user?.role === "admin" && (
            <Link
              href="/admin"
              className="text-body-md text-primary font-medium hover:opacity-80 transition-opacity py-1 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg hover:bg-surface-low transition-colors"
            aria-label={mounted && isDark ? "Mode terang" : "Mode gelap"}
          >
            {mounted && isDark ? (
              <Sun className="w-5 h-5 text-text-secondary" />
            ) : (
              <Moon className="w-5 h-5 text-text-secondary" />
            )}
          </button>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-surface-low transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {!isLoggedIn ? (
            <Link
              href="/login"
              className="label-sm text-primary hover:opacity-80 transition-opacity hidden sm:block"
            >
              Masuk
            </Link>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full border border-surface-dim overflow-hidden flex items-center justify-center bg-surface-high hover:ring-2 hover:ring-primary/20 transition-all"
                aria-label="Menu akun"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="label-sm font-medium uppercase text-primary">
                    {session.user?.name?.charAt(0) || "U"}
                  </span>
                )}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-background border border-surface-dim rounded-xl py-1 z-50">
                  <div className="px-4 py-3 border-b border-surface-dim">
                    <p className="label-sm font-semibold text-text-primary truncate">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-xs text-text-secondary truncate mt-0.5">
                      {session.user?.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-2.5 text-body-md text-text-primary hover:bg-surface-low transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LayoutDashboard className="text-text-secondary" size={18} />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-body-md text-text-primary hover:bg-surface-low transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="text-text-secondary" size={18} />
                    Profil
                  </Link>
                  <Link
                    href="/leaderboard"
                    className="flex items-center gap-3 px-4 py-2.5 text-body-md text-text-primary hover:bg-surface-low transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <BarChart3 className="text-text-secondary" size={18} />
                    Leaderboard
                  </Link>
                  {session?.user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-2.5 text-body-md text-primary font-medium hover:bg-surface-low transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <ShieldCheck className="text-primary" size={18} />
                      Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-surface-dim mt-1 pt-1">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-body-md text-error hover:bg-error-container/50 transition-colors"
                    >
                      <LogOut className="text-error" size={18} />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <nav className="flex flex-col gap-2 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="label-sm text-text-secondary hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/leaderboard"
              className="label-sm text-text-secondary hover:text-primary py-2 flex items-center gap-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BarChart3 className="w-4 h-4" />
              Leaderboard
            </Link>
            {session?.user?.role === "admin" && (
              <Link
                href="/admin"
                className="label-sm text-primary font-medium py-2 flex items-center gap-1.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Link>
            )}
            {!isLoggedIn && (
              <Link
                href="/login"
                className="label-sm text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Masuk
              </Link>
            )}
          </nav>
          <div className="border-t border-border p-4">
            <button
              onClick={toggleDark}
              className="w-full flex items-center gap-3 label-sm text-text-secondary hover:text-primary py-2"
            >
              {mounted && isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {mounted && isDark ? "Mode Terang" : "Mode Gelap"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
