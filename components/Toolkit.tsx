import ScrollReveal from "@/components/ScrollReveal";

// ─── Toolkit Data with Devicon classes ───
const TOOLS = [
  {
    category: "Languages",
    items: [
      { name: "Python",     icon: "devicon-python-plain"     },
      { name: "JavaScript", icon: "devicon-javascript-plain" },
      { name: "SQL",        icon: "devicon-azuresqldatabase-plain" },
      { name: "C",          icon: "devicon-c-plain"          },
      { name: "PHP",        icon: "devicon-php-plain"        },
    ],
  },
  {
    category: "Frameworks & Technologies",
    items: [
      { name: "Django",       icon: "devicon-django-plain"       },
      { name: "Laravel",      icon: "devicon-laravel-plain"      },
      { name: "React Native", icon: "devicon-react-original"     },
      { name: "Expo",         icon: "devicon-expo-original"      },
      { name: "Tailwind CSS", icon: "devicon-tailwindcss-plain"  },
      { name: "Alpine.js",    icon: "devicon-alpinejs-plain"     },
      { name: "Firebase",     icon: "devicon-firebase-plain"     },
      { name: "MySQL",        icon: "devicon-mysql-plain"        },
      { name: "SQLite",       icon: "devicon-sqlite-plain"       },
      { name: "Node.js",      icon: "devicon-nodejs-plain"       },
    ],
  },
  {
    category: "AI & APIs",
    items: [
      { name: "Claude API",      icon: "" },
      { name: "Gemini API",      icon: "" },
      { name: "REST APIs",       icon: "" },
      { name: "Twilio SMS API",  icon: "" },
      { name: "Google Maps API", icon: "" },
    ],
  },
  {
    category: "Tools & Platforms",
    items: [
      { name: "Git",    icon: "devicon-git-plain"    },
      { name: "GitHub", icon: "devicon-github-original" },
      { name: "Docker", icon: "devicon-docker-plain" },
      { name: "VS Code",icon: "devicon-vscode-plain" },
      { name: "Vite",   icon: "devicon-vitejs-plain" },
      { name: "Figma",  icon: "devicon-figma-plain"  },
      { name: "Canva",  icon: "devicon-canva-original"},
    ],
  },
  {
    category: "Productivity",
    items: [
      { name: "Google Workspace", icon: "" },
      { name: "Microsoft Office", icon: "" },
      { name: "Notion",           icon: "devicon-notion-plain" },
    ],
  },
];

// ─── Toolkit Component ───────────────────
export default function Toolkit() {
  return (
    <section id="toolkit" className="max-w-6xl mx-auto px-6">

      {/* Devicons CDN */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />

      <ScrollReveal>
        <p className="text-xs tracking-[0.2em] text-rose-400 uppercase mb-3">Tool Kit</p>
        <h2 className="text-3xl font-semibold text-rose-900 mb-8">What I Work With</h2>
      </ScrollReveal>

      <div className="flex flex-col gap-6">
        {TOOLS.map((group, gi) => (
          <ScrollReveal key={group.category} delay={gi * 80}>
            <div className="bg-white/50 backdrop-blur-sm border border-rose-100 rounded-2xl p-6 hover:bg-rose-50/30 transition-all duration-300">
              <p className="text-xs text-rose-400 uppercase tracking-widest mb-4">{group.category}</p>
              <div className="flex flex-wrap gap-3">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col items-center gap-1.5 bg-rose-50/80 border border-rose-100 rounded-xl px-3 py-2.5 hover:bg-rose-100 hover:scale-110 transition-all duration-200 min-w-[60px]"
                  >
                    {item.icon ? (
                      <i className={`${item.icon} text-2xl text-rose-700`} />
                    ) : (
                      <span className="text-xs font-semibold text-rose-600 text-center leading-tight">{item.name.split(" ")[0]}</span>
                    )}
                    <span className="text-[10px] text-rose-500 text-center leading-tight">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

    </section>
  );
}
