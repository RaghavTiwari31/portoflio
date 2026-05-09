import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const generatePoints = () => {
  const pts: {x: number, y: number, dispX: number, dispY: number, isBg?: boolean, color?: string}[] = [];
  const addPt = (x: number, y: number) => {
    // Jitter for organic star look
    const jx = x + (Math.random() - 0.5) * 4;
    const jy = y + (Math.random() - 0.5) * 4;
    
    // Dispersion target
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 300 + 50; 
    const dispX = 200 + Math.cos(angle) * dist;
    const dispY = 100 + Math.sin(angle) * dist;

    pts.push({ x: jx, y: jy, dispX, dispY, color: "#e2f1ff" });
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

  // Realistic Starfield for Background
  const starColors = ["#ffffff", "#f0f8ff", "#fffacd", "#add8e6", "#ffd700"];
  for (let i = 0; i < 150; i++) { // Decreased count for realism and performance
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 250 + 10;
    
    const dispDist = dist + Math.random() * 150;

    pts.push({
      x: 200 + Math.cos(angle) * dist,
      y: 100 + Math.sin(angle) * dist,
      dispX: 200 + Math.cos(angle) * dispDist, // disperse radially
      dispY: 100 + Math.sin(angle) * dispDist,
      isBg: true,
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
    const t1 = setTimeout(() => setPhase(1), 1500); // 1.5s: Form RV & Starfield
    const t2 = setTimeout(() => setPhase(2), 5000); // 5.0s: Wait 1s after form (2.5s) then Fade out
    const t3 = setTimeout(() => {
      document.body.style.overflow = '';
      onComplete();
    }, 6500); // 6.5s: Complete and unmount

    return () => { 
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
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
             opacity: phase === 1 ? 0.6 : 0 
           }}
           transition={{ duration: 3, ease: "easeOut" }}
           style={{
             backgroundImage: 'radial-gradient(circle at center, rgba(80, 180, 255, 0.2) 0%, transparent 60%)'
           }}
        />

        {/* RV Constellation */}
        <motion.div
          className="relative z-10 w-full max-w-4xl aspect-[2/1] px-4"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ opacity: phase === 2 ? 0 : 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ willChange: "transform, opacity" }}
        >
          <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
            <defs>
              <filter id="glow-star-lg" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
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

            {/* Particles */}
            {POINTS.map((p, i) => {
              if (p.isBg) {
                const strokeThickness = Math.random() * 1.5 + 0.3;
                return (
                  <motion.line
                    key={i}
                    stroke={p.color}
                    strokeWidth={strokeThickness}
                    strokeLinecap="round"
                    initial={{ x1: 200, y1: 100, x2: 200, y2: 100, opacity: 0 }}
                    animate={{ 
                      x1: phase >= 2 ? p.dispX : (phase >= 1 ? p.x : 200), 
                      y1: phase >= 2 ? p.dispY : (phase >= 1 ? p.y : 100),
                      x2: phase >= 2 ? p.dispX : (phase >= 1 ? p.x : 200), 
                      y2: phase >= 2 ? p.dispY : (phase >= 1 ? p.y : 100),
                      opacity: phase >= 2 ? 0 : (phase >= 1 ? 0.3 : 0),
                    }}
                    transition={{ 
                      duration: phase >= 2 ? 1.5 : 2.5, 
                      ease: phase >= 2 ? "easeOut" : [0.16, 1, 0.3, 1] 
                    }}
                  />
                );
              }

              // "RV" Initials
              return (
                <motion.circle
                  key={i}
                  r={Math.random() * 1.5 + 1.2}
                  fill={p.color}
                  filter="url(#glow-star-lg)"
                  initial={{ cx: 200, cy: 100, opacity: 0 }}
                  animate={{ 
                    cx: phase >= 2 ? p.dispX : (phase >= 1 ? p.x : 200), 
                    cy: phase >= 2 ? p.dispY : (phase >= 1 ? p.y : 100),
                    opacity: phase >= 2 ? 0 : (phase >= 1 ? 1 : 0)
                  }}
                  transition={{ 
                    duration: phase >= 2 ? 1.5 : 2.5, 
                    ease: phase >= 2 ? "easeOut" : [0.16, 1, 0.3, 1], // Apple-like spring
                    delay: phase === 1 ? Math.random() * 0.8 : 0,
                  }}
                />
              );
            })}
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

