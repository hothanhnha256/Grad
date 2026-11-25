import { EVENT } from "@/lib/event";
import { Reveal } from "./Reveal";

function Field({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <dt className="text-sm font-extrabold text-red">{label}</dt>
      <dd className="mt-0.5 font-serif text-lg font-semibold leading-tight text-navy sm:text-xl">{value}</dd>
      {sub && <dd className="mt-1 text-sm font-semibold text-ink-soft">{sub}</dd>}
    </div>
  );
}

export function Ticket({ guest }: { guest: string }) {
  return (
    <Reveal rotate={-2} className="mx-auto max-w-4xl [filter:drop-shadow(0_14px_18px_rgba(5,12,40,.28))]">
      <div className="grid overflow-hidden rounded-[20px] bg-white md:grid-cols-[1fr_auto]">
        <div className="relative">
          <div className="flex items-center justify-between gap-3 bg-navy px-5 py-3 text-white">
            <span className="font-serif text-lg font-semibold">Vé mời · Lễ tốt nghiệp</span>
            <span className="text-2xl" aria-hidden>🎓</span>
          </div>
          <dl className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <Field label="Ngày" value={EVENT.dateLabel} />
            <Field label="Giờ" value="10:00–12:00" sub="hoặc 17:00–18:00 (giờ TP.HCM)" />
            <Field label="Địa điểm" value="ĐH Bách khoa – ĐHQG TP.HCM" sub={EVENT.addressFull} />
            <Field label="Điểm hẹn" value="Giữa tòa A2 và sân bóng đá" sub="Vào cổng 1, đường Lý Thường Kiệt" />
          </dl>
        </div>
        {/* tear-off stub */}
        <div className="relative flex flex-col items-center justify-center gap-3 border-t-2 border-dashed border-ink/50 bg-sun-soft px-6 py-5 md:w-56 md:border-l-2 md:border-t-0">
          <span className="absolute -left-4 -top-4 hidden h-8 w-8 rounded-full bg-paper md:block" />
          <span className="absolute -bottom-4 -left-4 hidden h-8 w-8 rounded-full bg-paper md:block" />
          <span className="text-sm font-extrabold text-red">Khách mời</span>
          <span className="text-center font-script text-3xl font-bold leading-tight text-ink">{guest}</span>
          <div
            className="h-12 w-40"
            aria-hidden
            style={{
              background:
                "repeating-linear-gradient(90deg,#1b2f72 0 2px,transparent 2px 5px,#1b2f72 5px 9px,transparent 9px 11px,#1b2f72 11px 12px,transparent 12px 16px)",
            }}
          />
          <span className="font-hand text-lg text-ink-soft">Số ghế: ngay cạnh {EVENT.shortName} 😄</span>
        </div>
      </div>
    </Reveal>
  );
}
