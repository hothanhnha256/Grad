"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  src: string;
  alt: string;
  ratio?: string;
  rotate?: number;
  delay?: number;
  sizes: string;
  className?: string;
  /** Animate only once this is true (e.g. after the envelope opens); default: on scroll into view. */
  show?: boolean;
  preload?: boolean;
};

/** A photo printed like a postage stamp: white perforated border, tilted. */
export function StampPhoto({ src, alt, ratio = "2/3", rotate = 0, delay = 0, sizes, className = "", show, preload }: Props) {
  const hidden = { opacity: 0, scale: 0.7, rotate: rotate * 2.2, y: 30 };
  const visible = { opacity: 1, scale: 1, rotate, y: 0 };
  const motionProps =
    show === undefined
      ? { initial: hidden, whileInView: visible, viewport: { once: true, margin: "-40px" } }
      : { initial: hidden, animate: show ? visible : hidden };

  return (
    <motion.div
      className={`reveal [filter:drop-shadow(0_10px_14px_rgba(5,12,40,.35))] ${className}`}
      {...motionProps}
      whileHover={{ rotate: 0, scale: 1.04, zIndex: 30 }}
      transition={{ type: "spring", stiffness: 120, damping: 13, delay }}
    >
      <div className="stamp">
        <div className="relative overflow-hidden bg-sky-soft" style={{ aspectRatio: ratio }}>
          <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
        </div>
      </div>
    </motion.div>
  );
}
