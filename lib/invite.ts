import { EVENT, type EventInfo } from "./event";

export type Countdown = {
  state: "before" | "during" | "after";
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/** Counts down to the next time slot; "during" inside any slot; "after" once the last one ends. */
export function getCountdown(nowMs: number, event: EventInfo = EVENT): Countdown {
  const zero = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const slots = event.slots.map((s) => ({ start: Date.parse(s.start), end: Date.parse(s.end) }));
  if (slots.some((s) => nowMs >= s.start && nowMs < s.end)) return { state: "during", ...zero };
  const next = slots.find((s) => nowMs < s.start);
  if (!next) return { state: "after", ...zero };
  const total = Math.ceil((next.start - nowMs) / 1000);
  return {
    state: "before",
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/** 2026-11-28T10:00:00+07:00 -> 20261128T030000Z */
function toCalendarStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildCalendarUrl(event: EventInfo = EVENT): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Gặp mặt mừng tốt nghiệp cùng ${event.name}`,
    // A calendar link holds one event: use the first slot and mention the others in details.
    dates: `${toCalendarStamp(event.slots[0].start)}/${toCalendarStamp(event.slots[0].end)}`,
    ctz: "Asia/Ho_Chi_Minh",
    location: `${event.venue}, ${event.address}`,
    details: `Hẹn gặp bạn tại Bách khoa, ${event.meetPoint}, khung giờ ${event.timeLabel}. Liên hệ ${event.shortName} qua Zalo/SĐT ${event.phone}.`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function buildDirectionsUrl(event: EventInfo = EVENT): string {
  const params = new URLSearchParams({ api: "1", destination: `${event.venue}, ${event.address}` });
  return `https://www.google.com/maps/dir/?${params}`;
}

export const zaloUrl = (phone: string) => `https://zalo.me/${phone}`;
export const telUrl = (phone: string) => `tel:+84${phone.replace(/^0/, "")}`;
