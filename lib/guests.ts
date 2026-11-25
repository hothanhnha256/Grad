import { HONORIFICS } from "./honorifics";

/**
 * Danh sách khách → tên hiển thị có dấu.
 *  - "<xưng-hô>/<slug>"  → /ban/thinh   → "Thân mời Bạn Thịnh"
 *  - "<slug>"            → /khanh-linh  → "Thân mời Khánh Linh" (không xưng hô)
 * slug: viết thường, không dấu, nối bằng "-".
 */
export const GUESTS: Record<string, string> = {
  "ban/thinh": "Thịnh",
  "ban/hieu": "Hiệu",
  "ban/tung": "Tùng",
  "ban/trong": "Trọng",
  "chi/mai": "Mai",
  "khanh-linh": "Khánh Linh",
  "anh/bao": "Bảo",
  "anh/kiet": "Kiệt",
  "lam": "Lâm",
  "ban/tho": "Thơ",
  "do-hung": "Hưng Đỗ",
  "bubu": "BuBu",
  "anh/meo": "Mèo",
  "ai-my": "Ái My",
  "tho-ngoc": "Thỏ Ngọc",
  "king": "King",

};

export function guestLinks(baseUrl: string): string[] {
  const base = baseUrl.replace(/\/+$/, "");
  return Object.entries(GUESTS).map(([path, name]) => {
    const parts = path.split("/");
    const label = parts.length === 2 ? `${HONORIFICS[parts[0]].label} ` : "";
    return `${label}${name}\t${base}/${path}`;
  });
}
