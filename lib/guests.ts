import { HONORIFICS } from "./honorifics";

/**
 * Danh sách khách: "<xưng-hô>/<slug-không-dấu>" -> tên hiển thị có dấu.
 * Link: /ban/thinh  ->  "Thân mời Bạn Thịnh"
 */
export const GUESTS: Record<string, string> = {
  "ban/thinh": "Thịnh",
  "anh/tuan": "Tuấn",
  "thay/hung": "Hùng",
};

export function guestLinks(baseUrl: string): string[] {
  const base = baseUrl.replace(/\/+$/, "");
  return Object.entries(GUESTS).map(([path, name]) => {
    const key = path.split("/")[0];
    return `${HONORIFICS[key].label} ${name}\t${base}/${path}`;
  });
}
