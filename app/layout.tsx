import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
        <Cursor />
        {children}
      </body>
    </html>
  );
}
