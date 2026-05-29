// ─── Experience Data ────────────────────
const FORMAL = [
  {
    role:    "Video, Cinematography & Media Fellow",
    org:     "Eskwelabs Innovation Fellowship (EIF)",
    period:  "May 2026 – August 2026",
    type:    "Fellowship Program",
    desc:    "Selected from a competitive pool to join the Video, Cinematography & Media track, focusing on visual storytelling, content creation, and collaborative media production. Contributed to real-world creative projects under structured mentorship.",
  },
  {
    role:    "Mentee",
    org:     "AWS User Group BuildHers+ Philippines",
    period:  "November 2025 – February 2026",
    type:    "Mentorship Program",
    desc:    "Participated in a structured mentorship program under the BuildHers+ initiative, a community empowering women in cloud and tech. Gained exposure to AWS cloud concepts, industry practices, and professional development.",
  },
];

const ORGS = [
  {
    org:    "Google Developer Groups on Campus PLM",
    note:   "formerly Google Developer Student Clubs",
    roles:  ["Web Development Googler · 2025 – 2026", "Noogler · 2024 – 2025"],
    desc:   "Joined as a Noogler in 2024 under the GDSC chapter, then progressed to Web Development Googler following the org's rebrand. Contributed to web development initiatives and community-driven tech events on campus.",
  },
  {
    org:    "PLM ICpEP.se — Committee on Technological",
    roles:  ["Member · 2025 – Present"],
    desc:   "Engaged in technology-focused committees under the Institute of Computer Engineers of the Philippines, Student Edition at PLM.",
  },
  {
    org:    "ICpEP.se NCR",
    roles:  ["Member · 2024 – 2025"],
    desc:   "Active member of the NCR-level chapter, participating in regional tech events and engineering community activities.",
  },
  {
    org:    "AWS Cloud Clubs — Haribon Cloud Buddy",
    roles:  ["Member · 2024 – 2025"],
    desc:   "Participated in cloud learning activities and community events under the AWS Cloud Clubs program.",
  },
];

// ─── Experience Component ───────────────
export default function Experience() {
  return (
    <section id="experience" className="max-w-6xl mx-auto px-6">

      {/* Section Label */}
      <p className="text-xs tracking-[0.2em] text-rose-400 uppercase mb-3">Experience</p>
      <h2 className="text-3xl font-semibold text-rose-900 mb-8">Where I&apos;ve Been</h2>

      {/* Formal Experience */}
      <h3 className="text-sm uppercase tracking-widest text-rose-400 mb-4">Formal Experience</h3>
      <div className="flex flex-col gap-4 mb-12">
        {FORMAL.map((item) => (
          <div
            key={item.org}
            className="bg-white/50 backdrop-blur-sm border border-rose-100 rounded-2xl p-6 hover:bg-rose-50/50 transition-colors duration-200"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
              <div>
                <p className="font-medium text-rose-900">{item.role}</p>
                <p className="text-rose-600 text-sm">{item.org}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-rose-400">{item.period}</p>
                <p className="text-xs text-rose-300">{item.type}</p>
              </div>
            </div>
            <p className="text-rose-700 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Tech Orgs */}
      <h3 className="text-sm uppercase tracking-widest text-rose-400 mb-4">Tech-Related Organizations</h3>
      <div className="flex flex-col gap-4">
        {ORGS.map((item) => (
          <div
            key={item.org}
            className="bg-white/50 backdrop-blur-sm border border-rose-100 rounded-2xl p-6 hover:bg-rose-50/50 transition-colors duration-200"
          >
            <p className="font-medium text-rose-900">
              {item.org}
              {item.note && <span className="text-rose-400 text-xs ml-2">({item.note})</span>}
            </p>
            <div className="flex flex-wrap gap-2 my-2">
              {item.roles.map((r) => (
                <span key={r} className="text-xs bg-rose-100 text-rose-600 px-3 py-1 rounded-full">{r}</span>
              ))}
            </div>
            <p className="text-rose-700 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

    </section>
  );
}
