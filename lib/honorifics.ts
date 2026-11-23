export type Honorific = {
  /** How the guest is named in the greeting: "Bạn", "Thầy"… */
  label: string;
  /** How the host refers to himself: "Nhã", "em Nhã"… */
  self: string;
  /** Second-person address inside sentences: "bạn", "anh", "Thầy"… */
  you: string;
  /** Opening verb: "Thân mời" for peers, "Kính mời" for teachers. */
  invite: string;
};

export const HONORIFICS: Record<string, Honorific> = {
  ban: { label: "Bạn", self: "Nhã", you: "bạn", invite: "Thân mời" },
  anh: { label: "Anh", self: "em Nhã", you: "anh", invite: "Thân mời" },
  chi: { label: "Chị", self: "em Nhã", you: "chị", invite: "Thân mời" },
  em: { label: "Em", self: "anh Nhã", you: "em", invite: "Thân mời" },
  thay: { label: "Thầy", self: "em", you: "Thầy", invite: "Kính mời" },
  co: { label: "Cô", self: "em", you: "Cô", invite: "Kính mời" },
};
