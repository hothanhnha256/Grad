"use client";

import { useRef, useState } from "react";

export function CopyPhone({ phone }: { phone: string }) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const numberRef = useRef<HTMLSpanElement>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(phone);
      setState("copied");
      window.setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("manual");
      requestAnimationFrame(() => {
        const el = numberRef.current;
        if (el) window.getSelection()?.selectAllChildren(el);
      });
    }
  }

  return (
    <button type="button" className="btn btn-outline" onClick={copy} aria-live="polite">
      {state === "copied" ? (
        "Đã sao chép ✓"
      ) : state === "manual" ? (
        <>
          Bấm giữ để sao chép: <span ref={numberRef}>{phone}</span>
        </>
      ) : (
        "Sao chép số"
      )}
    </button>
  );
}
