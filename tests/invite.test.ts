import { describe, it, expect } from "vitest";
import { EVENT } from "@/lib/event";
import { getCountdown, buildCalendarUrl, buildDirectionsUrl, zaloUrl, telUrl } from "@/lib/invite";

const at = (iso: string) => Date.parse(iso);

describe("getCountdown (11:00–12:00)", () => {
  it("counts down to the first slot", () => {
    expect(getCountdown(at("2026-11-27T10:30:15+07:00"))).toEqual({
      state: "before", days: 1, hours: 0, minutes: 29, seconds: 45,
    });
  });

  it("uses the absolute instant, not the viewer's timezone", () => {
    const c = getCountdown(at("2026-11-28T03:59:59Z"));
    expect(c.state).toBe("before");
    expect(c.seconds).toBe(1);
    expect(getCountdown(at("2026-11-28T04:00:00Z")).state).toBe("during");
  });

  it("is 'during' inside the morning slot with zeroed numbers", () => {
    expect(getCountdown(at("2026-11-28T11:30:00+07:00"))).toEqual({
      state: "during", days: 0, hours: 0, minutes: 0, seconds: 0,
    });
  });

  it("is 'after' once 12:00 passes and never negative", () => {
    const c = getCountdown(at("2026-11-28T12:00:01+07:00"));
    expect(c.state).toBe("after");
    for (const n of [c.days, c.hours, c.minutes, c.seconds]) expect(n).toBe(0);
  });
});

describe("event time label", () => {
  it("is the single morning slot", () => {
    expect(EVENT.timeLabel).toBe("11:00–12:00");
    expect(EVENT.slots).toHaveLength(1);
  });
});

describe("links", () => {
  it("builds the Google Calendar URL", () => {
    const u = new URL(buildCalendarUrl(EVENT));
    expect(u.origin + u.pathname).toBe("https://calendar.google.com/calendar/render");
    expect(u.searchParams.get("action")).toBe("TEMPLATE");
    expect(u.searchParams.get("dates")).toBe("20261128T040000Z/20261128T050000Z");
    expect(u.searchParams.get("ctz")).toBe("Asia/Ho_Chi_Minh");
    expect(u.searchParams.get("text")).toBe("Gặp mặt mừng tốt nghiệp cùng Hồ Thanh Nhã");
    const details = u.searchParams.get("details") ?? "";
    expect(details).toContain("giữa tòa A2 và sân bóng đá");
    expect(details).toContain("0386467955");
    expect(details).toContain("11:00–12:00");
    expect(details).not.toContain("17:00");
  });

  it("builds the directions URL to the school", () => {
    const u = new URL(buildDirectionsUrl(EVENT));
    expect(u.searchParams.get("api")).toBe("1");
    expect(u.searchParams.get("destination")).toBe(
      "Đại học Bách khoa ĐHQG TP.HCM, 268 Lý Thường Kiệt, phường Diên Hồng, TP.HCM",
    );
  });

  it("builds Zalo and tel links", () => {
    expect(zaloUrl("0386467955")).toBe("https://zalo.me/0386467955");
    expect(telUrl("0386467955")).toBe("tel:+84386467955");
  });
});
