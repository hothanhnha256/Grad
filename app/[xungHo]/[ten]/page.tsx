import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Invitation } from "@/components/Invitation";
import { recipientMetadata } from "@/lib/meta";
import { GUESTS } from "@/lib/guests";
import { resolveRecipient } from "@/lib/recipient";

type Props = { params: Promise<{ xungHo: string; ten: string }> };

export function generateStaticParams() {
  return Object.keys(GUESTS).map((path) => {
    const [xungHo, ten] = path.split("/");
    return { xungHo, ten };
  });
}

async function recipientFrom(params: Props["params"]) {
  const { xungHo, ten } = await params;
  return resolveRecipient(xungHo, ten);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return recipientMetadata(await recipientFrom(params));
}

export default async function GuestPage({ params }: Props) {
  const r = await recipientFrom(params);
  if (!r) notFound();
  return <Invitation recipient={r} />;
}
