import type { Metadata } from "next";
import { Invitation } from "@/components/Invitation";
import { recipientMetadata } from "@/lib/meta";
import { resolveRecipient } from "@/lib/recipient";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

async function recipientFrom(searchParams: Props["searchParams"]) {
  const sp = await searchParams;
  return resolveRecipient(first(sp.x), first(sp.t));
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return recipientMetadata(await recipientFrom(searchParams));
}

export default async function Home({ searchParams }: Props) {
  return <Invitation recipient={await recipientFrom(searchParams)} />;
}
