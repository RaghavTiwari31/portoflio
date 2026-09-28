import { useEffect, useRef, useState } from "react";
import { SECTIONS } from "@/data";
import { goTo } from "@/lib/nav";

const CX = 260;
const CY = 165;
const TILT = 0.5; // vertical squash for the perspective ellipse
const ORBITS = [90, 135, 180, 225];

// Two destinations share each orbit, on opposite sides.
const BODIES = SECTIONS.map((s, i) => ({
  ...s,
  orbit: ORBITS[Math.floor(i / 2)],
  offset: (i % 2) * Math.PI + i * 0.6,
  speed: 0.16 / (1 + Math.floor(i / 2) * 0.55),
  r: [7, 9, 8, 12, 8, 7, 9, 10][i],
  color: ["var(--c-teal)", "var(--c-mustard)", "var(--c-orange)", "var(--c-red)", "var(--c-cream)", "var(--c-blue)", "var(--c-teal)", "var(--c-mustard)"][i],
  ring: i === 3 || i === 7,
}));

/**
 * Hero navigation chart: each orbiting body is a section of the site.
 * Hovering pauses the system and shows a callout; clicking travels there.
 */
export function OrbitNav() {
  const bodyRefs = useRef<(SVGGElement | null)[]>([]);
  const [hover, setHover] = useState<number | null>(null);
  const hoverRef = useRef<number | null>(null);
  const [positions, setPositions] = useState(() => BODIES.map(() => ({ x: CX, y: CY })));
  const posRef = useRef(positions);

  useEffect(() => {
    hoverRef.current = hover;
  }, [hover]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let t = 0;
    let prev = performance.now();
    const place = () => {
      BODIES.forEach((b, i) => {
        const a = b.offset + t * b.speed;
        const x = CX + Math.cos(a) * b.orbit;
        const y = CY + Math.sin(a) * b.orbit * TILT;
        posRef.current[i] = { x, y };
        bodyRefs.current[i]?.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      });
    };
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (hoverRef.current === null) t += dt;
      place();
      raf = requestAnimationFrame(loop);
    };
    place();
    setPositions([...posRef.current]);
    if (!reduced) raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onEnter = (i: number) => {
    setPositions([...posRef.current]);
    setHover(i);
  };

  const active = hover !== null ? BODIES[hover] : null;
  const pos = hover !== null ? positions[hover] : null;

  return (
    <div className="relative w-full select-none">
      <svg viewBox="0 0 520 330" className="h-auto w-full overflow-visible" role="navigation" aria-label="Site navigation chart">
        {/* Chart frame and graticule */}
        <g stroke="var(--c-line-strong)" strokeWidth="1" fill="none">
          <line x1={CX} y1="6" x2={CX} y2="324" strokeDasharray="2 6" />
          <line x1="10" y1={CY} x2="510" y2={CY} strokeDasharray="2 6" />
          {Array.from({ length: 36 }).map((_, i) => {
            const a = (i / 36) * Math.PI * 2;
            const r1 = 248;
            const r2 = i % 3 === 0 ? 238 : 243;
            return (
              <line
                key={i}
                x1={CX + Math.cos(a) * r1}
                y1={CY + Math.sin(a) * r1 * TILT}
                x2={CX + Math.cos(a) * r2}
                y2={CY + Math.sin(a) * r2 * TILT}
              />
            );
          })}
        </g>

        {/* Orbits */}
        {ORBITS.map((r, i) => (
          <ellipse
            key={r}
            cx={CX}
            cy={CY}
            rx={r}
            ry={r * TILT}
            fill="none"
            stroke={hover !== null && BODIES[hover].orbit === r ? "var(--c-mustard)" : "var(--c-cream)"}
            strokeOpacity={hover !== null && BODIES[hover].orbit === r ? 0.9 : 0.22}
            strokeDasharray={i % 2 ? "1 5" : "6 5"}
          />
        ))}

        {/* Retro striped sun */}
        <defs>
          <clipPath id="sun-clip">
            <circle cx={CX} cy={CY} r="34" />
          </clipPath>
        </defs>
        <g clipPath="url(#sun-clip)">
          <rect x={CX - 34} y={CY - 34} width="68" height="68" fill="var(--c-mustard)" />
          <rect x={CX - 34} y={CY - 10} width="68" height="44" fill="var(--c-orange)" />
          <rect x={CX - 34} y={CY + 10} width="68" height="24" fill="var(--c-red)" />
          {[2, 12, 20, 27].map((y) => (
            <rect key={y} x={CX - 34} y={CY + y} width="68" height="2.5" fill="var(--c-space)" />
          ))}
        </g>
        <text x={CX} y={CY - 42} textAnchor="middle" className="font-mono" fontSize="9" fill="var(--c-dim)" letterSpacing="2">
          RT-01
        </text>

        {/* Leader line to hovered body */}
        {pos && (
          <polyline
            points={`${pos.x},${pos.y} ${pos.x},${pos.y < CY ? 4 : 326} ${pos.x < CX ? 8 : 512},${pos.y < CY ? 4 : 326}`}
            fill="none"
            stroke="var(--c-mustard)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}

        {/* Bodies — each one a link */}
        {BODIES.map((b, i) => (
          <g key={b.id} ref={(el) => void (bodyRefs.current[i] = el)} transform={`translate(${CX} ${CY})`}>
            <a
              href={`#${b.id}`}
              aria-label={`${b.code} ${b.label} — ${b.short}`}
              onClick={(e) => {
                e.preventDefault();
                goTo(b.id);
              }}
              onMouseEnter={() => onEnter(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => onEnter(i)}
              onBlur={() => setHover(null)}
              className="outline-none"
            >
              <circle r={b.r + 14} fill="transparent" />
              {hover === i && <circle r={b.r + 7} fill="none" stroke="var(--c-mustard)" strokeWidth="1.5" strokeDasharray="3 2" />}
              {b.ring && <ellipse rx={b.r * 2} ry={b.r * 0.55} fill="none" stroke={b.color} strokeWidth="1.5" />}
              <circle r={b.r} fill={b.color} stroke="var(--c-space)" strokeWidth="2" />
              <rect x={-b.r} y={-1} width={b.r * 2} height="2" fill="var(--c-space)" opacity="0.5" />
              <text
                x={b.r + 6}
                y={4}
                className="font-mono"
                fontSize="10"
                fill={hover === i ? "var(--c-mustard)" : "var(--c-cream)"}
                letterSpacing="1"
                opacity={hover === null || hover === i ? 0.9 : 0.35}
              >
                {b.code}
              </text>
            </a>
          </g>
        ))}
      </svg>

      {/* Destination readout */}
      <div className="mt-2 flex min-h-[3.25rem] items-center justify-between gap-4 border-y border-[var(--c-line)] py-2 font-mono text-xs">
        {active ? (
          <>
            <span>
              <span className="text-[var(--c-mustard)]">DEST {active.code}</span>
              <span className="mx-2 text-[var(--c-dim)]">/</span>
              <span className="uppercase">{active.label}</span>
            </span>
            <span className="text-[var(--c-red)]">CLICK TO ENGAGE ▸</span>
          </>
        ) : (
          <span className="text-[var(--c-dim)]">
            NAV CHART — HOVER A BODY TO PLOT A COURSE<span className="animate-blink">_</span>
          </span>
        )}
      </div>
    </div>
  );
}
