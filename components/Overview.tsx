// ─── Overview Component ─────────────────
export default function Overview() {
  return (
    <section id="overview" className="max-w-6xl mx-auto px-6">

      {/* Section Label */}
      <p className="text-xs tracking-[0.2em] text-rose-400 uppercase mb-3">Overview</p>
      <h2 className="text-3xl font-semibold text-rose-900 mb-8">Who I Am</h2>

      <div className="grid md:grid-cols-2 gap-12 items-center">

        {/* Bio */}
        <div>
          <p className="text-rose-700 leading-relaxed mb-4">
            Hi, I&apos;m Cessa — a Computer Engineering student, scholar, and builder.
            I care about creating technology that&apos;s not just functional, but meaningful.
          </p>
          <p className="text-rose-700 leading-relaxed mb-4">
            Whether it&apos;s architecting a full-stack scholarship platform, designing a safety
            app for Filipino women, or volunteering in developer communities, I show up
            with intention.
          </p>
          <p className="text-rose-700 leading-relaxed">
            I&apos;m currently open to internships, collaborations, and opportunities where
            I can grow and contribute.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { number: "3",   label: "Featured Projects"  },
            { number: "2",   label: "Hackathon Awards"   },
            { number: "4",   label: "Scholarships"       },
            { number: "10+", label: "Org Roles"          },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/50 backdrop-blur-sm border border-rose-100 rounded-2xl p-6 text-center hover:bg-rose-50/50 transition-colors duration-200"
            >
              <p className="text-3xl font-semibold text-rose-800 mb-1">{stat.number}</p>
              <p className="text-xs text-rose-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
