import { HONORIFICS } from "./honorifics";
import { GUESTS } from "./guests";

export { HONORIFICS };

export type Recipient = { key: string; label: string; name: string; self: string };

const MAX_NAME = 40;
const DEFAULT_GREETING = { greeting: "Trân trọng kính mời bạn", self: "Nhã" };

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeName(s: string): string {
  return s
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) => (w ? w[0].toLocaleUpperCase("vi") + w.slice(1).toLocaleLowerCase("vi") : w))
    .join(" ")
    .slice(0, MAX_NAME)
    .trim();
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return "";
  }
}

function findKey(raw: string): string | undefined {
  const k = slugify(safeDecode(raw));
  return k in HONORIFICS ? k : undefined;
}

/** Resolve a recipient from a URL path (/anh/tuan) or query (?x=anh&t=Tuấn). */
export function resolveRecipient(rawKey?: string, rawName?: string): Recipient | null {
  if (!rawKey) return null;
  const key = findKey(rawKey);
  if (!key) return null;
  const { label, self } = HONORIFICS[key];
  const decoded = rawName ? safeDecode(rawName) : "";
  const guest = GUESTS[`${key}/${slugify(decoded)}`];
  const name = guest && slugify(decoded) === decoded.trim() ? guest : normalizeName(decoded);
  return { key, label, name, self };
}

export function greetingFor(r: Recipient | null): { greeting: string; self: string } {
  if (!r) return DEFAULT_GREETING;
  return { greeting: `Thân mời ${r.label}${r.name ? ` ${r.name}` : ""}`, self: r.self };
}
