"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const OPEN_MS = 1100;

export function Cover({ greeting, name }: { greeting: string; name: string }) {
  const [opening, setOpening] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const open = useCallback(() => {
    const root = document.documentElement;
    if (root.classList.contains("opened")) return;
    try {
      sessionStorage.setItem("invite-opened", "1");
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setOpening(true);
    window.setTimeout(
      () => {
        root.classList.add("opened");
        document.getElementById("hero-name")?.focus({ preventScroll: true });
      },
      reduce ? 0 : OPEN_MS,
    );
  }, []);

  useEffect(() => {
    if (document.documentElement.classList.contains("opened")) return;
    buttonRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") open();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={`cover${opening ? " is-opening" : ""}`} role="dialog" aria-modal="true" aria-label="Thiệp mời">
      <div className="envelope">
        <div className="envelope-flap" aria-hidden="true" />
        <div className="envelope-body">
          <p className="cover-greeting">{greeting}</p>
          <p className="cover-name">{name}</p>
          <p className="cover-sub">đến dự ngày tốt nghiệp</p>
          <button ref={buttonRef} type="button" className="btn btn-gold" onClick={open}>
            Mở thiệp
          </button>
        </div>
      </div>
    </div>
  );
}
