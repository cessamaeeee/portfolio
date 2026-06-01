"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ShinyText from "@/components/ShinyText";
import Grainient from "@/components/Grainient";

// ─── Hero Component ──────────────────────
export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ─── Particle Animation ───────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const COLORS = ["#e8607a","#f09ab0","#d4506a","#ffb3c8","#e87090","#c04868","#fab8cc"];
    const mouse  = { x: W / 2, y: H / 2 };

    const particles = Array.from({ length: 80 }, () => ({
      x:       Math.random() * W,
      y:       Math.random() * H,
      vx:      (Math.random() - 0.5) * 0.4,
      vy:      (Math.random() - 0.5) * 0.4,
      size:    1.5 + Math.random() * 3,
      color:   COLORS[Math.floor(Math.random() * COLORS.length)],
      len:     4 + Math.random() * 10,
      angle:   Math.random() * Math.PI * 2,
      opacity: 0.3 + Math.random() * 0.5,
    }));

    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) { p.vx += (dx / dist) * 0.06; p.vy += (dy / dist) * 0.06; }
        p.vx *= 0.97; p.vy *= 0.97;
        p.x  += p.vx;  p.y  += p.vy; p.angle += 0.02;
        if (p.x < -20) p.x = W + 10; if (p.x > W + 20) p.x = -10;
        if (p.y < -20) p.y = H + 10; if (p.y > H + 20) p.y = -10;
        ctx.save();
        ctx.globalAlpha = p.opacity; ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * 0.5; ctx.lineCap = "round";
        ctx.translate(p.x, p.y); ctx.rotate(p.angle);
        ctx.beginPath(); ctx.moveTo(-p.len / 2, 0); ctx.lineTo(p.len / 2, 0);
        ctx.stroke(); ctx.restore();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Grainient Animated Background */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ position: 'absolute', inset: 0 }}>
        <Grainient
          color1="#da4f8e"
          color2="#ff8fab"
          color3="#fb6f92"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[1]" />

      {/* Floating Decorative Blobs */}
      <div className="float-1 absolute top-24 left-12 w-16 h-16 rounded-full bg-rose-200/40 blur-xl pointer-events-none" />
      <div className="float-2 absolute top-40 right-24 w-24 h-24 rounded-full bg-pink-200/30 blur-2xl pointer-events-none" />
      <div className="float-3 absolute bottom-32 left-1/4 w-20 h-20 rounded-full bg-rose-100/50 blur-xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 flex flex-col md:flex-row items-center gap-12">

        {/* Left — Text */}
        <div className="flex-1 text-center md:text-left">
          <p
            className="text-xs tracking-[0.2em] text-rose-500 uppercase mb-4"
            style={{ animation: "fadeInUp 0.8s ease forwards", animationDelay: "0.1s", opacity: 0 }}
          >
            Computer Engineering Student · Full-Stack Developer · UI/UX Enthusiast
          </p>
          <h1
            className="text-4xl md:text-5xl font-semibold text-rose-900 leading-tight mb-6"
            style={{ animation: "fadeInUp 0.8s ease forwards", animationDelay: "0.25s", opacity: 0 }}
          >
            Hi, I&apos;m <ShinyText text="Princess Mae" color="#8b3055" shineColor="#f9a8c9" speed={3} className="text-rose-600" />
          </h1>
          <p
            className="text-rose-700 text-base md:text-lg leading-relaxed mb-8 max-w-xl"
            style={{ animation: "fadeInUp 0.8s ease forwards", animationDelay: "0.4s", opacity: 0 }}
          >
            I build systems that solve real problems — with clean code, thoughtful design,
            and a deep care for the people who use them.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-wrap gap-4 justify-center md:justify-start"
            style={{ animation: "fadeInUp 0.8s ease forwards", animationDelay: "0.55s", opacity: 0 }}
          >
            <a href="#contact" className="bg-rose-800 text-white px-6 py-3 rounded-full text-sm hover:bg-rose-900 transition-all duration-200 hover:scale-105">
              Get In Touch
            </a>
            <a href="/CV.pdf" download className="border border-rose-300 text-rose-700 px-6 py-3 rounded-full text-sm hover:bg-rose-50 transition-all duration-200 hover:scale-105">
              Download CV
            </a>
          </div>

          {/* Stat Chips — no emojis */}
          <div
            className="flex flex-wrap gap-3 mt-8 justify-center md:justify-start"
            style={{ animation: "fadeInUp 0.8s ease forwards", animationDelay: "0.7s", opacity: 0 }}
          >
            {[
              "4 Scholarships",
              "2 Hackathon Awards",
              "3 Featured Projects",
              "10+ Org Roles",
            ].map((stat) => (
              <span key={stat} className="text-xs bg-rose-100/80 text-rose-700 px-3 py-1.5 rounded-full border border-rose-200/50">
                {stat}
              </span>
            ))}
          </div>
        </div>

        {/* Right — Photo */}
        <div
          className="flex-shrink-0"
          style={{ animation: "fadeIn 1s ease forwards", animationDelay: "0.4s", opacity: 0 }}
        >
          <div className="relative">
            {/* Decorative ring */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-rose-200 to-pink-100 blur-md opacity-60" />
            <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-rose-200 shadow-xl">
              <Image src="/profile.jpg" alt="Princess Mae Sanchez" fill className="object-cover" priority />
            </div>
          </div>
        </div>

      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-rose-400 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <span className="text-lg">↓</span>
      </div>

    </section>
  );
}
