import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  /** Reveal direction — defaults to "up". */
  from?: "up" | "down" | "left" | "right";
  /** How far the element starts displaced, in px. */
  distance?: number;
}

/**
 * Scroll reveal component.
 *
 * Uses a combined approach:
 *  - Opacity fade-in for immediate softness.
 *  - Y-translate for perceived depth / lift-off.
 *  - Cubic-bezier ease that starts slow, accelerates mid-way, and
 *    gracefully overshoots — creating a subtle spring feel without
 *    needing a spring solver (which can cause layout jank on clip-path).
 *
 * The clip-path curtain wipe is intentionally removed because it clips
 * child overflow (e.g. glow shadows on skill tags) and feels mechanical
 * when multiple cards enter simultaneously. The translate + fade alone
 * reads as more organic.
 */
export function Reveal({
  children,
  delay = 0,
  from = "up",
  distance = 28,
  ...props
}: RevealProps) {
  const directionOffset = {
    up:    { x: 0,         y: distance  },
    down:  { x: 0,         y: -distance },
    left:  { x: distance,  y: 0         },
    right: { x: -distance, y: 0         },
  }[from];

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: directionOffset.x,
      y: directionOffset.y,
      // Slight scale-down so the element "arrives" rather than just sliding
      scale: 0.97,
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        // Total animation time — slightly shorter than before for snappiness
        duration: 0.75,
        delay,
        // Custom cubic-bezier: slow out of gate → accelerates → gentle arrival
        ease: [0.16, 1, 0.3, 1],
        // Opacity resolves a touch faster so content isn't "ghostly" for long
        opacity: {
          duration: 0.6,
          delay,
          ease: "easeOut",
        },
        scale: {
          duration: 0.75,
          delay,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      // Trigger as soon as 60 px of the element enters the viewport
      viewport={{ once: true, margin: "-60px" }}
      variants={variants}
      style={{ willChange: "transform, opacity" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
