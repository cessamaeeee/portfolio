'use client';
import { useEffect } from 'react';

export default function Cursor() {
  useEffect(() => {
    const dot = document.createElement('div');
    dot.id = 'cursor-dot';
    const ring = document.createElement('div');
    ring.id = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
    };

    const animate = () => {
      rx += (mx - rx) * 0.10;
      ry += (my - ry) * 0.10;
      ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
      raf = requestAnimationFrame(animate);
    };

    const onEnterLink = () => { dot.classList.add('cursor-hover'); ring.classList.add('cursor-hover'); };
    const onLeaveLink = () => { dot.classList.remove('cursor-hover'); ring.classList.remove('cursor-hover'); };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(animate);

    // Grow on interactive elements
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', onEnterLink);
      el.addEventListener('mouseleave', onLeaveLink);
    });

    const obs = new MutationObserver(() => {
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.removeEventListener('mouseenter', onEnterLink);
        el.removeEventListener('mouseleave', onLeaveLink);
        el.addEventListener('mouseenter', onEnterLink);
        el.addEventListener('mouseleave', onLeaveLink);
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      obs.disconnect();
      dot.remove();
      ring.remove();
    };
  }, []);

  return null;
}
