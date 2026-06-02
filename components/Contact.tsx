'use client';
import ScrollReveal from '@/components/ScrollReveal';
import ScrollFloat  from '@/components/ScrollFloat';
import BorderGlow   from '@/components/BorderGlow';
import Grainient    from '@/components/Grainient';

// ─── Contact Links ───────────────────────
const LINKS = [
  {
    label: 'Email',
    value: 'princessmae.work04@gmail.com',
    href:  'mailto:princessmae.work04@gmail.com',
    icon: (
      <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/cessamaeeee',
    href:  'https://www.linkedin.com/in/cessamaeeee',
    icon: (
      <svg className="w-6 h-6 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.77 0-.98.78-1.77 1.75-1.77s1.75.79 1.75 1.77c0 .98-.78 1.77-1.75 1.77zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.76 1.37-1.56 2.82-1.56 3.01 0 3.57 1.98 3.57 4.56v5.64z"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'github.com/cessamaeeee',
    href:  'https://github.com/cessamaeeee',
    icon: (
      <svg className="w-6 h-6 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
];

// ─── Contact Component ───────────────────
export default function Contact() {
  return (
    <section id="contact" className="relative pb-24">
      {/* Section edge fade */}
      <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to bottom, #fdf0f4, transparent)' }} />

      {/* Grainient background */}
      <div className="absolute inset-0 opacity-50 pointer-events-none overflow-hidden">
        <Grainient color1="#f9a8d4" color2="#fda4af" color3="#fbcfe8" timeSpeed={0.25} warpStrength={0.8} warpFrequency={4} grainAmount={0.08} contrast={1.3} />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 relative z-10">

        {/* Hero heading */}
        <ScrollReveal>
          <p className="text-xs tracking-[0.2em] text-rose-400 uppercase mb-4">Contact</p>
          <ScrollFloat textClassName="text-rose-900 font-semibold">Get In Touch</ScrollFloat>
          <p className="text-rose-600 mb-12 max-w-xl leading-relaxed">
            Have a project in mind or just want to connect? I&apos;d love to hear from you.
            Whether it&apos;s a collaboration, opportunity, or just saying hi — my inbox is open.
          </p>
        </ScrollReveal>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {LINKS.map((link, i) => (
            <ScrollReveal key={link.label} delay={i * 120}>
              <BorderGlow
                borderRadius={20}
                backgroundColor="rgba(255,255,255,0.55)"
                colors={['#f472b6', '#fb7185', '#f9a8d4']}
                glowColor="330 80 60"
                glowIntensity={1.8}
                edgeSensitivity={20}
                glowRadius={50}
                className="w-full"
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-4 p-7 group"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center group-hover:bg-rose-100 group-hover:scale-110 transition-all duration-300">
                    {link.icon}
                  </div>
                  <div>
                    <p className="text-[11px] text-rose-400 uppercase tracking-[0.15em] font-medium mb-1">{link.label}</p>
                    <p className="text-rose-800 text-sm font-medium group-hover:text-rose-950 transition-colors leading-snug break-all">
                      {link.value}
                    </p>
                  </div>
                  {/* Arrow */}
                  <div className="mt-auto self-end opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
                    <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </a>
              </BorderGlow>
            </ScrollReveal>
          ))}
        </div>

        {/* Availability badge */}
        <ScrollReveal>
          <div className="flex items-center justify-center gap-3 mb-12">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <p className="text-sm text-rose-600">Available for internships, freelance & collaborations</p>
          </div>
        </ScrollReveal>

        {/* Footer */}
        <ScrollReveal>
          <div className="border-t border-rose-100/60 pt-8 text-center">
            <p className="text-rose-300 text-xs tracking-wide">
              Designed &amp; built by Princess Mae Sanchez · {new Date().getFullYear()}
            </p>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
