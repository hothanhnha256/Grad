"use client";

import { motion } from "framer-motion";

/* Hand-drawn scrapbook doodles. Each stroke "draws itself" when it scrolls
   into view (pathLength 0 → 1). */

type DoodleProps = { className?: string; delay?: number };

function Stroke({
  d,
  color,
  width = 3,
  delay = 0,
  dash,
  fill = "none",
}: {
  d: string;
  color: string;
  width?: number;
  delay?: number;
  dash?: string;
  fill?: string;
}) {
  if (dash) {
    // dashed strokes can't use pathLength drawing; fade them in instead
    return (
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dash}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
      />
    );
  }
  return (
    <motion.path
      d={d}
      fill={fill}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: "easeInOut", delay }}
    />
  );
}

const RED = "#b3322b";
const GOLD = "#d9a441";
const NAVY = "#1b2f72";

export function HandStar({ className = "", delay = 0, color = RED }: DoodleProps & { color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <Stroke
        color={color}
        width={4}
        delay={delay}
        d="M50 8 C 54 24, 58 34, 62 38 C 72 39, 84 39, 93 41 C 84 50, 75 57, 70 62 C 72 74, 76 85, 78 94 C 68 87, 58 80, 50 76 C 40 82, 30 88, 21 94 C 25 83, 28 72, 31 62 C 22 55, 13 48, 6 41 C 17 40, 28 39, 38 37 C 42 28, 46 18, 50 8 Z"
      />
      <Stroke color={color} width={2.5} delay={delay + 0.5} d="M47 22 C 49 30, 51 36, 53 40" />
    </svg>
  );
}

export function PaperPlane({ className = "", delay = 0 }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true">
      <Stroke color={RED} width={3} delay={delay} d="M4 46 L114 6 L70 74 L56 52 Z" />
      <Stroke color={RED} width={3} delay={delay + 0.4} d="M114 6 L56 52 L50 70 L44 50" />
    </svg>
  );
}

export function CapOutline({ className = "", delay = 0 }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <Stroke color={GOLD} width={4} delay={delay} d="M60 10 L114 34 L60 58 L6 34 Z" />
      <Stroke color={GOLD} width={4} delay={delay + 0.3} d="M30 46 L30 68 C 44 80, 76 80, 90 68 L90 46" />
      <Stroke color={GOLD} width={3.5} delay={delay + 0.6} d="M60 34 C 80 40, 96 46, 98 62 L98 84" />
      <Stroke color={GOLD} width={3.5} delay={delay + 0.8} d="M93 84 L103 84 L101 94 L95 94 Z" />
    </svg>
  );
}

export function Sparkle({ className = "", delay = 0, color = GOLD }: DoodleProps & { color?: string }) {
  return (
    <svg viewBox="0 0 60 80" className={className} aria-hidden="true">
      <Stroke color={color} width={3.5} delay={delay} d="M30 4 C 32 26, 36 36, 56 40 C 36 44, 32 54, 30 76 C 28 54, 24 44, 4 40 C 24 36, 28 26, 30 4 Z" />
    </svg>
  );
}

export function Swirl({ className = "", delay = 0, color = NAVY }: DoodleProps & { color?: string }) {
  return (
    <svg viewBox="0 0 260 120" className={className} aria-hidden="true">
      <Stroke
        color={color}
        width={3}
        dash="7 8"
        delay={delay}
        d="M6 100 C 60 110, 90 70, 70 50 C 50 30, 110 10, 140 40 C 165 66, 200 60, 240 30"
      />
      <Stroke color={color} width={3} delay={delay + 0.6} d="M226 22 L242 29 L232 44" />
    </svg>
  );
}

export function ScribbleHeart({ className = "", delay = 0 }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 110" className={className} aria-hidden="true">
      <Stroke color={RED} width={4} delay={delay} d="M60 100 C 20 74, 6 52, 10 32 C 14 12, 44 8, 60 30 C 76 8, 106 12, 110 32 C 114 52, 100 74, 60 100 Z" />
      <Stroke
        color={RED}
        width={2.5}
        delay={delay + 0.6}
        d="M22 30 L40 18 M18 44 L56 20 M22 56 L70 26 M30 66 L84 22 M40 76 L96 30 M50 86 L102 44 M62 92 L94 64"
      />
    </svg>
  );
}

export function Flower({ className = "", delay = 0 }: DoodleProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <Stroke
        color={RED}
        width={3}
        delay={delay}
        d="M40 30 C 30 8, 54 6, 46 30 C 64 16, 74 38, 50 40 C 72 50, 56 72, 44 50 C 44 74, 20 70, 34 48 C 12 56, 8 32, 32 36 C 14 24, 30 8, 40 30 Z"
      />
      <Stroke color={RED} width={3} delay={delay + 0.5} d="M40 38 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0" />
    </svg>
  );
}

export function Paperclip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 110" className={className} aria-hidden="true">
      <path
        d="M28 30 L28 86 C 28 100, 8 100, 8 86 L8 20 C 8 6, 34 6, 34 20 L34 80 C 34 88, 22 88, 22 80 L22 30"
        fill="none"
        stroke="#9aa3b5"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path d="M10 22 C 10 12, 30 10, 32 20" fill="none" stroke="#e8ecf4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Handwritten note, e.g. “Đừng có quên mình nha!” */
export function Note({ children, className = "", rotate = -6 }: { children: React.ReactNode; className?: string; rotate?: number }) {
  return (
    <motion.p
      className={`reveal font-hand text-[clamp(1.05rem,2.4vw,1.35rem)] leading-snug text-ink ${className}`}
      style={{ rotate }}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.3 }}
    >
      “{children}”
    </motion.p>
  );
}
