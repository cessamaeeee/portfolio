"use client";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollFloat from "@/components/ScrollFloat";
import Iridescence from "@/components/Iridescence";

// ─── Education Data ──────────────────────
const SCHOOLS = [
  {
    school:   "Pamantasan ng Lungsod ng Maynila",
    degree:   "BS Computer Engineering",
    period:   "2024 – Present",
    location: "Intramuros, Manila",
    note:     "Currently in 3rd year. Actively engaged in academic projects, technical organizations, and community-driven tech initiatives.",
    honors:   "",
  },
  {
    school:   "Arellano University — Malabon",
    degree:   "Senior High School · STEM Strand",
    period:   "2022 – 2024",
    location: "Malabon City",
    note:     "",
    honors:   "With High Honors (Grade 11) · With Highest Honors (Grade 12)",
  },
];

const SCHOLARSHIPS = [
  { name: "DataCamp Donates Scholarship",                       period: "2025 – Present" },
  { name: "Charity First Foundation Incorporation",             period: "2024 – Present" },
  { name: "Caritas Kalookan — Commission on Social Services",   period: "2017 – 2024"    },
  { name: "Miao De Bodhisattva Society Foundation",             period: "2014 – 2018"    },
];

const CERTS = [
  "Basic Web Development Workshop (Zuitt Coding Bootcamp)",
  "Introduction to Cybersecurity (Cisco)",
  "Introduction & Intermediate Machine Learning (Kaggle)",
  "Introduction & Intermediate SQL (DataCamp)",
];

// ─── Education Component ─────────────────
export default function Education() {
  return (
    <section id="education" className="relative">
      {/* Section edge fades */}
      <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none z-20" style={{ background: 'linear-gradient(to bottom, #fdf0f4, transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-20" style={{ background: 'linear-gradient(to top, #fdf0f4, transparent)' }} />

      {/* Iridescence — full viewport width */}
      <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
        <Iridescence color={[0.8, 0.3, 0.5]} speed={0.5} amplitude={0.05} mouseReact={false} />
      </div>

      {/* Content — constrained */}
      <div className="max-w-6xl mx-auto px-6 relative z-10">
      <ScrollReveal>
        <p className="text-xs tracking-[0.2em] text-rose-400 uppercase mb-3">Education</p>
        <ScrollFloat textClassName="text-rose-900 font-semibold">Academic Background</ScrollFloat>
      </ScrollReveal>

      {/* Schools — 2 columns */}
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {SCHOOLS.map((s, i) => (
          <ScrollReveal key={s.school} delay={i * 120}>
            <div className="bg-white/50 backdrop-blur-sm border border-rose-100 rounded-2xl p-6 hover:bg-rose-50/50 hover:shadow-md transition-all duration-300 h-full">
              <div className="flex flex-col gap-1 mb-3">
                <p className="font-semibold text-rose-900">{s.school}</p>
                <p className="text-rose-600 text-sm">{s.degree}</p>
                {s.honors && <p className="text-rose-500 text-xs mt-1">{s.honors}</p>}
                <p className="text-xs text-rose-400 mt-1">{s.period} · {s.location}</p>
              </div>
              {s.note && <p className="text-rose-700 text-sm leading-relaxed">{s.note}</p>}
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Scholarships — 2 columns */}
      <ScrollReveal>
        <h3 className="text-sm uppercase tracking-widest text-rose-400 mb-4">Scholarships</h3>
      </ScrollReveal>
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {SCHOLARSHIPS.map((s, i) => (
          <ScrollReveal key={s.name} delay={i * 80}>
            <div className="bg-white/50 backdrop-blur-sm border border-rose-100 rounded-2xl p-4 flex justify-between items-center hover:bg-rose-50/50 hover:shadow-md transition-all duration-300">
              <p className="text-rose-800 text-sm">{s.name}</p>
              <p className="text-rose-400 text-xs ml-4 whitespace-nowrap">{s.period}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Certifications */}
      <ScrollReveal>
        <h3 className="text-sm uppercase tracking-widest text-rose-400 mb-4">Certifications &amp; Short Courses</h3>
      </ScrollReveal>
      <div className="flex flex-wrap gap-2">
        {CERTS.map((c, i) => (
          <ScrollReveal key={c} delay={i * 80}>
            <span className="text-xs bg-rose-100 text-rose-600 px-3 py-1.5 rounded-full hover:bg-rose-200 transition-colors duration-200">
              {c}
            </span>
          </ScrollReveal>
        ))}
      </div>
      </div>
    </section>
  );
}

