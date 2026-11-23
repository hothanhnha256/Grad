"use client";

import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

/** Meeting point on map/image.png (2048×974): between building A2 and the football pitch. */
export const PIN = { x: 43, y: 47.7 };
/** Walking route from Entrance 1 (Lý Thường Kiệt) to the pin, in image pixels. */
const ROUTE = "M392 470 C 450 432, 540 432, 612 452 S 800 448, 880 465";

export function CampusMap({ selfLabel }: { selfLabel: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start 85%", "center 45%"] });
  const draw = useSpring(scrollYProgress, { stiffness: 70, damping: 20 });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    el.scrollLeft = (el.scrollWidth * (PIN.x - 8)) / 100 - el.clientWidth / 2;
  }, []);

  return (
    <div ref={frameRef} className="relative mx-auto max-w-5xl">
      <div className="tape-sky absolute -top-3 left-10 z-10 h-7 w-28 -rotate-6" />
      <div className="tape absolute -top-3 right-10 z-10 h-7 w-24 rotate-6" />
      <div className="rotate-[-0.6deg] rounded-[10px] bg-white p-2 shadow-paper sm:p-3">
        <div
          ref={scrollerRef}
          tabIndex={0}
          role="region"
          aria-label="Bản đồ khuôn viên, kéo ngang để xem"
          className="overflow-x-auto rounded-[6px]"
        >
          <div className="relative min-w-[780px]">
            <Image
              src="/img/campus-map.webp"
              alt="Bản đồ khuôn viên Đại học Bách khoa cơ sở Lý Thường Kiệt, có đánh dấu đường từ cổng 1 tới điểm hẹn giữa tòa A2 và sân bóng đá"
              width={2048}
              height={974}
              sizes="(max-width: 820px) 780px, 1000px"
              unoptimized
              className="block h-auto w-full"
            />
            <svg viewBox="0 0 2048 974" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
              <path d={ROUTE} fill="none" stroke="#fff" strokeWidth={22} strokeLinecap="round" opacity={0.9} />
              <motion.path
                d={ROUTE}
                fill="none"
                stroke="#b3322b"
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray="1 0"
                style={{ pathLength: draw }}
              />
            </svg>
            <span
              className="absolute -translate-x-1/2 -translate-y-[140%] whitespace-nowrap rounded-full bg-navy px-2.5 py-0.5 text-xs font-extrabold text-white shadow-soft"
              style={{ left: `${(392 / 2048) * 100}%`, top: `${(470 / 974) * 100}%` }}
            >
              🚶 Cổng 1
            </span>
            <span id="map-pin" data-pin-x={PIN.x} data-pin-y={PIN.y} className="absolute h-0 w-0" style={{ left: `${PIN.x}%`, top: `${PIN.y}%` }}>
              <span className="absolute left-0 top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun [animation:ping-soft_1.8s_ease-out_infinite]" />
              <span className="absolute left-0 top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[4px] border-white bg-sun shadow-[0_0_0_3px_#142a66]" />
              <motion.span
                className="absolute bottom-4 left-0 -translate-x-1/2 whitespace-nowrap rounded-full bg-red px-3 py-1 font-hand text-base text-white shadow-soft"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                🎓 {selfLabel} đợi ở đây
              </motion.span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
