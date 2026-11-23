"use client";

import type { Shape } from "canvas-confetti";

type ConfettiFn = typeof import("canvas-confetti");

let lib: ConfettiFn | null = null;
let shapes: { cap: Shape; star: Shape; capEmoji: Shape; sparkle: Shape } | null = null;

// Mortarboard silhouette and a 5-point star as confetti paths.
const CAP = "M0 10 L20 0 L40 10 L20 20 Z M10 15 L10 24 Q20 30 30 24 L30 15 L20 20 Z";
const STAR = "M10 0 L12.9 6.9 L20 7.6 L14.6 12.3 L16.2 19.3 L10 15.6 L3.8 19.3 L5.4 12.3 L0 7.6 L7.1 6.9 Z";

const COLORS = ["#2348c7", "#8ed3ff", "#ffd34d", "#ffffff", "#13235b", "#ff7a7a"];

async function load() {
  if (typeof window === "undefined") return null;
  if (!lib) lib = (await import("canvas-confetti")).default;
  if (!shapes) {
    shapes = {
      cap: lib.shapeFromPath({ path: CAP }),
      star: lib.shapeFromPath({ path: STAR }),
      capEmoji: lib.shapeFromText({ text: "🎓", scalar: 2.4 }),
      sparkle: lib.shapeFromText({ text: "✨", scalar: 2 }),
    };
  }
  return { fire: lib, s: shapes };
}

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Big burst of caps & stars from a point (0–1 viewport coords). */
export async function capBurst(origin = { x: 0.5, y: 0.5 }) {
  const c = await load();
  if (!c) return;
  const { fire, s } = c;
  const n = reduced() ? 0.3 : 1;
  const base = { origin, zIndex: 120, disableForReducedMotion: false };
  fire({ ...base, particleCount: Math.round(60 * n), spread: 110, startVelocity: 44, scalar: 1.4, shapes: [s.cap], colors: ["#13235b", "#2348c7"] });
  fire({ ...base, particleCount: Math.round(60 * n), spread: 140, startVelocity: 36, scalar: 1.1, shapes: [s.star], colors: ["#ffd34d", "#8ed3ff", "#ffffff"] });
  fire({ ...base, particleCount: Math.round(14 * n), spread: 90, startVelocity: 32, scalar: 2.2, shapes: [s.capEmoji, s.sparkle], flat: true });
  setTimeout(() => {
    fire({ ...base, particleCount: Math.round(40 * n), angle: 60, spread: 70, origin: { x: 0, y: 0.8 }, shapes: [s.star, "square"], colors: COLORS });
    fire({ ...base, particleCount: Math.round(40 * n), angle: 120, spread: 70, origin: { x: 1, y: 0.8 }, shapes: [s.star, "square"], colors: COLORS });
  }, 260);
}

/** "Tung mũ": caps thrown up from the bottom edge. */
export async function capToss() {
  const c = await load();
  if (!c) return;
  const { fire, s } = c;
  const n = reduced() ? 0.3 : 1;
  for (const x of [0.2, 0.5, 0.8]) {
    fire({
      origin: { x, y: 1.05 },
      angle: 90,
      spread: 50,
      startVelocity: 62,
      gravity: 0.9,
      ticks: 260,
      zIndex: 120,
      particleCount: Math.round(18 * n),
      scalar: 2.4,
      shapes: [s.capEmoji],
      flat: true,
    });
  }
  fire({ origin: { x: 0.5, y: 0.9 }, zIndex: 120, particleCount: Math.round(90 * n), spread: 120, startVelocity: 50, shapes: [s.star, "square"], colors: COLORS });
}
