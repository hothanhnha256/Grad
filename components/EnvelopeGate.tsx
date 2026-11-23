"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { capBurst } from "@/lib/confetti";
import { playMusic, playPop } from "@/lib/audio";
import { OPENED_EVENT, useInviteOpened } from "@/lib/opened";
import { Mortarboard, Star } from "./Art";

declare global {
  interface Window {
    __inviteReady?: boolean;
  }
}

const FLOATERS = [
  { x: "8%", y: "16%", s: 30, d: 0, cap: false },
  { x: "84%", y: "12%", s: 44, d: 0.6, cap: true },
  { x: "12%", y: "74%", s: 40, d: 1.1, cap: true },
  { x: "86%", y: "70%", s: 26, d: 0.3, cap: false },
  { x: "48%", y: "6%", s: 22, d: 1.4, cap: false },
];

const INK = "#0d1c4a";

function setMainInert(on: boolean) {
  const main = document.getElementById("main");
  if (main) main.inert = on;
}

export function EnvelopeGate({ greeting, from }: { greeting: string; from: string }) {
  const [open, setOpen] = useState(false);
  const [exiting, setExiting] = useState(false);
  const alreadyOpened = useInviteOpened();
  const gone = exiting || alreadyOpened;

  useEffect(() => {
    window.__inviteReady = true;
    if (!document.documentElement.classList.contains("opened")) setMainInert(true);
  }, []);

  const finish = useCallback(() => {
    document.documentElement.classList.add("opened");
    setMainInert(false);
    window.dispatchEvent(new Event(OPENED_EVENT));
    document.getElementById("hero-name")?.focus({ preventScroll: true });
  }, []);

  const handleOpen = useCallback(
    (origin?: { x: number; y: number }) => {
      if (open) return;
      // Audio must start synchronously inside the tap for iOS/Android.
      playPop();
      playMusic();
      try {
        sessionStorage.setItem("invite-opened", "1");
      } catch {}
      setOpen(true);
      void capBurst(origin ?? { x: 0.5, y: 0.45 });
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.setTimeout(() => setExiting(true), reduce ? 200 : 1500);
    },
    [open],
  );

  useEffect(() => {
    if (gone) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleOpen();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gone, handleOpen]);

  return (
    <AnimatePresence onExitComplete={finish}>
      {!gone && (
        <motion.div
          key="gate"
          role="dialog"
          aria-modal="true"
          aria-label="Thiệp mời tốt nghiệp"
          className="gate fixed inset-0 z-[100] flex-col items-center justify-center overflow-hidden bg-navy px-4"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(13,28,74,.72), rgba(13,28,74,.9)), url(/img/hcmut-campus-800.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          exit={{ opacity: 0, scale: 1.12, filter: "blur(6px)" }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        >
          {FLOATERS.map((f, i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute"
              style={{ left: f.x, top: f.y, width: f.s }}
              animate={{ y: [0, -14, 0], rotate: [-10, 10, -10] }}
              transition={{ duration: 3.6, repeat: Infinity, delay: f.d, ease: "easeInOut" }}
            >
              {f.cap ? <Mortarboard /> : <Star fill={i % 2 ? "#8ed3ff" : "#ffd34d"} />}
            </motion.div>
          ))}

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 text-center font-script text-[clamp(2rem,8vw,3rem)] font-bold leading-tight text-white"
          >
            {greeting}
          </motion.p>

          <motion.button
            type="button"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              handleOpen({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 3) / window.innerHeight });
            }}
            aria-label="Mở thiệp mời"
            className="group relative mt-20 w-[min(88vw,380px)] cursor-pointer outline-none"
            initial={{ scale: 0.6, opacity: 0, rotate: -6 }}
            animate={open ? { scale: 1.04, rotate: 0, opacity: 1 } : { scale: 1, opacity: 1, rotate: [-2, 2, -2] }}
            transition={
              open
                ? { type: "spring", stiffness: 200, damping: 14 }
                : { rotate: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }, default: { type: "spring", stiffness: 160, damping: 12 } }
            }
            whileHover={open ? undefined : { scale: 1.04 }}
            whileTap={open ? undefined : { scale: 0.96 }}
          >
            {/* graduation cap perched on the envelope; tossed when opened */}
            <motion.div
              className="absolute -top-[22%] left-1/2 z-[12] w-[34%] -translate-x-1/2"
              animate={open ? { y: -320, rotate: 540, opacity: 0 } : { y: [0, -6, 0], rotate: [-4, 4, -4] }}
              transition={open ? { duration: 1.1, ease: "easeOut" } : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Mortarboard />
            </motion.div>

            <div className="relative aspect-[3/2] w-full" style={{ perspective: 900 }}>
              {/* back */}
              <div className="absolute inset-0 rounded-[18px] border-[3px] border-navy-deep bg-navy-deep shadow-paper" />

              {/* letter */}
              <motion.div
                className="paper absolute inset-x-[7%] top-[8%] flex h-[84%] flex-col items-center justify-center rounded-xl border-2 border-navy-deep px-3 text-center"
                initial={false}
                animate={open ? { y: "-62%", zIndex: 6 } : { y: "0%", zIndex: 2 }}
                transition={{ delay: open ? 0.35 : 0, type: "spring", stiffness: 120, damping: 14 }}
              >
                <span className="font-script text-[clamp(1.6rem,6.6vw,2.2rem)] font-bold leading-tight text-ink">
                  Lễ tốt nghiệp
                </span>
                <span className="mt-1 font-serif text-sm text-ink-soft">{from} · 28/11/2026</span>
              </motion.div>

              {/* pocket */}
              <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 z-[5] h-full w-full" aria-hidden>
                <path d="M3 30 L150 128 L297 30 L297 182 Q297 197 282 197 L18 197 Q3 197 3 182 Z" fill="#2348c7" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
                <path d="M3 192 L120 108 M297 192 L180 108" stroke={INK} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
              </svg>
              <span className="absolute bottom-[10%] left-[8%] z-[7] font-hand text-[clamp(1rem,4vw,1.2rem)] text-white">
                Từ: {from}
              </span>

              {/* postage stamp */}
              <div
                className="absolute bottom-[9%] right-[7%] z-[7] grid h-[34%] w-[22%] rotate-6 place-items-center bg-sun"
                style={{ border: `3px dotted ${INK}`, boxShadow: "0 0 0 4px #ffd34d" }}
              >
                <span className="font-serif text-[clamp(.8rem,3.4vw,1rem)] font-semibold leading-none text-ink">BK</span>
                <span className="-mt-3 font-serif text-[clamp(.7rem,3vw,.85rem)] font-semibold text-cobalt">2026</span>
              </div>

              {/* flap */}
              <motion.div
                className="absolute inset-x-0 top-0 h-[66%]"
                style={{ transformOrigin: "50% 0%", transformStyle: "preserve-3d" }}
                initial={false}
                animate={open ? { rotateX: 180, zIndex: 1 } : { rotateX: 0, zIndex: 8 }}
                transition={{ duration: 0.55, ease: [0.5, 0, 0.3, 1], zIndex: { delay: open ? 0.25 : 0 } }}
              >
                <svg viewBox="0 0 300 132" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
                  <defs>
                    <pattern id="stole-tri" width="24" height="24" patternUnits="userSpaceOnUse">
                      <rect width="24" height="24" fill="#8ed3ff" />
                      <path d="M0 0 L12 12 L24 0 Z" fill="#ffffff" />
                      <path d="M0 24 L12 12 L24 24 Z" fill="#c7e9ff" />
                    </pattern>
                  </defs>
                  <path d="M6 3 Q3 3 4 8 L140 124 Q150 132 160 124 L296 8 Q297 3 294 3 Z" fill="url(#stole-tri)" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
                </svg>
                {/* wax seal */}
                <motion.div
                  className="absolute left-1/2 top-[78%] grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-navy-deep bg-red"
                  animate={open ? { scale: 0, opacity: 0 } : { scale: [1, 1.1, 1] }}
                  transition={open ? { duration: 0.15 } : { duration: 1.2, repeat: Infinity }}
                >
                  <Mortarboard className="w-9" tassel="#ffd34d" />
                </motion.div>
              </motion.div>
            </div>
          </motion.button>

          <motion.p className="mt-10 max-w-sm" animate={{ opacity: open ? 0 : 1 }}>
            <span className="block animate-blink-soft text-center text-lg font-extrabold leading-snug text-white sm:text-xl">
              Chạm vào phong thư để mở thiệp ✨
            </span>
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
