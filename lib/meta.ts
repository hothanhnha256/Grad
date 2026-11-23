import type { Metadata } from "next";
import { EVENT } from "./event";
import { greetingFor, type Recipient } from "./recipient";
import { capitalize } from "./text";

export const OG_IMAGE = {
  url: "/img/og.jpg",
  width: 1200,
  height: 630,
  alt: `${EVENT.name} trong lễ phục tốt nghiệp`,
};

/** Page-level metadata for a guest. Next replaces (not merges) the layout's
 *  openGraph object, so the preview image must be repeated here. */
export function recipientMetadata(r: Recipient | null): Metadata {
  if (!r) return {};
  const { greeting, self, you } = greetingFor(r);
  const title = `${greeting} · Thiệp tốt nghiệp ${EVENT.name}`;
  const description = `${EVENT.dateLabel}, 12:00 tại ${EVENT.venue}. ${capitalize(self)} rất mong được gặp ${you}!`;
  return { title, description, openGraph: { title, description, type: "website", locale: "vi_VN", images: [OG_IMAGE] } };
}
