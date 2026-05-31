import ScrollReveal from "@/components/ScrollReveal";
import ScrollFloat from "@/components/ScrollFloat";

// ─── Overview Component ──────────────────
export default function Overview() {
  return (
    <section id="overview" className="max-w-6xl mx-auto px-6">

      <ScrollReveal>
        <p className="text-xs tracking-[0.2em] text-rose-400 uppercase mb-3">Overview</p>
        <ScrollFloat textClassName="text-rose-900 font-semibold">Who I Am</ScrollFloat>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-12 items-center">

        {/* Bio */}
        <ScrollReveal delay={100}>
          <p className="text-rose-700 leading-relaxed mb-4">
            Hi, I&apos;m Cessa — a Computer Engineering student, scholar, and builder.
            I care about creating technology that&apos;s not just functional, but meaningful.
          </p>
          <p className="text-rose-700 leading-relaxed mb-4">
            Whether it&apos;s architecting a full-stack scholarship platform, designing a safety
            app for Filipino women, or volunteering in developer communities, I show up with intention.
          </p>
          <p className="text-rose-700 leading-relaxed">
            I&apos;m currently open to internships, collaborations, and opportunities where
            I can grow and contribute.
          </p>
        </ScrollReveal>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { number: "3",   label: "Featured Projects" },
            { number: "2",   label: "Hackathon Awards"  },
            { number: "4",   label: "Scholarships"      },
            { number: "10+", label: "Org Roles"         },
          ].map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 100 + 200}>
              <div className="bg-white/50 backdrop-blur-sm border border-rose-100 rounded-2xl p-6 text-center hover:bg-rose-50/50 hover:scale-105 transition-all duration-300 shadow-sm">
                <p className="text-3xl font-semibold text-rose-800 mb-1">{stat.number}</p>
                <p className="text-xs text-rose-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
