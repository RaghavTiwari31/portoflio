import { useEffect, useRef } from "react";

/**
 * Retro starfield: crisp square "pixel" stars in three parallax layers that
 * drift with scroll, a few twinkling cross-stars, and an occasional satellite
 * blinking across the sky. No gradients or blur — just hard pixels.
 */
export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const COLORS = ["#ede4cf", "#ede4cf", "#ede4cf", "#f2b33d", "#6cc4bf", "#ff8a2b"];

    type Star = { x: number; y: number; size: number; layer: number; color: string; phase: number; cross: boolean };
    let stars: Star[] = [];
    let width = 0;
    let height = 0;

    const sat = { x: -20, y: 0, vx: 0, vy: 0, active: false, next: performance.now() + 6000 };

    const build = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(260, Math.floor((width * height) / 5000));
      stars = Array.from({ length: count }, () => {
        const layer = Math.random() < 0.6 ? 0 : Math.random() < 0.75 ? 1 : 2;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          size: layer === 2 ? 2 : 1,
          layer,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          phase: Math.random() * Math.PI * 2,
          cross: layer === 2 && Math.random() < 0.35,
        };
      });
    };

    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (t - last < 33) return; // ~30fps is plenty for a starfield
      last = t;

      const scroll = window.scrollY;
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        const speed = [0.02, 0.06, 0.14][s.layer];
        const y = (((s.y - scroll * speed) % height) + height) % height;
        const tw = s.layer === 0 ? 0.55 : 0.6 + 0.4 * Math.sin(t * 0.002 + s.phase);
        ctx.globalAlpha = s.layer === 0 ? 0.45 : tw;
        ctx.fillStyle = s.color;
        const x = Math.round(s.x);
        const yy = Math.round(y);
        ctx.fillRect(x, yy, s.size, s.size);
        if (s.cross && tw > 0.8) {
          ctx.fillRect(x - 3, yy, 2, s.size);
          ctx.fillRect(x + s.size + 1, yy, 2, s.size);
          ctx.fillRect(x, yy - 3, s.size, 2);
          ctx.fillRect(x, yy + s.size + 1, s.size, 2);
        }
      }

      // Satellite: a slow blinking pixel crossing the sky every so often
      if (!sat.active && t > sat.next) {
        sat.active = true;
        const ltr = Math.random() < 0.5;
        sat.x = ltr ? -10 : width + 10;
        sat.y = Math.random() * height * 0.6;
        sat.vx = (ltr ? 1 : -1) * (0.8 + Math.random() * 0.6);
        sat.vy = (Math.random() - 0.3) * 0.3;
      }
      if (sat.active) {
        sat.x += sat.vx;
        sat.y += sat.vy;
        ctx.globalAlpha = 1;
        ctx.fillStyle = Math.floor(t / 400) % 2 ? "#ff4b2b" : "#ede4cf";
        ctx.fillRect(Math.round(sat.x), Math.round(sat.y), 2, 2);
        if (sat.x < -20 || sat.x > width + 20) {
          sat.active = false;
          sat.next = t + 9000 + Math.random() * 8000;
        }
      }
      ctx.globalAlpha = 1;
    };

    // With reduced motion, paint a single static frame (and repaint on resize).
    const drawStatic = () => {
      last = 0;
      tick(1000);
      cancelAnimationFrame(raf);
    };
    const onResize = () => {
      build();
      if (reduced) drawStatic();
    };

    build();
    if (reduced) drawStatic();
    else raf = requestAnimationFrame(tick);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
