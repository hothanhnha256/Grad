"use client";

import { motion } from "framer-motion";
import { CalendarPlus, MessageCircle } from "lucide-react";
import { EVENT } from "@/lib/event";
import { useInviteOpened } from "@/lib/opened";
import { CapOutline, Flower, HandStar, Note, PaperPlane, Paperclip, ScribbleHeart, Sparkle, Swirl } from "./Doodles";
import { StampPhoto } from "./StampPhoto";

type Props = { greeting: string; you: string; self: string; calendarUrl: string; zaloUrl: string };

export function Hero({ greeting, you, self, calendarUrl, zaloUrl }: Props) {
  const opened = useInviteOpened();
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: opened ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { delay, type: "spring" as const, stiffness: 150, damping: 16 },
  });

  return (
    <div className="relative grid grid-cols-2 items-start gap-x-4 gap-y-8 lg:grid-cols-[1fr_1.35fr_1fr] lg:gap-x-8">
      {/* center: the invitation itself */}
      <div className="relative col-span-2 text-center lg:col-span-1 lg:col-start-2 lg:row-start-1">
        <CapOutline className="absolute -right-2 -top-6 w-16 rotate-12 sm:w-20 lg:-right-8" delay={1.2} />
        <Sparkle className="absolute -left-1 top-2 w-7 lg:-left-6" delay={1.5} />
        <Flower className="absolute -left-3 bottom-24 hidden w-12 sm:block lg:-left-10" delay={1.7} />

        <motion.p {...fade(0)} className="reveal font-serif text-lg italic text-ink-soft sm:text-xl">
          {greeting}
        </motion.p>

        <motion.h1
          id="hero-name"
          tabIndex={-1}
          className="reveal mt-2 font-script text-[clamp(2.6rem,9vw,4.4rem)] font-bold leading-[1.05] text-ink outline-none"
          initial={{ clipPath: "inset(-30% 100% -30% -10%)" }}
          animate={opened ? { clipPath: "inset(-30% -10% -30% -10%)" } : { clipPath: "inset(-30% 100% -30% -10%)" }}
          transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
        >
          “Hẹn gặp {you} ở Bách khoa!”
        </motion.h1>

        <motion.div {...fade(1.2)} className="reveal mt-6">
          <p className="font-serif text-sm text-ink-soft">Lễ tốt nghiệp của</p>
          <p className="font-serif text-[clamp(1.7rem,4.6vw,2.3rem)] font-semibold leading-tight text-navy">{EVENT.name}</p>
          <p className="mt-1 text-base font-bold text-ink-soft sm:text-lg">Cử nhân Khoa học Máy tính · Niên khóa 2022</p>
          <p className="mt-3 inline-block -rotate-1 rounded-md bg-sun-soft px-3 py-1 font-hand text-xl text-ink">
            <time dateTime={EVENT.start}>{EVENT.dateLabel}</time> · 12:00
          </p>
        </motion.div>

        <motion.div {...fade(1.45)} className="reveal mt-7 flex flex-col items-stretch justify-center gap-3 whitespace-nowrap sm:flex-row lg:flex-col xl:flex-row">
          <a className="btn btn-navy" href={calendarUrl} target="_blank" rel="noopener">
            <CalendarPlus className="h-5 w-5" /> Lưu vào lịch
          </a>
          <a className="btn btn-paper" href={zaloUrl} target="_blank" rel="noopener">
            <MessageCircle className="h-5 w-5" /> Nhắn Zalo cho {self}
          </a>
        </motion.div>
      </div>

      {/* left: holding the diploma, clipped on */}
      <div className="relative col-span-1 pt-8 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:pt-14">
        <Note className="absolute -top-2 left-0 z-10 max-w-[11rem] lg:-top-2 lg:left-2" rotate={-8}>
          Nhớ đến chung vui nha!
        </Note>
        <div className="relative">
          <Paperclip className="absolute -left-3 top-6 z-20 w-6 -rotate-12 sm:w-8" />
          <StampPhoto
            src="/img/gallery-2-600.webp"
            alt="Nhã cầm bằng tốt nghiệp trước tòa nhà kính"
            rotate={-6}
            delay={0.5}
            show={opened}
            sizes="(max-width: 1024px) 45vw, 280px"
          />
        </div>
        <HandStar className="absolute -bottom-10 -left-2 w-16 -rotate-12 sm:w-20" delay={1.6} />
      </div>

      {/* right: the portrait */}
      <div className="relative col-span-1 pt-16 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:pt-24">
        <Sparkle className="absolute right-2 top-2 w-6" delay={1.8} color="#1b2f72" />
        <StampPhoto
          src="/img/hero-800.webp"
          alt={`${EVENT.name} trong lễ phục tốt nghiệp Bách khoa`}
          rotate={5}
          delay={0.7}
          show={opened}
          preload
          sizes="(max-width: 1024px) 45vw, 280px"
        />
        <ScribbleHeart className="absolute -bottom-12 -right-1 w-16 rotate-6 sm:w-20" delay={1.9} />
        <Note className="mt-14 text-right" rotate={-4}>
          Tốt nghiệp rồi nè!
        </Note>
      </div>

      {/* center bottom: the school */}
      <div className="relative col-span-2 mx-auto mt-4 w-[88%] max-w-md lg:col-span-1 lg:col-start-2 lg:row-start-2 lg:mt-2">
        <Swirl className="absolute -left-32 top-1/3 hidden w-36 -rotate-12 lg:block" delay={1.4} />
        <PaperPlane className="absolute -right-10 -top-4 z-10 w-16 rotate-6 sm:-right-16 sm:w-24" delay={1.6} />
        <StampPhoto
          src="/img/hcmut-campus-800.webp"
          alt="Tòa nhà Trường Đại học Bách khoa TP.HCM"
          ratio="4/3"
          rotate={3}
          delay={0.9}
          show={opened}
          sizes="(max-width: 1024px) 90vw, 420px"
        />
      </div>
    </div>
  );
}
