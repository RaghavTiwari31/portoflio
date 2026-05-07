import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  /** Reveal direction. */
  from?: "up" | "down" | "left" | "right";
  /** Distance to translate from in pixels. */
  distance?: number;
}

/**
 * Elegant scroll reveal using a clip-path mask wipe + gentle slide.
 * No blur — content appears as if uncovered by a moving curtain.
 */
export function Reveal({
  children,
  delay = 0,
  from = "up",
  distance = 36,
  ...props
}: RevealProps) {
  const offset = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  }[from];

  const clipFrom = {
    up: "inset(0 0 100% 0)",
    down: "inset(100% 0 0 0)",
    left: "inset(0 100% 0 0)",
    right: "inset(0 0 0 100%)",
  }[from];

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
      clipPath: clipFrom,
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      clipPath: "inset(0 0 0 0)",
      transition: {
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      style={{ willChange: "transform, opacity, clip-path" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
