"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export const PIN = { x: 43, y: 47.7 };

export function CampusMap() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    el.scrollLeft = (el.scrollWidth * PIN.x) / 100 - el.clientWidth / 2;
  }, []);

  return (
    <figure className="campus">
      <div className="campus-scroller" ref={scrollerRef} tabIndex={0} aria-label="Bản đồ khuôn viên, kéo ngang để xem">
        <div className="campus-canvas">
          <Image
            src="/img/campus-map.webp"
            alt="Bản đồ khuôn viên Đại học Bách khoa cơ sở Lý Thường Kiệt, có đánh dấu điểm hẹn giữa tòa A2 và sân bóng đá"
            width={2048}
            height={974}
            sizes="(max-width: 760px) 760px, 100vw"
          />
          <span
            className="pin"
            id="map-pin"
            data-pin-x={PIN.x}
            data-pin-y={PIN.y}
            style={{ left: `${PIN.x}%`, top: `${PIN.y}%` }}
          >
            <span className="pin-pulse" aria-hidden="true" />
            <span className="pin-dot" aria-hidden="true" />
            <span className="pin-label">Điểm hẹn 🎓</span>
          </span>
        </div>
      </div>
    </figure>
  );
}
