"use client";

import { useEffect } from "react";

// ─── Custom Cursor ───────────────────────
export default function Cursor() {
  useEffect(() => {
    const dot  = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;

    let ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;

    // Move dot instantly
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top  = `${mouseY}px`;
    };

    // Ring follows with lag
    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top  = `${ringY}px`;
      requestAnimationFrame(animate);
    };

    // Grow ring on hover over interactive elements
    const onEnter = () => {
      ring.style.width       = "56px";
      ring.style.height      = "56px";
      ring.style.borderColor = "#8b305560";
    };
    const onLeave = () => {
      ring.style.width       = "36px";
      ring.style.height      = "36px";
      ring.style.borderColor = "#c0607880";
    };

    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    window.addEventListener("mousemove", onMove);
    animate();

    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div id="cursor-dot"  />
      <div id="cursor-ring" />
    </>
  );
}
