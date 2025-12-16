import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { GameProvider } from "@/context/GameContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qurio - Where Curiosity Begins",
  description: "Platform kuis interaktif yang mengubah proses belajar menjadi micro-game yang adiktif",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-bg-canvas`}
      >
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
