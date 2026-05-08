import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function MouseCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring for the main cursor
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  
  // Slower spring for the trail
  const trailConfig = { damping: 35, stiffness: 150 };
  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("glass") ||
        target.classList.contains("hover-lift") ||
        target.closest(".glass") ||
        target.closest(".hover-lift");
      
      setIsHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  // Hide on touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window);
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Trail / outer ring */}
      <motion.div
        ref={trailRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full border border-white/30"
          animate={{
            width: isHovering ? 60 : 40,
            height: isHovering ? 60 : 40,
            borderColor: isHovering ? "rgba(255, 200, 100, 0.5)" : "rgba(255, 255, 255, 0.3)",
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        />
      </motion.div>

      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: isClicking ? 6 : isHovering ? 10 : 8,
            height: isClicking ? 6 : isHovering ? 10 : 8,
            backgroundColor: isHovering ? "#FFC864" : "#FFFFFF",
          }}
          transition={{ type: "spring", damping: 20, stiffness: 400 }}
        />
      </motion.div>

      {/* Particle trails */}
      <ParticleTrail mouseX={mouseX} mouseY={mouseY} />
    </>
  );
}

function ParticleTrail({ mouseX, mouseY }: { mouseX: ReturnType<typeof useMotionValue<number>>; mouseY: ReturnType<typeof useMotionValue<number>> }) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; }[]>([]);
  const idRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const unsubX = mouseX.on("change", (x) => {
      const y = mouseY.get();
      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 30) {
        lastPosRef.current = { x, y };
        const newId = idRef.current++;
        setParticles(prev => [...prev.slice(-5), { id: newId, x, y }]);
        
        // Remove particle after animation
        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== newId));
        }, 600);
      }
    });

    return unsubX;
  }, [mouseX, mouseY]);

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="pointer-events-none fixed z-[9998]"
          initial={{ 
            x: particle.x, 
            y: particle.y, 
            scale: 1, 
            opacity: 0.6,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{ 
            scale: 0, 
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="h-2 w-2 rounded-full bg-[var(--space-gold)]" />
        </motion.div>
      ))}
    </>
  );
}
