"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

/** Springs content in when it scrolls into view. `.reveal` keeps it visible if JS never boots. */
export function Reveal({ className = "", y = 40, rotate = 0, delay = 0, ...rest }: HTMLMotionProps<"div"> & { y?: number; rotate?: number; delay?: number }) {
  return (
    <motion.div
      className={`reveal ${className}`}
      initial={{ opacity: 0, y, rotate }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 110, damping: 16, delay }}
      {...rest}
    />
  );
}

/** Handwritten section heading that springs in. */
export function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <motion.h2
        className="reveal font-script text-[clamp(2.3rem,7vw,3.6rem)] font-bold leading-[1.1] text-ink"
        initial={{ opacity: 0, y: 24, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        {title}
      </motion.h2>
      {sub && <p className="mt-2 font-hand text-lg text-ink-soft sm:text-xl">{sub}</p>}
    </div>
  );
}
