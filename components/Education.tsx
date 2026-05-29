// ─── Education Data ─────────────────────
const SCHOOLS = [
  {
    school:  "Pamantasan ng Lungsod ng Maynila",
    degree:  "BS Computer Engineering",
    period:  "2024 – Present",
    location:"Intramuros, Manila",
    note:    "Currently in 3rd year. Actively engaged in academic projects, technical organizations, and community-driven tech initiatives.",
    honors:  "",
  },
  {
    school:  "Arellano University — Malabon",
    degree:  "Senior High School · STEM Strand",
    period:  "2022 – 2024",
    location:"Malabon City",
    note:    "",
    honors:  "With High Honors (Grade 11) · With Highest Honors (Grade 12)",
  },
];

const SCHOLARSHIPS = [
  { name: "DataCamp Donates Scholarship",                            period: "2025 – Present" },
  { name: "Charity First Foundation Incorporation",                  period: "2024 – Present" },
  { name: "Caritas Kalookan — Commission on Social Services",        period: "2017 – 2024"    },
  { name: "Miao De Bodhisattva Society Foundation",                  period: "2014 – 2018"    },
];

const CERTS = [
  "Basic Web Development Workshop (Zuitt Coding Bootcamp)",
  "Introduction to Cybersecurity (Cisco)",
  "Introduction & Intermediate Machine Learning (Kaggle)",
  "Introduction & Intermediate SQL (DataCamp)",
];

// ─── Education Component ────────────────
export default function Education() {
  return (
    <section id="education" className="max-w-6xl mx-auto px-6">

      <p className="text-xs tracking-[0.2em] text-rose-400 uppercase mb-3">Education</p>
      <h2 className="text-3xl font-semibold text-rose-900 mb-8">Academic Background</h2>

      {/* Schools */}
      <div className="flex flex-col gap-4 mb-12">
        {SCHOOLS.map((s) => (
          <div key={s.school} className="bg-white/50 backdrop-blur-sm border border-rose-100 rounded-2xl p-6 hover:bg-rose-50/50 transition-colors duration-200">
            <div className="flex flex-col md:flex-row md:justify-between gap-1 mb-2">
              <div>
                <p className="font-semibold text-rose-900">{s.school}</p>
                <p className="text-rose-600 text-sm">{s.degree}</p>
                {s.honors && <p className="text-rose-500 text-xs mt-1">🏅 {s.honors}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs text-rose-400">{s.period}</p>
                <p className="text-xs text-rose-300">{s.location}</p>
              </div>
            </div>
            {s.note && <p className="text-rose-700 text-sm leading-relaxed">{s.note}</p>}
          </div>
        ))}
      </div>

      {/* Scholarships */}
      <h3 className="text-sm uppercase tracking-widest text-rose-400 mb-4">Scholarships</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {SCHOLARSHIPS.map((s) => (
          <div key={s.name} className="bg-white/50 backdrop-blur-sm border border-rose-100 rounded-2xl p-4 flex justify-between items-center hover:bg-rose-50/50 transition-colors duration-200">
            <p className="text-rose-800 text-sm">{s.name}</p>
            <p className="text-rose-400 text-xs ml-4 whitespace-nowrap">{s.period}</p>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <h3 className="text-sm uppercase tracking-widest text-rose-400 mb-4">Certifications & Short Courses</h3>
      <div className="flex flex-wrap gap-2">
        {CERTS.map((c) => (
          <span key={c} className="text-xs bg-rose-100 text-rose-600 px-3 py-1.5 rounded-full">
            {c}
          </span>
        ))}
      </div>

    </section>
  );
}
