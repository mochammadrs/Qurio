import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GameProvider } from "@/context/GameContext";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SessionProvider from "@/components/auth/SessionProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qurio - Where Curiosity Begins",
  description: "Platform kuis interaktif yang mengubah proses belajar menjadi micro-game yang adiktif",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Qurio",
  },
};

export const viewport: Viewport = {
  themeColor: "#312E81",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Qurio" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var dark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (dark) document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-surface`}>
        {typeof window !== "undefined" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                }
              `,
            }}
          />
        )}
        <SessionProvider>
          <ErrorBoundary>
            <GameProvider>{children}</GameProvider>
          </ErrorBoundary>
        </SessionProvider>
      </body>
    </html>
  );
}
