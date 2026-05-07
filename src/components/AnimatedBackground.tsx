import { useEffect, useRef } from "react";

/**
 * Background canvas:
 *  - Static star field: ~160 stars with varied size & opacity
 *    Some stars are "bright" and flicker/pulse on their own timer.
 *  - Animated particle network: subtle moving nodes connected by thin lines.
 *    Reads as "neural network / data graph", aligned with AI theme.
 */
export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // ── Star types ──────────────────────────────────────────────────────────
    type Star = {
      x: number;
      y: number;
      r: number;
      baseAlpha: number;
      alpha: number;
      isBright: boolean;
      /** phase offset so flickers don't sync */
      phase: number;
      /** flicker speed (radians/frame) */
      speed: number;
      /** colour tint index  0=white 1=cyan 2=violet */
      tint: 0 | 1 | 2;
    };
    let stars: Star[] = [];

    // ── Particle types ───────────────────────────────────────────────────────
    type Particle = { x: number; y: number; vx: number; vy: number; r: number };
    let particles: Particle[] = [];

    const buildScene = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Stars — more near the top (hero area), sparser lower
      const starCount = Math.min(200, Math.floor((width * height) / 5000));
      stars = Array.from({ length: starCount }, () => {
        const isBright = Math.random() < 0.18; // ~18 % are bright stars
        const tint = isBright
          ? ([0, 0, 1, 2][Math.floor(Math.random() * 4)] as 0 | 1 | 2)
          : 0;
        const r = isBright ? Math.random() * 1.4 + 0.9 : Math.random() * 0.9 + 0.2;
        const baseAlpha = isBright ? Math.random() * 0.4 + 0.55 : Math.random() * 0.3 + 0.1;
        return {
          x: Math.random() * width,
          // cluster more stars toward the top 60 %
          y: Math.random() < 0.6 ? Math.random() * height * 0.6 : Math.random() * height,
          r,
          baseAlpha,
          alpha: baseAlpha,
          isBright,
          phase: Math.random() * Math.PI * 2,
          speed: isBright ? Math.random() * 0.025 + 0.01 : Math.random() * 0.012 + 0.004,
          tint,
        };
      });

      // Particles — sparser than stars
      const density = Math.min(90, Math.floor((width * height) / 18000));
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.1 + 0.35,
      }));
    };

    // Tint colours for bright stars
    const TINTS = [
      "230, 238, 248", // white-blue
      "120, 230, 245", // cyan
      "180, 140, 255", // violet
    ];

    let frame = 0;

    const tick = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // ── Draw stars ─────────────────────────────────────────────────────────
      for (const s of stars) {
        if (s.isBright) {
          s.phase += s.speed;
          // oscillate: base ± up-to-40 % of base
          s.alpha = s.baseAlpha + Math.sin(s.phase) * s.baseAlpha * 0.4;
          s.alpha = Math.max(0.05, Math.min(1, s.alpha));

          const rgb = TINTS[s.tint];
          // soft glow halo
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4.5);
          glow.addColorStop(0, `rgba(${rgb}, ${s.alpha * 0.55})`);
          glow.addColorStop(1, `rgba(${rgb}, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 4.5, 0, Math.PI * 2);
          ctx.fill();

          // core dot
          ctx.fillStyle = `rgba(${rgb}, ${s.alpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // dim star — very gentle twinkle (slow)
          if (frame % 3 === 0) {
            s.phase += s.speed;
            s.alpha = s.baseAlpha + Math.sin(s.phase) * s.baseAlpha * 0.18;
          }
          ctx.fillStyle = `rgba(220, 230, 242, ${s.alpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Move & repel particles ─────────────────────────────────────────────
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const m = mouseRef.current;
        if (m) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14000) {
            const f = (1 - d2 / 14000) * 0.04;
            p.x += dx * f;
            p.y += dy * f;
          }
        }
      }

      // ── Connections ────────────────────────────────────────────────────────
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.14;
            ctx.strokeStyle = `rgba(200, 215, 235, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // ── Particle nodes ─────────────────────────────────────────────────────
      ctx.fillStyle = "rgba(210, 225, 240, 0.5)";
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReduced) rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mouseRef.current = null;
    };

    buildScene();
    tick();
    window.addEventListener("resize", buildScene);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", buildScene);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* subtle dot-grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      {/* very soft top/bottom fade so stars at edges feel natural */}
      <div className="absolute inset-x-0 top-0 h-32 bg-background/50 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-background/50 [mask-image:linear-gradient(to_top,black,transparent)]" />
    </div>
  );
}
