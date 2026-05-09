import { useEffect, useRef, useCallback } from "react";

/**
 * Immersive space background with:
 * - Deep space gradient with nebula colors
 * - Twinkling stars at multiple depths (parallax)
 * - Shooting stars that appear randomly
 * - Mouse-reactive particle field
 * - Smooth performance with RAF optimization
 */
export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({ 
    x: 0, y: 0, targetX: 0, targetY: 0 
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Star types with parallax depth layers
    type Star = {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      r: number;
      baseAlpha: number;
      alpha: number;
      phase: number;
      speed: number;
      depth: number; // 0-1, affects parallax
      color: string;
    };

    // Shooting star type
    type ShootingStar = {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      alpha: number;
      active: boolean;
    };

    // Nebula cloud type
    type Nebula = {
      x: number;
      y: number;
      r: number;
      color: string;
      alpha: number;
      phase: number;
    };

    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let nebulae: Nebula[] = [];

    const STAR_COLORS = [
      "255, 255, 255",    // white
      "200, 220, 255",    // blue-white
      "255, 240, 220",    // warm white
      "180, 200, 255",    // light blue
      "255, 200, 180",    // orange tint
      "180, 220, 255",    // elegant light blue (was cyan)
      "220, 180, 240",    // elegant mauve/rose (was purple)
    ];

    const NEBULA_COLORS = [
      { r: 80, g: 60, b: 180 },   // deep purple
      { r: 20, g: 80, b: 140 },   // deep blue
      { r: 100, g: 40, b: 120 },  // magenta
      { r: 20, g: 60, b: 100 },   // dark blue
    ];

    const buildScene = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Create stars across multiple depth layers
      const starCount = Math.min(350, Math.floor((width * height) / 3500));
      stars = Array.from({ length: starCount }, () => {
        const depth = Math.random(); // 0 = far, 1 = close
        const isBright = Math.random() < 0.15;
        const r = isBright 
          ? Math.random() * 2 + 1 
          : Math.random() * (0.4 + depth * 0.8) + 0.2;
        const baseAlpha = isBright 
          ? Math.random() * 0.4 + 0.6 
          : Math.random() * 0.3 + 0.1 + depth * 0.2;
        const x = Math.random() * width;
        const y = Math.random() * height;
        
        return {
          x,
          y,
          baseX: x,
          baseY: y,
          r,
          baseAlpha,
          alpha: baseAlpha,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.02 + 0.005,
          depth,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        };
      });

      // Shooting stars pool
      shootingStars = Array.from({ length: 3 }, () => ({
        x: 0,
        y: 0,
        length: 0,
        speed: 0,
        angle: 0,
        alpha: 0,
        active: false,
      }));

      // Nebula clouds
      nebulae = Array.from({ length: 4 }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.6,
        r: Math.random() * 300 + 200,
        color: `rgba(${NEBULA_COLORS[i % NEBULA_COLORS.length].r}, ${NEBULA_COLORS[i % NEBULA_COLORS.length].g}, ${NEBULA_COLORS[i % NEBULA_COLORS.length].b}, 0.03)`,
        alpha: Math.random() * 0.03 + 0.01,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    let frame = 0;
    let lastShootingStarTime = 0;

    const tick = (timestamp: number) => {
      frame++;
      
      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Clear with deep space gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgb(5, 5, 15)");
      gradient.addColorStop(0.3, "rgb(8, 8, 25)");
      gradient.addColorStop(0.6, "rgb(10, 5, 20)");
      gradient.addColorStop(1, "rgb(5, 5, 12)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw nebulae (soft colored clouds)
      for (const neb of nebulae) {
        neb.phase += 0.002;
        const breathe = Math.sin(neb.phase) * 0.005;
        const glow = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.r);
        glow.addColorStop(0, `rgba(${NEBULA_COLORS[nebulae.indexOf(neb) % NEBULA_COLORS.length].r}, ${NEBULA_COLORS[nebulae.indexOf(neb) % NEBULA_COLORS.length].g}, ${NEBULA_COLORS[nebulae.indexOf(neb) % NEBULA_COLORS.length].b}, ${neb.alpha + breathe})`);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(neb.x, neb.y, neb.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Calculate mouse offset from center
      const centerX = width / 2;
      const centerY = height / 2;
      const mouseOffsetX = (mouseRef.current.x - centerX) / centerX;
      const mouseOffsetY = (mouseRef.current.y - centerY) / centerY;

      // Draw stars with parallax
      for (const s of stars) {
        // Parallax movement based on depth and mouse position
        const parallaxStrength = s.depth * 30;
        s.x = s.baseX - mouseOffsetX * parallaxStrength;
        s.y = s.baseY - mouseOffsetY * parallaxStrength;

        // Twinkle animation
        s.phase += s.speed;
        s.alpha = s.baseAlpha + Math.sin(s.phase) * s.baseAlpha * 0.4;
        s.alpha = Math.max(0.05, Math.min(1, s.alpha));

        // Glow effect for brighter stars
        if (s.r > 1.2) {
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
          glow.addColorStop(0, `rgba(${s.color}, ${s.alpha * 0.4})`);
          glow.addColorStop(0.5, `rgba(${s.color}, ${s.alpha * 0.1})`);
          glow.addColorStop(1, `rgba(${s.color}, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Star core
        ctx.fillStyle = `rgba(${s.color}, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shooting stars
      if (timestamp - lastShootingStarTime > 4000 && Math.random() < 0.02) {
        const inactive = shootingStars.find(s => !s.active);
        if (inactive) {
          inactive.x = Math.random() * width * 0.8;
          inactive.y = Math.random() * height * 0.3;
          inactive.length = Math.random() * 100 + 50;
          inactive.speed = Math.random() * 15 + 10;
          inactive.angle = Math.PI / 4 + Math.random() * 0.2;
          inactive.alpha = 1;
          inactive.active = true;
          lastShootingStarTime = timestamp;
        }
      }

      for (const ss of shootingStars) {
        if (!ss.active) continue;
        
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha -= 0.015;

        if (ss.alpha <= 0 || ss.x > width || ss.y > height) {
          ss.active = false;
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
        grad.addColorStop(0.7, `rgba(200, 220, 255, ${ss.alpha * 0.3})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();
      }

      if (!prefersReduced) rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = e.touches[0].clientX;
        mouseRef.current.targetY = e.touches[0].clientY;
      }
    };

    buildScene();
    mouseRef.current.x = width / 2;
    mouseRef.current.y = height / 2;
    mouseRef.current.targetX = width / 2;
    mouseRef.current.targetY = height / 2;
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("resize", buildScene);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", buildScene);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  useEffect(() => {
    const cleanup = draw();
    return cleanup;
  }, [draw]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* Subtle vignette effect */}
      <div 
        className="absolute inset-0" 
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)"
        }}
      />
    </div>
  );
}
