import { EVENT, type EventInfo } from "./event";

export type Countdown = {
  state: "before" | "during" | "after";
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function getCountdown(nowMs: number, event: EventInfo = EVENT): Countdown {
  const start = Date.parse(event.start);
  const end = Date.parse(event.end);
  if (nowMs >= end) return { state: "after", days: 0, hours: 0, minutes: 0, seconds: 0 };
  if (nowMs >= start) return { state: "during", days: 0, hours: 0, minutes: 0, seconds: 0 };
  const total = Math.ceil((start - nowMs) / 1000);
  return {
    state: "before",
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/** 2026-11-28T12:00:00+07:00 -> 20261128T050000Z */
function toCalendarStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildCalendarUrl(event: EventInfo = EVENT): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Gặp mặt mừng tốt nghiệp cùng ${event.name}`,
    dates: `${toCalendarStamp(event.start)}/${toCalendarStamp(event.end)}`,
    ctz: "Asia/Ho_Chi_Minh",
    location: `${event.venue}, ${event.address}`,
    details: `Hẹn gặp bạn lúc 12:00 tại Bách khoa, ${event.meetPoint}. Liên hệ ${event.shortName} qua Zalo/SĐT ${event.phone}.`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function buildDirectionsUrl(event: EventInfo = EVENT): string {
  const params = new URLSearchParams({ api: "1", destination: `${event.venue}, ${event.address}` });
  return `https://www.google.com/maps/dir/?${params}`;
}

export const zaloUrl = (phone: string) => `https://zalo.me/${phone}`;
export const telUrl = (phone: string) => `tel:+84${phone.replace(/^0/, "")}`;
