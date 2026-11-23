"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { toggleMusic, useMusicPlaying } from "@/lib/audio";
import { useInviteOpened } from "@/lib/opened";
import { Mortarboard } from "./Art";

export function FloatingPlayer() {
  const opened = useInviteOpened();
  const playing = useMusicPlaying();

  return (
    <AnimatePresence>
      {opened && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 140, damping: 16 }}
          className="fixed bottom-4 right-4 z-[90] flex items-center gap-3 paper rounded-full py-1.5 pl-1.5 pr-4 shadow-paper sm:bottom-6 sm:right-6"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <button
            type="button"
            onClick={toggleMusic}
            aria-label={playing ? "Tạm dừng nhạc" : "Phát nhạc"}
            className="group relative h-14 w-14 shrink-0 rounded-full"
          >
            <span
              className="absolute inset-0 animate-spin-slow rounded-full"
              style={{
                animationPlayState: playing ? "running" : "paused",
                background: "repeating-radial-gradient(circle at 50% 50%, #0d1c4a 0 2px, #1f3576 2px 4px)",
              }}
            >
              <span className="absolute inset-[20%] grid place-items-center rounded-full bg-red">
                <Mortarboard className="w-[80%]" />
              </span>
            </span>
            <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-sun text-navy-deep shadow-soft transition-transform group-hover:scale-110">
              {playing ? <Pause className="h-3 w-3 fill-current" /> : <Play className="ml-0.5 h-3 w-3 fill-current" />}
            </span>
          </button>
          <span className="hidden font-hand text-base text-ink sm:block">Nhạc hộp tốt nghiệp</span>
          <span className="flex h-5 items-end gap-[3px]" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="w-[4px] rounded-full bg-red"
                animate={playing ? { height: ["30%", "100%", "45%", "80%", "30%"] } : { height: "25%" }}
                transition={playing ? { duration: 1.1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" } : { duration: 0.3 }}
              />
            ))}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
