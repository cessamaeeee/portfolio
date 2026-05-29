"use client";

import { useState } from "react";

// ─── Hackathons Data ────────────────────
const HACKATHONS = [
  {
    event:   "Women in Tech: Codeathon",
    org:     "Cambridge University Press & Assessment",
    year:    "2026",
    track:   "Track 1 — Safety & Wellbeing",
    awards:  ["🥇 Champion — Coding Dojo", "🥈 2nd Place — Codeathon"],
    project: "QuietHelp",
    tagline: "Silence shouldn't mean you can't be heard.",
    excerpt: "QuietHelp is a discreet mobile safety app designed for Filipino women and vulnerable individuals facing harassment or abuse. A single hold of a button silently alerts trusted contacts, shares live location, and activates an SOS — no call needed, no confrontation risked.",
    full:    "Built for Track 1: Safety & Wellbeing, QuietHelp addresses the reality that 1 in 4 Filipino women experience physical or emotional abuse, yet many cannot safely call for help. The app features a one-tap silent SOS alert, real-time live location sharing, AI-customizable alert messages by keyword, and an emergency contacts system — all designed to work discreetly from a pocket. The MVP was built with a roadmap toward wearable integration and direct connection to 911 response centers and Barangay VAWC desks.",
    role:    "Project Ideation · Research & Pitch Development · Project Overseer · Q&A Presenter",
    stack:   ["React Native", "Firebase", "Twilio SMS API"],
    team:    "PLM — Women in Tech Delegation",
  },
  {
    event:   "DLSU Hackercup 2025",
    org:     "De La Salle University",
    year:    "2025",
    track:   "",
    awards:  [],
    project: "LakwatSafe",
    tagline: "Your community-powered map for safer, hassle-free lakwatsa.",
    excerpt: "Competed with Team Haricode from PLM against university teams across the country, presenting LakwatSafe — a community-driven commuter safety app built for the Philippine context.",
    full:    "LakwatSafe was developed and pitched at the DLSU Hackercup 2025 under the safety and civic tech space. The app consolidates real-time hazard data, crowdsourced incident reports, route safety ratings, and a low-bandwidth mode into a single platform built specifically for Filipino commuters.",
    role:    "Project Ideation · Backend Development · Project Presenter",
    stack:   ["React Native", "Expo", "Firebase", "Google Maps API", "Node.js"],
    team:    "Team Haricode — PLM",
  },
];

// ─── Hackathon Card ─────────────────────
function HackathonCard({ h }: { h: typeof HACKATHONS[0] }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered,  setHovered]  = useState(false);

  return (
    <div
      className="bg-white/50 backdrop-blur-sm border border-rose-100 rounded-2xl p-6 transition-all duration-300 hover:bg-rose-50/60 hover:border-rose-200 hover:shadow-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Event Info */}
      <div className="flex flex-col md:flex-row md:justify-between gap-1 mb-3">
        <div>
          <p className="font-semibold text-rose-900">{h.event}</p>
          <p className="text-rose-500 text-sm">{h.org}</p>
          {h.track && <p className="text-rose-400 text-xs mt-0.5">{h.track}</p>}
        </div>
        <p className="text-rose-300 text-sm">{h.year}</p>
      </div>

      {/* Awards */}
      {h.awards.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {h.awards.map((a) => (
            <span key={a} className="text-xs bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-medium">
              {a}
            </span>
          ))}
        </div>
      )}

      {/* Project */}
      <p className="text-xs text-rose-400 uppercase tracking-widest mb-1">Project</p>
      <p className="font-semibold text-rose-800 mb-1">{h.project}</p>
      <p className="text-rose-600 text-sm italic mb-3">&ldquo;{h.tagline}&rdquo;</p>
      <p className="text-rose-700 text-sm leading-relaxed mb-4">{h.excerpt}</p>

      {/* Stack */}
      <div className="flex flex-wrap gap-2 mb-2">
        {h.stack.map((s) => (
          <span key={s} className="text-xs bg-rose-100 text-rose-600 px-2.5 py-1 rounded-full">
            {s}
          </span>
        ))}
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-rose-100 flex flex-col gap-3">
          <p className="text-rose-700 text-sm leading-relaxed">{h.full}</p>
          <div>
            <p className="text-xs text-rose-400 uppercase tracking-widest mb-1">Role</p>
            <p className="text-rose-700 text-sm">{h.role}</p>
          </div>
          <div>
            <p className="text-xs text-rose-400 uppercase tracking-widest mb-1">Team</p>
            <p className="text-rose-700 text-sm">{h.team}</p>
          </div>
        </div>
      )}

      {/* Read More */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`mt-4 text-xs text-rose-600 border border-rose-200 px-4 py-1.5 rounded-full hover:bg-rose-100 transition-all duration-300 ${hovered || expanded ? "opacity-100" : "opacity-0"}`}
      >
        {expanded ? "Show Less" : "Read More"}
      </button>

    </div>
  );
}

// ─── Hackathons Section ─────────────────
export default function Hackathons() {
  return (
    <section id="hackathons" className="max-w-6xl mx-auto px-6">

      <p className="text-xs tracking-[0.2em] text-rose-400 uppercase mb-3">Hackathons</p>
      <h2 className="text-3xl font-semibold text-rose-900 mb-8">Competing & Building</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {HACKATHONS.map((h) => (
          <HackathonCard key={h.event} h={h} />
        ))}
      </div>

    </section>
  );
}
