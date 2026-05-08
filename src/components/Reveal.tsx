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
 * Scroll reveal component with space-themed smooth animations.
 *
 * Uses a combined approach:
 *  - Opacity fade-in with blur for a cosmic emergence effect
 *  - Y-translate for perceived depth / lift-off
 *  - Cubic-bezier ease that creates a smooth, floating feel
 *  - Filter blur that clears as the element arrives
 */
export function Reveal({
  children,
  delay = 0,
  from = "up",
  distance = 40,
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
      scale: 0.95,
      filter: "blur(8px)",
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.9,
        delay,
        // Smooth, cosmic ease curve
        ease: [0.25, 0.1, 0.25, 1],
        opacity: {
          duration: 0.7,
          delay,
          ease: "easeOut",
        },
        scale: {
          duration: 0.9,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        },
        filter: {
          duration: 0.6,
          delay,
          ease: "easeOut",
        },
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      style={{ willChange: "transform, opacity, filter" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
