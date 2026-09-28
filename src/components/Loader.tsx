import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/* ───────────── RV constellation geometry (viewBox 400 × 200) ───────────── */

const CX = 200;
const CY = 100;

// Anchor stars of the "R" and "V", joined by constellation lines.
const ANCHORS: [number, number][] = [
  [120, 160], // 0  R foot
  [120, 100], // 1  R waist
  [120, 40], //  2  R top
  [158, 40], //  3  R bowl top
  [186, 54], //  4
  [190, 72], //  5  R bowl edge
  [184, 90], //  6
  [158, 100], // 7  R bowl bottom
  [184, 160], // 8  R leg foot
  [222, 40], //  9  V left top
  [262, 160], // 10 V point
  [302, 40], //  11 V right top
];
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 1], [7, 8],
  [9, 10], [10, 11],
];

type Pt = { x: number; y: number; dx: number; dy: number; size: number; delay: number; color: string };

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Point flung outward from the centre, used for the disperse phase. */
function flingFrom(x: number, y: number, min: number, max: number) {
  const a = Math.atan2(y - CY, x - CX) + rand(-0.25, 0.25);
  const d = rand(min, max);
  return { dx: CX + Math.cos(a) * d, dy: CY + Math.sin(a) * d };
}

function buildStars() {
  const letter: Pt[] = [];
  // Filler stars along each edge
  for (const [a, b] of EDGES) {
    const [x1, y1] = ANCHORS[a];
    const [x2, y2] = ANCHORS[b];
    const steps = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / 11));
    for (let i = 1; i < steps; i++) {
      const x = x1 + ((x2 - x1) * i) / steps + rand(-1.5, 1.5);
      const y = y1 + ((y2 - y1) * i) / steps + rand(-1.5, 1.5);
      letter.push({ x, y, ...flingFrom(x, y, 320, 520), size: 2, delay: rand(0, 0.45), color: "var(--c-cream)" });
    }
  }
  const anchors: Pt[] = ANCHORS.map(([x, y], i) => ({
    x,
    y,
    ...flingFrom(x, y, 360, 560),
    size: 4,
    delay: 0.1 + i * 0.03,
    color: i === 10 || i === 2 ? "var(--c-red)" : i % 3 === 0 ? "var(--c-mustard)" : "var(--c-cream)",
  }));
  const field: Pt[] = Array.from({ length: 110 }, () => {
    const a = rand(0, Math.PI * 2);
    const d = rand(30, 340);
    const x = CX + Math.cos(a) * d;
    const y = CY + Math.sin(a) * d * 0.7;
    const palette = ["var(--c-cream)", "var(--c-cream)", "var(--c-mustard)", "var(--c-teal)", "var(--c-orange)"];
    return { x, y, ...flingFrom(x, y, d + 200, d + 420), size: Math.random() < 0.2 ? 2 : 1, delay: rand(0, 0.6), color: palette[Math.floor(rand(0, palette.length))] };
  });
  return { letter, anchors, field };
}

const STARS = buildStars();

const BOOT_LINES = [
  "RT-OS v27.0 // FLIGHT COMPUTER",
  "PLOTTING CONSTELLATION RV ... OK",
  "LOADING MISSION FILES ....... OK",
  "TELEMETRY LINK .............. OK",
  "ALL SYSTEMS NOMINAL",
];

// Timeline (ms)
const T_FORM = 600; //     stars fly out from the seed star into "RV"
const T_LINES = 1700; //   constellation lines draw in
const T_COUNT = 2100; //   countdown 03 → GO
const T_DISPERSE = 3300; // stars scatter outward
const T_DONE = 4100; //    hand off to the site

type Phase = "seed" | "form" | "disperse";

