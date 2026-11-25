"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getCountdown, type Countdown } from "@/lib/invite";
import { capitalize } from "@/lib/text";

function Tile({ value, label }: { value: number | null; label: string }) {
  const text = value === null ? "--" : String(value).padStart(2, "0");
  return (
    <div className="relative w-[4.6rem] [filter:drop-shadow(0_8px_10px_rgba(5,12,40,.25))] sm:w-24">
      {/* ring holes */}
      <div className="absolute -top-2 left-0 right-0 z-10 flex justify-center gap-6" aria-hidden>
        <span className="h-4 w-1.5 rounded-full bg-ring" />
        <span className="h-4 w-1.5 rounded-full bg-ring" />
      </div>
      <div className="overflow-hidden rounded-xl bg-white">
        <div className="bg-red py-1 text-center text-xs font-extrabold text-white sm:text-sm">{label}</div>
        <div className="relative grid h-16 place-items-center overflow-hidden sm:h-20">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={text}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="font-serif text-3xl font-semibold tabular-nums text-navy sm:text-4xl"
            >
              {text}
            </motion.span>
          </AnimatePresence>
          <span className="absolute inset-x-0 top-1/2 h-px bg-paper-deep" aria-hidden />
        </div>
      </div>
    </div>
  );
}

export function CountdownCard({ you, self }: { you: string; self: string }) {
  // null on the server and first client render, so the markup always matches.
  const [c, setC] = useState<Countdown | null>(null);
  useEffect(() => {
    const tick = () => setC(getCountdown(Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (c && c.state !== "before") {
    return (
      <p role="status" className="mx-auto w-fit -rotate-1 rounded-lg bg-sun-soft px-6 py-4 text-center font-script text-3xl font-bold text-ink shadow-soft">
        {c.state === "during"
          ? `Đang diễn ra — ${capitalize(self)} đang chờ ${you}! 🎉`
          : `Cảm ơn ${you} đã đến chung vui! 💙`}
      </p>
    );
  }

  return (
    <div role="timer" aria-label="Đếm ngược đến khung giờ hẹn tiếp theo ngày 28/11/2026" className="flex justify-center gap-3 sm:gap-5">
      <Tile value={c?.days ?? null} label="ngày" />
      <Tile value={c?.hours ?? null} label="giờ" />
      <Tile value={c?.minutes ?? null} label="phút" />
      <Tile value={c?.seconds ?? null} label="giây" />
    </div>
  );
}
