"use client";

import { motion, useScroll } from "motion/react";

/**
 * A thin bar along the bottom edge of the header whose width mirrors how far the page is
 * scrolled. useScroll gives a value from 0 to 1 that updates as the visitor scrolls, and
 * Motion writes it straight into the transform without re-rendering React. It only moves
 * in step with the visitor's own scrolling, so it stays on under reduced motion.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      className="brand-gradient absolute inset-x-0 bottom-0 h-0.5 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
