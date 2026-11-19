"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

const DURATION = 0.35;
/** Seconds between one item of a group and the next. */
export const STAGGER = 0.06;
// Start once the element reaches 48px into the screen. This is a fixed distance on purpose.
// Asking for a share of the element instead ("15% visible") fails for very tall blocks: on
// a short screen, or a page zoomed far in, 15% of a long list may never fit, and the list
// would stay invisible.
const viewport = { once: true, margin: "0px 0px -48px 0px" } as const;

// Two named states. Motion animates between them like a tiny state machine.
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/** Fades one block in, with a small upward nudge, the first time it scrolls into view. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={itemVariants}
      transition={{
        duration: reduce ? 0 : DURATION,
        delay: reduce ? 0 : delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parent for staggered reveals. It owns the hidden and visible states, and every
 * RevealItem below it, at any depth, inherits them through context, so Motion starts
 * each item a little after the one before.
 */
export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const groupVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : STAGGER } },
  };
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={groupVariants}
    >
      {children}
    </motion.div>
  );
}

/** One child of a RevealGroup. */
export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={itemVariants}
      transition={{ duration: reduce ? 0 : DURATION, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
