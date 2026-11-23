"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const PHOTOS = [
  "Nhã trong lễ phục, đứng trước sảnh tòa nhà",
  "Nhã cầm bằng tốt nghiệp trước tòa nhà kính",
  "Nhã giơ bằng tốt nghiệp trước tòa nhà Bách khoa",
  "Nhã cầm bằng tốt nghiệp giữa sân trường",
  "Nhã tựa lan can cầu thang, nhìn ra cửa sổ",
].map((alt, i) => ({ alt, thumb: `/img/gallery-${i + 1}-600.webp`, full: `/img/gallery-${i + 1}-1200.webp` }));

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);

  const step = useCallback((delta: number) => {
    setIndex((i) => (i === null ? i : (i + delta + PHOTOS.length) % PHOTOS.length));
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step]);

  const current = index === null ? null : PHOTOS[index];

  return (
    <>
      <ul className="gallery">
        {PHOTOS.map((p, i) => (
          <li key={p.full} className={`gallery-item g${i + 1}`}>
            <a
              href={p.full}
              onClick={(e) => {
                e.preventDefault();
                setIndex(i);
              }}
              aria-label={`Xem lớn: ${p.alt}`}
            >
              <Image src={p.thumb} alt={p.alt} fill sizes="(max-width: 760px) 50vw, 33vw" />
            </a>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Xem ảnh"
        onClose={() => setIndex(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIndex(null);
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {current && (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.full} alt={current.alt} />
            <figcaption>
              {index! + 1}/{PHOTOS.length}
            </figcaption>
          </figure>
        )}
        <button type="button" className="lb-btn lb-prev" onClick={() => step(-1)} aria-label="Ảnh trước">
          ‹
        </button>
        <button type="button" className="lb-btn lb-next" onClick={() => step(1)} aria-label="Ảnh sau">
          ›
        </button>
        <button type="button" className="lb-btn lb-close" onClick={() => setIndex(null)} aria-label="Đóng">
          ×
        </button>
      </dialog>
    </>
  );
}
