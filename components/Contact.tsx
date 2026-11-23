"use client";

import { Check, Copy, MessageCircle, Phone } from "lucide-react";
import { useRef, useState } from "react";
import { capToss } from "@/lib/confetti";
import { CapOutline, HandStar, Note, ScribbleHeart } from "./Doodles";
import { Reveal, SectionTitle } from "./Reveal";

type Props = { self: string; Self: string; phone: string; zaloUrl: string; telUrl: string };

export function Contact({ self, Self, phone, zaloUrl, telUrl }: Props) {
  const [copy, setCopy] = useState<"idle" | "done" | "manual">("idle");
  const numberRef = useRef<HTMLSpanElement>(null);
  const pretty = phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(phone);
      setCopy("done");
      window.setTimeout(() => setCopy("idle"), 2000);
    } catch {
      setCopy("manual");
      const el = numberRef.current;
      if (el) window.getSelection()?.selectAllChildren(el);
    }
  }

  return (
    <div className="relative">
      <HandStar className="absolute -top-6 left-0 w-14 -rotate-12 sm:left-6 sm:w-16" />
      <CapOutline className="absolute -top-8 right-0 w-16 rotate-12 sm:right-6 sm:w-20" delay={0.3} />
      <SectionTitle title={`Đến trường, gọi ${self} nha!`} sub={`Tới cổng 1 rồi nhắn Zalo hoặc gọi, ${self} ra đón liền.`} />
      <Reveal className="text-center">
        <a href={telUrl} className="inline-block font-serif text-[clamp(2.4rem,10vw,4.2rem)] font-semibold leading-none tracking-tight text-navy hover:text-red">
          <span ref={numberRef}>{pretty}</span>
        </a>
        <div className="mx-auto mt-8 flex max-w-2xl flex-col items-stretch justify-center gap-4 sm:flex-row sm:flex-wrap">
          <a className="btn btn-navy" href={zaloUrl} target="_blank" rel="noopener">
            <MessageCircle className="h-5 w-5" /> Nhắn Zalo
          </a>
          <a className="btn btn-paper" href={telUrl}>
            <Phone className="h-5 w-5" /> Gọi {phone}
          </a>
          <button type="button" className="btn btn-paper" onClick={onCopy} aria-live="polite">
            {copy === "done" ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            {copy === "done" ? "Đã sao chép số" : copy === "manual" ? "Bấm giữ số để sao chép" : "Sao chép số"}
          </button>
        </div>
        <button type="button" onClick={() => void capToss()} className="btn btn-gold mt-8 px-8 text-lg">
          🎓 Tung mũ chúc mừng {self}
        </button>
      </Reveal>
      <div className="relative mt-10 flex items-end justify-between">
        <Note rotate={-5}>Đừng có quên {self} nha!</Note>
        <ScribbleHeart className="w-16 rotate-6 sm:w-20" delay={0.4} />
      </div>
      <span className="sr-only">{Self}</span>
    </div>
  );
}
