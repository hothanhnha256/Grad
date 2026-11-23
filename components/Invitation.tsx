import Image from "next/image";
import { EVENT } from "@/lib/event";
import { buildCalendarUrl, buildDirectionsUrl, telUrl, zaloUrl } from "@/lib/invite";
import { greetingFor, type Recipient } from "@/lib/recipient";
import { Cover } from "./Cover";
import { Countdown } from "./Countdown";
import { CampusMap } from "./CampusMap";
import { Gallery } from "./Gallery";
import { CopyPhone } from "./CopyPhone";

const MAP_EMBED =
  "https://www.google.com/maps?q=" +
  encodeURIComponent(`${EVENT.venue}, ${EVENT.address}`) +
  "&z=17&hl=vi&output=embed";

export function Invitation({ recipient }: { recipient: Recipient | null }) {
  const { greeting, self } = greetingFor(recipient);
  const zalo = zaloUrl(EVENT.phone);

  return (
    <>
      <Cover greeting={greeting} name={EVENT.name} />

      <main id="main">
        <header className="hero">
          <div className="hero-text">
            <p className="hero-kicker">Thiệp mời lễ tốt nghiệp</p>
            <p className="hero-greeting">{greeting}</p>
            <h1 id="hero-name" tabIndex={-1}>
              {EVENT.name}
            </h1>
            <p className="hero-degree">{EVENT.degree}</p>
            <p className="hero-date">
              <time dateTime={EVENT.start}>{EVENT.dateLabel}</time>
              <span> lúc 12:00</span>
            </p>
            <div className="hero-actions">
              <a className="btn btn-light" href={buildCalendarUrl(EVENT)} target="_blank" rel="noopener">
                Lưu vào Google Calendar
              </a>
              <a className="btn btn-ghost" href={zalo} target="_blank" rel="noopener">
                Nhắn {self} qua Zalo
              </a>
            </div>
          </div>
          <div className="hero-photo">
            <Image
              src="/img/hero-1600.webp"
              alt={`${EVENT.name} trong lễ phục tốt nghiệp Bách khoa`}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 46vw"
            />
          </div>
          <div className="stole" aria-hidden="true" />
        </header>

        <section className="invite" aria-labelledby="invite-title">
          <div className="wrap invite-grid">
            <div>
              <h2 id="invite-title">Hẹn gặp bạn lúc 12:00</h2>
              <p className="lead">
                Trân trọng mời bạn đến chung vui cùng {self} trong ngày tốt nghiệp. Sau những năm tháng ở
                Bách khoa, có bạn ở đây thì ngày này mới trọn vẹn.
              </p>
            </div>
            <Countdown />
          </div>
        </section>

        <section className="facts" aria-label="Thời gian và địa điểm">
          <dl className="wrap facts-grid">
            <div>
              <dt>Thời gian</dt>
              <dd>
                <strong>{EVENT.dateLabel}</strong>
                Đón khách {EVENT.timeLabel} (giờ TP.HCM)
              </dd>
            </div>
            <div>
              <dt>Địa điểm</dt>
              <dd>
                <strong>Trường {EVENT.venue}</strong>
                {EVENT.addressFull}
              </dd>
            </div>
            <div>
              <dt>Điểm hẹn</dt>
              <dd>
                <strong>Giữa tòa A2 và sân bóng đá</strong>
                Đến nơi thì gọi hoặc nhắn Zalo cho {self}
              </dd>
            </div>
          </dl>
        </section>

        <section className="meet" aria-labelledby="meet-title">
          <div className="wrap">
            <h2 id="meet-title">Điểm hẹn: {EVENT.meetPoint}</h2>
            <p className="muted">
              Vào cổng 268 Lý Thường Kiệt (Entrance 1), đi về phía sân bóng đá; điểm hẹn nằm giữa sân bóng và
              tòa A2.
            </p>
          </div>
          <CampusMap />
          <div className="wrap meet-actions">
            <a className="btn btn-primary" href={buildDirectionsUrl(EVENT)} target="_blank" rel="noopener">
              Chỉ đường đến trường
            </a>
            <details className="gmap">
              <summary>Xem trên Google Maps</summary>
              <iframe
                src={MAP_EMBED}
                title="Bản đồ Google: Đại học Bách khoa, 268 Lý Thường Kiệt"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </details>
          </div>
        </section>

        <section className="moments" aria-labelledby="moments-title">
          <div className="wrap">
            <h2 id="moments-title">Khoảnh khắc</h2>
          </div>
          <Gallery />
        </section>

        <section className="contact" aria-labelledby="contact-title">
          <div className="wrap contact-inner">
            <h2 id="contact-title">Đến trường, liên hệ {self} nhé</h2>
            <a className="phone-display" href={telUrl(EVENT.phone)}>
              {EVENT.phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}
            </a>
            <div className="contact-actions">
              <a className="btn btn-primary" href={zalo} target="_blank" rel="noopener">
                Nhắn Zalo
              </a>
              <a className="btn btn-outline" href={telUrl(EVENT.phone)}>
                Gọi {EVENT.phone}
              </a>
              <CopyPhone phone={EVENT.phone} />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="stole stole-thin" aria-hidden="true" />
        <p>Thiệp mời lễ tốt nghiệp · {EVENT.name} · 2026</p>
      </footer>
    </>
  );
}
