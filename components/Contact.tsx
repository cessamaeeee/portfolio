// ─── Contact Links ──────────────────────
const LINKS = [
  {
    label: "Email",
    value: "princessmae.work04@gmail.com",
    href:  "mailto:princessmae.work04@gmail.com",
    icon:  "✉️",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/cessamaeeee",
    href:  "https://www.linkedin.com/in/cessamaeeee",
    icon:  "💼",
  },
  {
    label: "GitHub",
    value: "github.com/cessamaeeee",
    href:  "https://github.com/cessamaeeee",
    icon:  "🐙",
  },
];

// ─── Contact Component ──────────────────
export default function Contact() {
  return (
    <section id="contact" className="max-w-6xl mx-auto px-6 pb-24">

      <p className="text-xs tracking-[0.2em] text-rose-400 uppercase mb-3">Contact</p>
      <h2 className="text-3xl font-semibold text-rose-900 mb-4">Get In Touch</h2>
      <p className="text-rose-600 mb-10 max-w-xl">
        Have a project in mind or just want to connect? Feel free to reach out —
        I&apos;d love to hear from you.
      </p>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {LINKS.map((link) => (
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/50 backdrop-blur-sm border border-rose-100 rounded-2xl p-6 flex flex-col gap-2 hover:bg-rose-50/60 hover:border-rose-200 hover:shadow-md transition-all duration-300 group"
          >
            <span className="text-2xl">{link.icon}</span>
            <p className="text-xs text-rose-400 uppercase tracking-widest">{link.label}</p>
            <p className="text-rose-700 text-sm group-hover:text-rose-900 transition-colors">{link.value}</p>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-rose-100 pt-8 text-center">
        <p className="text-rose-300 text-xs">
          Designed & built by Princess Mae Sanchez · {new Date().getFullYear()}
        </p>
      </div>

    </section>
  );
}