/** Boot sequence: seed star → RV constellation → countdown → disperse. Any key or click skips. */
export function Loader({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("seed");
  const [lines, setLines] = useState(0);
  const [drawLines, setDrawLines] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    if (reduced) {
      at(300, onComplete);
    } else {
      at(T_FORM, () => setPhase("form"));
      BOOT_LINES.forEach((_, i) => at(T_FORM + 150 + i * 230, () => setLines(i + 1)));
      at(T_LINES, () => setDrawLines(true));
      [3, 2, 1, 0].forEach((n, i) => at(T_COUNT + i * 320, () => setCount(n)));
      at(T_DISPERSE, () => setPhase("disperse"));
      at(T_DONE, onComplete);
    }

    const skip = () => onComplete();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      document.body.style.overflow = "";
    };
  }, [onComplete, reduced]);

  const dispersing = phase === "disperse";
  const formed = phase !== "seed";

  const starAnim = (p: Pt, restOpacity: number) => ({
    x: dispersing ? p.dx : formed ? p.x : CX,
    y: dispersing ? p.dy : formed ? p.y : CY,
    opacity: dispersing ? 0 : formed ? restOpacity : 0,
    scale: dispersing ? 1.8 : 1,
  });
  const starTransition = (p: Pt) =>
    dispersing
      ? { duration: 0.8, ease: [0.6, 0, 0.9, 0.4] as const, delay: p.delay * 0.25 }
      : { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const, delay: p.delay };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[var(--c-space)] px-4"
      exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.6, ease: [0.7, 0, 0.3, 1] } }}
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-label="Loading"
      role="status"
    >
      {/* Star chart */}
      <motion.div
        className="panel-corners relative w-full max-w-2xl"
        animate={{ opacity: dispersing ? 0.9 : 1 }}
      >
        <div className="flex items-center justify-between px-1 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--c-dim)]">
          <span>Fig. 0 — Constellation RV</span>
          <span className="hidden sm:inline">RA 12h 00m · Dec +28° 31′</span>
        </div>

        <svg viewBox="0 0 400 200" className="aspect-[2/1] w-full overflow-visible" aria-hidden>
          {/* Graticule */}
          <g stroke="var(--c-line)" strokeWidth="0.5" fill="none">
            {[50, 100, 150].map((y) => (
              <line key={y} x1="0" y1={y} x2="400" y2={y} strokeDasharray="1 4" />
            ))}
            {[100, 200, 300].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="200" strokeDasharray="1 4" />
            ))}
          </g>

          {/* Constellation lines */}
          <g stroke="var(--c-cream)" strokeWidth="0.6" fill="none" strokeDasharray="3 2.5">
            {EDGES.map(([a, b], i) => (
              <motion.line
                key={i}
                x1={ANCHORS[a][0]}
                y1={ANCHORS[a][1]}
                x2={ANCHORS[b][0]}
                y2={ANCHORS[b][1]}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: drawLines ? 1 : 0,
                  opacity: dispersing ? 0 : drawLines ? 0.45 : 0,
                }}
                transition={dispersing ? { duration: 0.25 } : { duration: 0.45, delay: i * 0.04 }}
              />
            ))}
          </g>

          {/* Seed star */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: formed ? 0 : 1, scale: formed ? 0 : 1 }}
            transition={{ duration: formed ? 0.3 : 0.5, ease: "easeOut" }}
          >
            <rect x={CX - 2.5} y={CY - 2.5} width="5" height="5" fill="var(--c-cream)" />
            <rect x={CX - 9} y={CY - 0.75} width="4" height="1.5" fill="var(--c-cream)" />
            <rect x={CX + 5} y={CY - 0.75} width="4" height="1.5" fill="var(--c-cream)" />
            <rect x={CX - 0.75} y={CY - 9} width="1.5" height="4" fill="var(--c-cream)" />
            <rect x={CX - 0.75} y={CY + 5} width="1.5" height="4" fill="var(--c-cream)" />
          </motion.g>

          {/* Background field */}
          {STARS.field.map((p, i) => (
            <motion.rect
              key={`f${i}`}
              width={p.size}
              height={p.size}
              fill={p.color}
              initial={{ x: CX, y: CY, opacity: 0 }}
              animate={starAnim(p, 0.4)}
              transition={starTransition(p)}
            />
          ))}

          {/* Letter stars */}
          {STARS.letter.map((p, i) => (
            <motion.rect
              key={`l${i}`}
              width={p.size}
              height={p.size}
              fill={p.color}
              initial={{ x: CX, y: CY, opacity: 0 }}
              animate={starAnim(p, 0.9)}
              transition={starTransition(p)}
            />
          ))}

          {/* Anchor stars — bigger, with a pixel cross */}
          {STARS.anchors.map((p, i) => (
            <motion.g
              key={`a${i}`}
              initial={{ x: CX, y: CY, opacity: 0 }}
              animate={starAnim(p, 1)}
              transition={starTransition(p)}
            >
              <rect x={-2} y={-2} width="4" height="4" fill={p.color} />
              <rect x={-5.5} y={-0.5} width="2.5" height="1" fill={p.color} />
              <rect x={3} y={-0.5} width="2.5" height="1" fill={p.color} />
              <rect x={-0.5} y={-5.5} width="1" height="2.5" fill={p.color} />
              <rect x={-0.5} y={3} width="1" height="2.5" fill={p.color} />
            </motion.g>
          ))}

          {/* Chart labels */}
          <motion.g
            className="font-mono"
            fontSize="6"
            letterSpacing="1"
            fill="var(--c-dim)"
            animate={{ opacity: drawLines && !dispersing ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <text x="108" y="36">α RT</text>
            <text x="268" y="166">β VI</text>
            <text x="306" y="36">γ</text>
          </motion.g>
        </svg>
      </motion.div>

      {/* Boot log + countdown */}
      <motion.div
        className="mt-6 grid w-full max-w-2xl grid-cols-[1fr_auto] items-end gap-6 border-t border-[var(--c-line)] pt-4"
        animate={{ opacity: dispersing ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="min-h-[7.5rem] font-mono text-[11px] leading-6 text-[var(--c-cream)] sm:text-xs">
          {BOOT_LINES.slice(0, lines).map((l, i) => (
            <div key={l} className={i === BOOT_LINES.length - 1 ? "text-[var(--c-mustard)]" : ""}>
              <span className="text-[var(--c-dim)]">&gt; </span>
              {l}
            </div>
          ))}
          {lines < BOOT_LINES.length && <span className="animate-blink inline-block h-3.5 w-2 translate-y-0.5 bg-[var(--c-cream)]" />}
        </div>
        <div className="text-right">
          <div className="label text-[10px]">T-minus</div>
          <div className="font-display text-6xl font-black leading-none text-[var(--c-red)] tabular-nums sm:text-7xl">
            {count === null ? "--" : count === 0 ? "GO" : `0${count}`}
          </div>
        </div>
      </motion.div>

      <p className="label absolute bottom-6 text-[10px] opacity-60">Press any key to skip</p>
      <div className="stripes-v absolute bottom-0 left-0 h-1.5 w-full" />
    </motion.div>
  );
}
