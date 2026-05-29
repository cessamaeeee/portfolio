// ─── Toolkit Data ───────────────────────
const TOOLS = [
  {
    category: "Languages",
    items: ["Python", "JavaScript", "SQL", "C", "PHP"],
  },
  {
    category: "Frameworks & Technologies",
    items: ["Django", "Laravel 12", "React Native", "Expo", "Tailwind CSS", "Alpine.js", "Firebase", "MySQL", "SQLite", "Node.js"],
  },
  {
    category: "AI & APIs",
    items: ["Claude API", "Gemini API", "REST APIs", "Twilio SMS API", "Google Maps API"],
  },
  {
    category: "Tools & Platforms",
    items: ["Git", "GitHub", "Docker", "VS Code", "Vite", "Figma", "Canva", "CapCut"],
  },
  {
    category: "Productivity",
    items: ["Google Workspace", "Microsoft Office", "Notion"],
  },
];

// ─── Toolkit Component ──────────────────
export default function Toolkit() {
  return (
    <section id="toolkit" className="max-w-6xl mx-auto px-6">

      {/* Section Label */}
      <p className="text-xs tracking-[0.2em] text-rose-400 uppercase mb-3">Tool Kit</p>
      <h2 className="text-3xl font-semibold text-rose-900 mb-8">What I Work With</h2>

      <div className="flex flex-col gap-6">
        {TOOLS.map((group) => (
          <div
            key={group.category}
            className="bg-white/50 backdrop-blur-sm border border-rose-100 rounded-2xl p-6 hover:bg-rose-50/30 transition-colors duration-200"
          >
            {/* Category Label */}
            <p className="text-xs text-rose-400 uppercase tracking-widest mb-4">
              {group.category}
            </p>

            {/* Pills */}
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="text-sm bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full hover:bg-rose-200 transition-colors duration-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}