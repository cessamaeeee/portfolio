'use client';
import ScrollReveal from '@/components/ScrollReveal';
import ScrollFloat  from '@/components/ScrollFloat';
import Iridescence  from '@/components/Iridescence';
import LogoLoop     from '@/components/LogoLoop';
import type { LogoItem } from '@/components/LogoLoop';

// ─── Data ────────────────────────────────
const GROUPS = [
  {
    label: 'Languages',
    items: [
      { name: 'Python',     icon: 'devicon-python-plain'          },
      { name: 'JavaScript', icon: 'devicon-javascript-plain'      },
      { name: 'SQL',        icon: 'devicon-azuresqldatabase-plain' },
      { name: 'C',          icon: 'devicon-c-plain'               },
      { name: 'PHP',        icon: 'devicon-php-plain'             },
    ],
  },
  {
    label: 'Frameworks & Tech',
    items: [
      { name: 'Django',       icon: 'devicon-django-plain'      },
      { name: 'Laravel',      icon: 'devicon-laravel-plain'     },
      { name: 'React Native', icon: 'devicon-react-original'    },
      { name: 'Expo',         icon: 'devicon-expo-original'     },
      { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain' },
      { name: 'Alpine.js',    icon: 'devicon-alpinejs-plain'    },
      { name: 'Firebase',     icon: 'devicon-firebase-plain'    },
      { name: 'MySQL',        icon: 'devicon-mysql-plain'       },
      { name: 'SQLite',       icon: 'devicon-sqlite-plain'      },
      { name: 'Node.js',      icon: 'devicon-nodejs-plain'      },
    ],
  },
  {
    label: 'AI & APIs',
    items: [
      { name: 'Claude API',      icon: '' },
      { name: 'Gemini API',      icon: '' },
      { name: 'REST APIs',       icon: '' },
      { name: 'Twilio SMS API',  icon: '' },
      { name: 'Google Maps API', icon: '' },
    ],
  },
  {
    label: 'Tools & Platforms',
    items: [
      { name: 'Git',    icon: 'devicon-git-plain'        },
      { name: 'GitHub', icon: 'devicon-github-original'  },
      { name: 'Docker', icon: 'devicon-docker-plain'     },
      { name: 'VS Code',icon: 'devicon-vscode-plain'     },
      { name: 'Vite',   icon: 'devicon-vitejs-plain'     },
      { name: 'Figma',  icon: 'devicon-figma-plain'      },
      { name: 'Canva',  icon: 'devicon-canva-original'   },
    ],
  },
  {
    label: 'Productivity',
    items: [
      { name: 'Google Workspace', icon: ''                       },
      { name: 'Microsoft Office', icon: ''                       },
      { name: 'Notion',           icon: 'devicon-notion-plain'   },
    ],
  },
];

function makeLogos(items: { name: string; icon: string }[]): LogoItem[] {
  return items.map(item => ({
    node: (
      <div className="flex flex-col items-center gap-1.5 bg-white/60 backdrop-blur-sm border border-rose-100 rounded-2xl px-4 py-3 hover:bg-rose-50 hover:border-rose-200 hover:scale-105 transition-all duration-200 min-w-[72px] shadow-sm">
        {item.icon
          ? <i className={`${item.icon} text-3xl text-rose-700`} />
          : <span className="text-[11px] font-bold text-rose-600 text-center leading-tight px-1">{item.name}</span>}
        <span className="text-[10px] text-rose-500 text-center leading-tight whitespace-nowrap">{item.name}</span>
      </div>
    ),
  }));
}

// ─── Toolkit Component ───────────────────
export default function Toolkit() {
  return (
    <section id="toolkit" className="relative">
      {/* Devicons CDN */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />

      {/* Section edge — top fade */}
      <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to bottom, #fdf0f4, transparent)' }} />

      {/* Iridescence — full width */}
      <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
        <Iridescence color={[0.8, 0.3, 0.5]} speed={0.5} amplitude={0.05} mouseReact={false} />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <ScrollReveal>
          <p className="text-xs tracking-[0.2em] text-rose-400 uppercase mb-3">Tool Kit</p>
          <ScrollFloat textClassName="text-rose-900 font-semibold">What I Work With</ScrollFloat>
        </ScrollReveal>

        <div className="flex flex-col gap-8 mt-4">
          {GROUPS.map((group, gi) => (
            <ScrollReveal key={group.label} delay={gi * 80}>
              <p className="text-xs text-rose-400 uppercase tracking-widest mb-3">{group.label}</p>
              <LogoLoop
                logos={makeLogos(group.items)}
                speed={gi % 2 === 0 ? 55 : -50}
                pauseOnHover
                fadeOut
                fadeOutColor="#fdf0f4"
                logoHeight={72}
                gap={12}
                scaleOnHover
                ariaLabel={group.label}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Section edge — bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to top, #fdf0f4, transparent)' }} />
    </section>
  );
}
