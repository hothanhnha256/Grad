"use client";

import { useEffect, useState } from "react";
import { getCountdown, type Countdown as CountdownValue } from "@/lib/invite";

const UNITS = [
  ["days", "Ngày"],
  ["hours", "Giờ"],
  ["minutes", "Phút"],
  ["seconds", "Giây"],
] as const;

const STATUS = {
  during: "Đang diễn ra — Nhã đang chờ bạn!",
  after: "Cảm ơn bạn đã đến chung vui!",
};

export function Countdown() {
  // null on the server and first client render, so markup matches (no hydration mismatch).
  const [value, setValue] = useState<CountdownValue | null>(null);

  useEffect(() => {
    const tick = () => setValue(getCountdown(Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (value && value.state !== "before") {
    return (
      <p className="countdown-status" role="status">
        {STATUS[value.state]}
      </p>
    );
  }

  return (
    <div className="countdown" role="timer" aria-label="Đếm ngược đến 12:00 ngày 28/11/2026">
      {UNITS.map(([key, label]) => (
        <div className="countdown-cell" key={key}>
          <span className="countdown-num">{value ? String(value[key]).padStart(2, "0") : "--"}</span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
