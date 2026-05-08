import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const generatePoints = () => {
  const pts: {x: number, y: number, isBg?: boolean, isWarp?: boolean, angle?: number, dist?: number, color?: string}[] = [];
  const addPt = (x: number, y: number) => {
    // Jitter for organic star look
    const jx = x + (Math.random() - 0.5) * 4;
    const jy = y + (Math.random() - 0.5) * 4;
    pts.push({ x: jx, y: jy, color: "#e2f1ff" });
  };
  
  // R
  for (let y = 40; y <= 160; y += 8) addPt(120, y); // Stem
  for (let x = 120; x <= 160; x += 8) addPt(x, 40); // Top bar
  for (let a = -Math.PI / 2; a <= Math.PI / 2; a += Math.PI / 8) { // Loop
    addPt(160 + Math.cos(a) * 30, 70 + Math.sin(a) * 30);
  }
  for (let x = 120; x <= 160; x += 8) addPt(x, 100); // Middle bar
  for (let i = 0; i <= 60; i += 8) addPt(120 + i, 100 + i); // Leg

  // V
  for (let i = 0; i <= 120; i += 8) {
    addPt(220 + i * (40/120), 40 + i); // Left diagonal
    addPt(300 - i * (40/120), 40 + i); // Right diagonal
  }

  // Realistic Starfield for Warp Effect
  const starColors = ["#ffffff", "#f0f8ff", "#fffacd", "#add8e6", "#ffd700"];
  for (let i = 0; i < 150; i++) { // Decreased count for realism and performance
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 250 + 10;
    pts.push({
      x: 200 + Math.cos(angle) * dist,
      y: 100 + Math.sin(angle) * dist,
      isBg: true,
      isWarp: true,
      angle,
      dist,
      color: starColors[Math.floor(Math.random() * starColors.length)]
    });
  }

  return pts;
};

const POINTS = generatePoints();

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Sequence Timings
    const t1 = setTimeout(() => setPhase(1), 1500); // 1.5s: Form RV
    const t2 = setTimeout(() => setPhase(2), 4500); // 4.5s: Warp effect starts
    const t3 = setTimeout(() => setPhase(3), 7000); // 7.0s: Text fade out & Warp fade out
    const t4 = setTimeout(() => {
      document.body.style.overflow = '';
      onComplete();
    }, 8500); // 8.5s: Complete and unmount

    return () => { 
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020203] overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        
        {/* Galaxy Background Glow */}
        <motion.div
           className="absolute inset-0 z-0"
           initial={{ opacity: 0 }}
           animate={{ 
             opacity: phase >= 2 && phase < 3 ? 0.6 : 0 
           }}
           transition={{ duration: phase === 3 ? 1.5 : 3, ease: "easeOut" }}
           style={{
             backgroundImage: 'radial-gradient(circle at center, rgba(80, 180, 255, 0.2) 0%, transparent 60%)'
           }}
        />

        {/* Warp Stars & RV Constellation */}
        <motion.div
          className="relative z-10 w-full max-w-4xl aspect-[2/1] px-4"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ 
            scale: phase >= 2 ? 8 : 1, // Immense scale for warp effect
            opacity: phase === 3 ? 0 : 1
          }}
          transition={{ 
            scale: { duration: phase >= 2 ? 3 : 0, ease: "easeIn" },
            opacity: { duration: phase === 3 ? 1 : 0, ease: "easeOut" }
          }}
          style={{ willChange: "transform, opacity" }}
        >
          <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
            <defs>
              <filter id="glow-star-lg" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Central Initial Star */}
            <motion.circle
              cx="200" cy="100" r="3" fill="#ffffff" filter="url(#glow-star-lg)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: phase === 0 ? [0, 2, 1] : 0, 
                opacity: phase === 0 ? [0, 1, 1] : 0 
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Exploding Particles Forming "RV" and Background Warp Stars */}
            {POINTS.map((p, i) => {
              if (p.isWarp) {
                // Background star that stretches outwards during warp
                const warpX = p.x + Math.cos(p.angle || 0) * (p.dist || 0) * 8;
                const warpY = p.y + Math.sin(p.angle || 0) * (p.dist || 0) * 8;
                
                // Varied line thickness for realism
                const strokeThickness = Math.random() * 1.5 + 0.3;
                
                return (
                  <motion.line
                    key={i}
                    stroke={p.color}
                    strokeWidth={strokeThickness}
                    strokeLinecap="round"
                    initial={{ x1: 200, y1: 100, x2: 200, y2: 100, opacity: 0 }}
                    animate={{ 
                      x1: phase >= 1 ? p.x : 200, 
                      y1: phase >= 1 ? p.y : 100,
                      x2: phase >= 1 ? (phase >= 2 ? warpX : p.x) : 200, 
                      y2: phase >= 1 ? (phase >= 2 ? warpY : p.y) : 100,
                      opacity: phase === 3 ? 0 : (phase >= 2 ? 0.8 : (phase >= 1 ? 0.3 : 0)),
                    }}
                    transition={{ 
                      opacity: { duration: phase === 3 ? 1 : 2.5, ease: "easeOut" },
                      default: { 
                        duration: phase >= 2 ? 1.5 : 2.5, 
                        ease: phase >= 2 ? "easeIn" : [0.16, 1, 0.3, 1] 
                      }
                    }}
                  />
                );
              }

              // "RV" Initials stars
              return (
                <motion.circle
                  key={i}
                  r={Math.random() * 1.5 + 1.2} // Slightly larger for screen-filling RV
                  fill={p.color}
                  filter="url(#glow-star-lg)"
                  initial={{ cx: 200, cy: 100, opacity: 0 }}
                  animate={{ 
                    cx: phase >= 1 ? p.x : 200, 
                    cy: phase >= 1 ? p.y : 100,
                    opacity: phase === 3 ? 0 : (phase >= 2 ? 0 : (phase >= 1 ? 1 : 0)) // Fade out during warp zoom
                  }}
                  transition={{ 
                    duration: 2.5, 
                    ease: [0.16, 1, 0.3, 1], // Apple-like spring
                    delay: phase === 1 ? Math.random() * 0.8 : 0,
                    opacity: phase >= 2 ? { duration: 1, ease: "easeOut" } : {}
                  }}
                />
              );
            })}
          </svg>
        </motion.div>

        {/* Entering Text */}
        <motion.div
          className="absolute z-20 text-[#e2f1ff] tracking-[0.5em] font-light text-sm sm:text-lg md:text-xl uppercase text-center w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: phase === 3 ? 0 : (phase >= 2 ? 1 : 0),
            scale: phase >= 2 ? 1 : 0.9
          }}
          transition={{ 
            opacity: { duration: phase === 3 ? 1 : 2.5, ease: "easeOut" },
            scale: { duration: 2.5, ease: "easeOut" }
          }}
          style={{ textShadow: "0 0 20px rgba(100, 200, 255, 0.5)", willChange: "transform, opacity" }}
        >
          Entering Raghav's Universe
        </motion.div>

      </div>
    </motion.div>
  );
}
