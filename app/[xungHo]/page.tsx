import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Invitation } from "@/components/Invitation";
import { GUESTS } from "@/lib/guests";
import { recipientMetadata } from "@/lib/meta";
import { resolveSegment } from "@/lib/recipient";

// One-segment links: a guest without an honorific (/khanh-linh) or an honorific alone (/thay).
// The folder is named [xungHo] because Next requires one param name per level,
// shared with /[xungHo]/[ten].
type Props = { params: Promise<{ xungHo: string }> };

export function generateStaticParams() {
  return Object.keys(GUESTS)
    .filter((path) => !path.includes("/"))
    .map((xungHo) => ({ xungHo }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return recipientMetadata(resolveSegment((await params).xungHo));
}

export default async function SingleSegmentPage({ params }: Props) {
  const r = resolveSegment((await params).xungHo);
  if (!r) notFound();
  return <Invitation recipient={r} />;
}
