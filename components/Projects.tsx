"use client";

import { useState } from "react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

// ─── Projects Data ───────────────────────
const PROJECTS = [
  {
    name:     "ScholarLink",
    type:     "Full-Stack Web App · Academic Project",
    oneliner: "An AI-powered scholarship management platform that eliminates the chaos of traditional scholarship applications for Filipino students and organizations alike.",
    excerpt:  "ScholarLink centralizes scholarship discovery, application, and screening into one transparent, bias-free platform. Built with intelligent matching, automated workflows, and a reusable document wallet — so students never have to submit the same paper twice.",
    full:     "Traditional scholarship systems in the Philippines are fragmented, paper-heavy, and riddled with bias. ScholarLink addresses this with a full-stack platform featuring AI-powered eligibility matching via the Gemini API, a Student Wallet for reusable document uploads, blind screening protocols, a dynamic weighted scoring engine, and real-time deadline automation. The system supports four distinct user roles — applicant, evaluator, admin, and superadmin — each with their own tailored dashboards and workflows.",
    role:     "Full Stack Developer & Database Lead — database architecture (13 tables, 22 relationships), backend integration, and system implementation.",
    awards:   "Best Booth Design · Best Pitch · Most Innovative · Best UI/UX · Best Booth Experience",
    stack:    ["Laravel 12", "MySQL", "Tailwind CSS", "Alpine.js", "Vite", "Gemini API", "Docker", "Render"],
    team:     "Banayad, Franchezca · Escano, Jose Jerico · Esteban, Karl Joseph · Frigillana, Nina Ysabelle · Lanuza, Elena Vale · Sanchez, Princess Mae",
    live:     "https://scholarlink-lzj5.onrender.com",
    photo:    "/ScholarLinkTeam.JPG",
  },
  {
    name:     "LakwatSafe",
    type:     "Mobile App · DLSU Hackercup 2025",
    oneliner: "A community-powered commuter safety app that turns everyday Filipino commuters into real-time hazard reporters — making every route a safer one.",
    excerpt:  "LakwatSafe tackles the fragmented, unsafe commuting experience in the Philippines by consolidating hazard data, crowdsourced incident reports, and route safety ratings into a single mobile platform built for low-bandwidth realities.",
    full:     "Born from the team's own experience navigating Metro Manila's unpredictable commutes, LakwatSafe features a live urban access map with auto-expiring hazard pins, an anonymous incident reporter routed to LGUs and advocacy groups, community-verified route ratings, and a low-bandwidth text-only mode for commuters with limited data. The app also includes AI-enhanced route recommendations and safety filters for flood-free, well-lit, and wheelchair-friendly paths.",
    role:     "Project Ideation · Backend Development · Project Presenter",
    awards:   "",
    stack:    ["React Native", "Expo", "Firebase", "Google Maps API", "Node.js"],
    team:     "Team Haricode — PLM",
    live:     "",
    photo:    "/DLSUHackecup.jpg",
  },
  {
    name:     "Wais Wallet",
    type:     "Web App · OOP Course Project",
    oneliner: "A personal finance tracker built to make budgeting less intimidating and savings more intentional for everyday users.",
    excerpt:  "Wais Wallet helps users take control of their money through expense tracking, budgeting tools, and savings goal monitoring — all in one clean, structured interface designed to build real financial habits.",
    full:     "Developed as an Object-Oriented Programming project, Wais Wallet focuses on empowering users with structured financial visibility. The app lets users log expenses, set budget limits per category, and track progress toward personal savings goals. The backend was designed with clean OOP principles, handling calculation logic, notifications for overspending, and API connections to the frontend.",
    role:     "Backend Developer — implemented notifications and alerts for bills/overspending, developed calculation logic for earnings over time, and connected frontend to backend via API endpoints.",
    awards:   "",
    stack:    ["Python", "Django", "SQLite", "HTML", "CSS", "JavaScript"],
    team:     "Frontend: Ysa Frigillana, Elena Lanuza, Lee Tuangco, Karl Esteban | Backend: Franchezca Banayad, Princess Mae Sanchez, Kenshin Cuerl Dizon | Database: John Benedict Listangco, Recson Avielle Rojo, Achilles Pajes",
    live:     "https://wais-wallet-development.onrender.com",
    photo:    "/WaisWalletLogo.png",
  },
];

// ─── Project Card ────────────────────────
function ProjectCard({ project, delay }: { project: typeof PROJECTS[0]; delay: number }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered,  setHovered]  = useState(false);

  return (
    <ScrollReveal delay={delay}>
      <div
        className="relative bg-white/50 backdrop-blur-sm border border-rose-100 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-rose-50/60 hover:border-rose-200 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Photo */}
        <div className="relative h-44 w-full overflow-hidden">
          <Image src={project.photo} alt={project.name} fill className="object-cover transition-transform duration-500 hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <p className="text-xs text-rose-400 uppercase tracking-widest mb-2">{project.type}</p>
          <h3 className="text-xl font-semibold text-rose-900 mb-2">{project.name}</h3>
          <p className="text-rose-600 text-sm italic mb-3">{project.oneliner}</p>
          <p className="text-rose-700 text-sm leading-relaxed mb-4">{project.excerpt}</p>

          {/* Stack Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.stack.map((s) => (
              <span key={s} className="text-xs bg-rose-100 text-rose-600 px-2.5 py-1 rounded-full">{s}</span>
            ))}
          </div>

          {/* Expanded */}
          {expanded && (
            <div className="mt-2 pt-4 border-t border-rose-100 flex flex-col gap-3">
              <p className="text-rose-700 text-sm leading-relaxed">{project.full}</p>
              <div>
                <p className="text-xs text-rose-400 uppercase tracking-widest mb-1">Role</p>
                <p className="text-rose-700 text-sm">{project.role}</p>
              </div>
              {project.awards && (
                <div>
                  <p className="text-xs text-rose-400 uppercase tracking-widest mb-1">Recognition</p>
                  <p className="text-rose-700 text-sm">{project.awards}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-rose-400 uppercase tracking-widest mb-1">Team</p>
                <p className="text-rose-700 text-sm">{project.team}</p>
              </div>
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-sm text-rose-600 underline hover:text-rose-900 transition-colors">
                  View Live
                </a>
              )}
            </div>
          )}

          {/* Read More */}
          <div className="mt-auto pt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className={`text-xs text-rose-600 border border-rose-200 px-4 py-1.5 rounded-full hover:bg-rose-100 transition-all duration-300 ${hovered || expanded ? "opacity-100" : "opacity-0"}`}
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

// ─── Projects Section ────────────────────
export default function Projects() {
  return (
    <section id="projects" className="max-w-6xl mx-auto px-6">
      <ScrollReveal>
        <p className="text-xs tracking-[0.2em] text-rose-400 uppercase mb-3">Projects</p>
        <h2 className="text-3xl font-semibold text-rose-900 mb-8">What I&apos;ve Built</h2>
      </ScrollReveal>
      <div className="grid md:grid-cols-3 gap-6">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.name} project={project} delay={i * 120} />
        ))}
      </div>
    </section>
  );
}
