// ─── Section Components ─────────────────
import Navbar     from "@/components/Navbar";
import Hero       from "@/components/Hero";
import Overview   from "@/components/Overview";
import Toolkit    from "@/components/Toolkit";
import Experience from "@/components/Experience";
import Projects   from "@/components/Projects";
import Hackathons from "@/components/Hackathons";
import Education  from "@/components/Education";
import Contact    from "@/components/Contact";

// ─── Homepage ───────────────────────────
export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <Overview />
      <Toolkit />
      <Experience />
      <Projects />
      <Hackathons />
      <Education />
      <Contact />
    </main>
  );
}