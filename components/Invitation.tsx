import Image from "next/image";
import { EVENT } from "@/lib/event";
import { buildCalendarUrl, buildDirectionsUrl, telUrl, zaloUrl } from "@/lib/invite";
import { greetingFor, type Recipient } from "@/lib/recipient";
import { capitalize } from "@/lib/text";
import { CampusMap } from "./CampusMap";
import { Contact } from "./Contact";
import { CountdownCard } from "./CountdownCard";
import { Flower, Note, PaperPlane, Sparkle, Swirl } from "./Doodles";
import { Drift } from "./Drift";
import { EnvelopeGate } from "./EnvelopeGate";
import { FloatingPlayer } from "./FloatingPlayer";
import { Hero } from "./Hero";
import { Notebook } from "./Notebook";
import { Reveal, SectionTitle } from "./Reveal";
import { Ticket } from "./Ticket";

const MAP_EMBED =
  "https://www.google.com/maps?q=" + encodeURIComponent(`${EVENT.venue}, ${EVENT.address}`) + "&z=17&hl=vi&output=embed";

export function Invitation({ recipient }: { recipient: Recipient | null }) {
  const { greeting, self, you } = greetingFor(recipient);
  const Self = capitalize(self);
  const zalo = zaloUrl(EVENT.phone);
  const guest = recipient ? `${recipient.label}${recipient.name ? ` ${recipient.name}` : ""}` : "Khách quý";

  return (
    <>
      <EnvelopeGate greeting={greeting} from={EVENT.name} />
      <Drift />

      <main id="main" className="relative z-[1] flex flex-col gap-16 overflow-x-clip pb-10 pt-6 sm:gap-20 sm:pt-10">
        <Notebook header>
          <Hero greeting={greeting} you={you} self={self} calendarUrl={buildCalendarUrl(EVENT)} zaloUrl={zalo} />
        </Notebook>

        <Notebook id="invite">
          <Sparkle className="absolute right-6 top-10 w-8 sm:right-14" />
          <Flower className="absolute left-4 top-12 hidden w-12 sm:left-12 sm:block" delay={0.3} />
          <SectionTitle title={`Hẹn gặp ${you} lúc 12:00`} sub="Thứ Bảy, 28/11/2026 · tại Bách khoa" />
          <Reveal className="relative mx-auto max-w-2xl">
            <div className="tape absolute -top-3 left-1/2 z-10 h-7 w-32 -translate-x-1/2 -rotate-2" />
            <div className="lined -rotate-[0.6deg] rounded-[6px] bg-white px-6 pb-8 pt-9 shadow-soft sm:px-10">
              <p className="pl-6 font-hand text-[1.3rem] leading-[36px] text-ink sm:text-[1.45rem]">
                Trân trọng mời {you} đến chung vui cùng {self} trong ngày tốt nghiệp. Sau những năm tháng ở Bách khoa,
                có {you} ở đây thì ngày này mới thật sự trọn vẹn.
              </p>
              <p className="mt-2 pr-2 text-right font-script text-3xl font-bold text-ink">— {Self}</p>
            </div>
          </Reveal>
          <div className="mt-14">
            <CountdownCard you={you} self={self} />
          </div>
          <div className="relative mt-16">
            <PaperPlane className="absolute -top-14 right-4 w-20 sm:right-16" delay={0.2} />
            <Ticket guest={guest} />
          </div>
        </Notebook>

        <Notebook id="meet">
          <SectionTitle
            title="Đường tới điểm hẹn"
            sub={`Vào cổng 1 (268 Lý Thường Kiệt), đi về phía sân bóng đá — ${self} đứng giữa sân bóng và tòa A2.`}
          />
          <CampusMap selfLabel={Self} />
          <div className="mt-8 flex flex-col items-center gap-5">
            <a className="btn btn-navy" href={buildDirectionsUrl(EVENT)} target="_blank" rel="noopener">
              🧭 Chỉ đường đến trường
            </a>
            <details className="w-full max-w-3xl">
              <summary className="mx-auto flex min-h-12 w-fit cursor-pointer items-center font-extrabold text-ink underline decoration-red decoration-2 underline-offset-4">
                Xem trên Google Maps
              </summary>
              <iframe
                src={MAP_EMBED}
                title="Bản đồ Google: Đại học Bách khoa, 268 Lý Thường Kiệt"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="mt-3 h-[clamp(16rem,40vw,24rem)] w-full rounded-[10px] shadow-soft"
              />
            </details>
          </div>
          <div className="relative mt-6 flex items-center justify-center gap-4">
            <Swirl className="hidden w-40 sm:block" />
            <Note rotate={-3}>Lạc đường thì gọi {self} nha!</Note>
          </div>
        </Notebook>

        <Notebook id="contact">
          <Contact self={self} Self={Self} phone={EVENT.phone} zaloUrl={zalo} telUrl={telUrl(EVENT.phone)} />
        </Notebook>

        <footer className="flex flex-col items-center gap-3 px-4 pb-24 pt-4 text-center text-white">
          <Image src="/img/hcmut-logo.webp" alt="" width={240} height={242} className="h-14 w-auto" />
          <p className="font-script text-3xl font-bold">Hẹn gặp {you} ngày 28/11 nhé!</p>
          <p className="font-serif text-sm text-sky-soft/80">Thiệp mời lễ tốt nghiệp · {EVENT.name} · 2026</p>
        </footer>
      </main>

      <FloatingPlayer />
    </>
  );
}
