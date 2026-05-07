import { motion, useScroll, useTransform, type HTMLMotionProps } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface RevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  /** Distance to translate from in pixels. */
  y?: number;
}

/**
 * Elegant scroll reveal: fade + soft upward drift + slight blur lift.
 * Uses a long, gentle ease and per-element scroll progress for a refined feel.
 */
export function Reveal({ children, delay = 0, y = 28, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 40%"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const translateY = useTransform(scrollYProgress, [0, 1], [y, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["6px", "0px"]);
  const filter = useTransform(blur, (b) => `blur(${b})`);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y: translateY, filter, willChange: "transform, opacity, filter" }}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
