"use client";

import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Overview",   href: "#overview"   },
  { label: "Toolkit",    href: "#toolkit"    },
  { label: "Experience", href: "#experience" },
  { label: "Projects",   href: "#projects"   },
  { label: "Hackathons", href: "#hackathons" },
  { label: "Education",  href: "#education"  },
  { label: "Contact",    href: "#contact"    },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={scrolled ? "fixed top-0 left-0 right-0 z-50 bg-pink-50/80 backdrop-blur-md shadow-sm border-b border-pink-100 transition-all duration-300" : "fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300"}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Brand */}
        <a href="#" className="text-rose-800 font-semibold text-sm tracking-widest uppercase">
          ✦ cessamae.dev
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-rose-700 text-sm hover:text-rose-900 transition-colors duration-200">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Hire Me */}
        <a href="#contact" className="hidden md:block text-sm bg-rose-800 text-white px-4 py-2 rounded-full hover:bg-rose-900 transition-colors duration-200">
          Hire Me
        </a>

        {/* Hamburger */}
        <button className="md:hidden focus:outline-none" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <div className="w-5 h-0.5 bg-rose-800 mb-1" />
          <div className="w-5 h-0.5 bg-rose-800 mb-1" />
          <div className="w-5 h-0.5 bg-rose-800" />
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-pink-50/95 backdrop-blur-md border-t border-pink-100 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-rose-700 text-sm hover:text-rose-900 transition-colors duration-200">
              {link.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)} className="text-sm bg-rose-800 text-white px-4 py-2 rounded-full text-center hover:bg-rose-900 transition-colors duration-200">
            Hire Me
          </a>
        </div>
      )}
    </header>
  );
}
