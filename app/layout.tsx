import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SplashCursor from "@/components/SplashCursor";
import Antigravity from "@/components/Antigravity";
import Cursor from "@/components/Cursor";

// ─── Font ────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// ─── Metadata ────────────────────────────
export const metadata: Metadata = {
  title: "Princess Mae Sanchez",
  description: "Computer Engineering Student · Full-Stack Developer · UI/UX Enthusiast",
};

// ─── Root Layout ─────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Custom pink cursor */}
        <Cursor />
        {/* Antigravity particle ring — cursor background layer */}
        <div className="fixed inset-0 pointer-events-none z-[45]">
          <Antigravity
            color="#f9a8c9"
            count={200}
            autoAnimate={true}
            particleShape="capsule"
            ringRadius={8}
            magnetRadius={12}
            waveAmplitude={0.8}
            particleSize={1.5}
          />
        </div>
        {/* SplashCursor fluid simulation — above Antigravity */}
        <SplashCursor TRANSPARENT={true} RAINBOW_MODE={false} COLOR="#c06080" />
        {children}
      </body>
    </html>
  );
}
