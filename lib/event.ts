export type TimeSlot = { start: string; end: string };

export type EventInfo = {
  name: string;
  shortName: string;
  /** Guests may come in any of these windows (ISO 8601 with +07:00), in order. */
  slots: TimeSlot[];
  dateLabel: string;
  timeLabel: string;
  venue: string;
  address: string;
  addressFull: string;
  meetPoint: string;
  phone: string;
};

export const EVENT: EventInfo = {
  name: "Hồ Thanh Nhã",
  shortName: "Nhã",
  slots: [
    { start: "2026-11-28T10:00:00+07:00", end: "2026-11-28T12:00:00+07:00" },
  ],
  dateLabel: "Thứ Bảy, 28/11/2026",
  timeLabel: "10:00–12:00",
  venue: "Đại học Bách khoa ĐHQG TP.HCM",
  address: "268 Lý Thường Kiệt, phường Diên Hồng, TP.HCM",
  addressFull: "268 Lý Thường Kiệt, phường Diên Hồng (quận 10 cũ), TP.HCM",
  meetPoint: "giữa tòa A2 và sân bóng đá",
  phone: "0386467955",
};
