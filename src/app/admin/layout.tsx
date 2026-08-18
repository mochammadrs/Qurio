"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import {
  LayoutDashboard,
  Tags,
  BookOpen,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";

const sidebarNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Kategori", icon: Tags },
  { href: "/admin/questions", label: "Pertanyaan", icon: BookOpen },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    if (session.user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-muted">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") {
    return null;
  }

  const navContent = (
    <>
      <div className="px-5 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="label-sm font-semibold text-text-primary">Admin Panel</p>
            <p className="text-xs text-text-muted">Qurio</p>
          </div>
        </div>
      </div>

      <div className="px-3 mb-6">
        <div className="h-px bg-border" />
      </div>

      <nav className="px-3 space-y-1">
        {sidebarNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-md transition-all relative" +
                (isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-text-secondary hover:bg-surface-low hover:text-text-primary")
              }
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
              )}
              <Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-3 pb-4">
        <div className="h-px bg-border mb-4 mx-2" />
        <div className="flex items-center gap-3 px-3 py-2">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="label-sm text-primary font-medium">
                {session.user?.name?.charAt(0) ?? "A"}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="label-sm text-text-primary truncate">{session.user?.name ?? "Admin"}</p>
            <p className="text-xs text-text-muted truncate">{session.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/5 transition-colors"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="hidden lg:flex lg:w-64 border-r border-border bg-surface-card h-screen sticky top-0 flex-col overflow-y-auto">
        {navContent}
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={
          "fixed inset-y-0 left-0 z-50 w-72 bg-surface-card border-r border-border flex flex-col lg:hidden transition-transform duration-200 " +
          (mobileOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="label-sm font-semibold text-text-primary">Menu</p>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg hover:bg-surface-low transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>
        {navContent}
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden sticky top-0 z-30 bg-surface-card border-b border-border px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg hover:bg-surface-low transition-colors"
          >
            <Menu className="w-5 h-5 text-text-primary" />
          </button>
          <span className="label-sm font-semibold text-text-primary">Admin Panel</span>
        </header>
        <Header />
        <main className="flex-1 max-w-container mx-auto px-6 lg:px-8 py-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
