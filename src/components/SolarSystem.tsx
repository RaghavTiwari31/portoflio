import { useEffect, useRef, useCallback } from "react";

/**
 * Interactive solar system animation for the hero section
 * - Central sun with pulsing glow
 * - Orbiting planets with different sizes, colors, and speeds
 * - Orbit rings with subtle opacity
 * - Mouse interaction affects orbital speed
 */

type Planet = {
  name: string;
  orbitRadius: number;
  size: number;
  color: string;
  glowColor: string;
  speed: number; // radians per frame
  angle: number;
  hasRing?: boolean;
  ringColor?: string;
};

export function SolarSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number; isHovering: boolean }>({ 
    x: 0, y: 0, isHovering: false 
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Planet configuration
    const planets: Planet[] = [
      { 
        name: "Mercury", 
        orbitRadius: 0.15, 
        size: 4, 
        color: "#B5A642", 
        glowColor: "180, 160, 60",
        speed: 0.015, 
        angle: Math.random() * Math.PI * 2 
      },
      { 
        name: "Venus", 
        orbitRadius: 0.22, 
        size: 7, 
        color: "#E6C87A", 
        glowColor: "230, 200, 120",
        speed: 0.011, 
        angle: Math.random() * Math.PI * 2 
      },
      { 
        name: "Earth", 
        orbitRadius: 0.30, 
        size: 8, 
        color: "#4A90D9", 
        glowColor: "74, 144, 217",
        speed: 0.008, 
        angle: Math.random() * Math.PI * 2 
      },
      { 
        name: "Mars", 
        orbitRadius: 0.38, 
        size: 6, 
        color: "#CD5C5C", 
        glowColor: "205, 92, 92",
        speed: 0.006, 
        angle: Math.random() * Math.PI * 2 
      },
      { 
        name: "Jupiter", 
        orbitRadius: 0.52, 
        size: 16, 
        color: "#D4A574", 
        glowColor: "212, 165, 116",
        speed: 0.003, 
        angle: Math.random() * Math.PI * 2 
      },
      { 
        name: "Saturn", 
        orbitRadius: 0.68, 
        size: 14, 
        color: "#F4D58D", 
        glowColor: "244, 213, 141",
        speed: 0.002, 
        angle: Math.random() * Math.PI * 2,
        hasRing: true,
        ringColor: "244, 213, 141"
      },
      { 
        name: "Uranus", 
        orbitRadius: 0.80, 
        size: 10, 
        color: "#7EC8E3", 
        glowColor: "126, 200, 227",
        speed: 0.0015, 
        angle: Math.random() * Math.PI * 2 
      },
      { 
        name: "Neptune", 
        orbitRadius: 0.92, 
        size: 9, 
        color: "#4169E1", 
        glowColor: "65, 105, 225",
        speed: 0.001, 
        angle: Math.random() * Math.PI * 2 
      },
    ];

    let sunPhase = 0;

    const buildScene = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      centerX = width / 2;
      centerY = height / 2;
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      
      const baseRadius = Math.min(width, height) / 2;
      
      // Speed multiplier based on mouse hover
      const speedMultiplier = mouseRef.current.isHovering ? 1.5 : 1;

      // Draw orbit rings
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      for (const planet of planets) {
        const orbitR = planet.orbitRadius * baseRadius;
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbitR, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Sun (simple, no excessive glow)
      sunPhase += 0.02;
      const sunSize = 28 + Math.sin(sunPhase * 0.5) * 2;

      // Single subtle outer glow
      const glowGrad = ctx.createRadialGradient(
        centerX, centerY, sunSize * 0.8,
        centerX, centerY, sunSize * 2
      );
      glowGrad.addColorStop(0, "rgba(255, 200, 100, 0.2)");
      glowGrad.addColorStop(1, "rgba(255, 150, 50, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sunSize * 2, 0, Math.PI * 2);
      ctx.fill();

      // Sun core
      const sunGrad = ctx.createRadialGradient(
        centerX - sunSize * 0.2, centerY - sunSize * 0.2, 0,
        centerX, centerY, sunSize
      );
      sunGrad.addColorStop(0, "#FFF5E6");
      sunGrad.addColorStop(0.3, "#FFD700");
      sunGrad.addColorStop(0.7, "#FFA500");
      sunGrad.addColorStop(1, "#FF6B00");
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sunSize, 0, Math.PI * 2);
      ctx.fill();

      // Draw planets
      for (const planet of planets) {
        planet.angle += planet.speed * speedMultiplier;
        
        const orbitR = planet.orbitRadius * baseRadius;
        const x = centerX + Math.cos(planet.angle) * orbitR;
        const y = centerY + Math.sin(planet.angle) * orbitR;

        // Saturn's ring (before planet body)
        if (planet.hasRing && planet.ringColor) {
          ctx.strokeStyle = `rgba(${planet.ringColor}, 0.6)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(x, y, planet.size * 2.2, planet.size * 0.5, Math.PI / 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Planet body with gradient (no outer glow)
        const planetGrad = ctx.createRadialGradient(
          x - planet.size * 0.3, y - planet.size * 0.3, 0,
          x, y, planet.size
        );
        planetGrad.addColorStop(0, "#FFFFFF");
        planetGrad.addColorStop(0.3, planet.color);
        planetGrad.addColorStop(1, shadeColor(planet.color, -40));
        ctx.fillStyle = planetGrad;
        ctx.beginPath();
        ctx.arc(x, y, planet.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReduced) rafRef.current = requestAnimationFrame(tick);
    };

    const shadeColor = (color: string, percent: number): string => {
      const num = parseInt(color.replace("#", ""), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.max(0, Math.min(255, (num >> 16) + amt));
      const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
      const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
      return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    };

    const onMouseEnter = () => {
      mouseRef.current.isHovering = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.isHovering = false;
    };

    buildScene();
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("resize", buildScene);
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", buildScene);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  useEffect(() => {
    const cleanup = draw();
    return cleanup;
  }, [draw]);

  return (
    <div 
      ref={containerRef}
      className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[450px] h-[450px] md:w-[500px] md:h-[500px] lg:w-[550px] lg:h-[550px] xl:w-[600px] xl:h-[600px] opacity-90 transition-opacity duration-500"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
