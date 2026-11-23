export type Honorific = { label: string; self: string };

/** URL key -> how the guest is addressed, and how the host refers to himself. */
export const HONORIFICS: Record<string, Honorific> = {
  ban: { label: "Bạn", self: "Nhã" },
  anh: { label: "Anh", self: "em Nhã" },
  chi: { label: "Chị", self: "em Nhã" },
  em: { label: "Em", self: "anh Nhã" },
  thay: { label: "Thầy", self: "em" },
  co: { label: "Cô", self: "em" },
};
