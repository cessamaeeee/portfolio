import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SplashCursor from "@/components/SplashCursor";

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
        <SplashCursor TRANSPARENT={true} RAINBOW_MODE={false} COLOR="#c06080" />
        {children}
      </body>
    </html>
  );
}
