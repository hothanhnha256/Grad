import { describe, it, expect } from "vitest";
import { OG_IMAGE, recipientMetadata } from "@/lib/meta";
import { resolveRecipient } from "@/lib/recipient";

describe("recipientMetadata", () => {
  it("keeps the preview image when overriding the title for a guest", () => {
    const m = recipientMetadata(resolveRecipient("ban", "thinh"));
    expect(m.title).toBe("Thân mời Bạn Thịnh · Thiệp tốt nghiệp Hồ Thanh Nhã");
    expect(m.openGraph?.title).toBe(m.title);
    expect(m.openGraph?.images).toEqual([OG_IMAGE]);
  });
  it("returns no overrides without a recipient", () => {
    expect(recipientMetadata(null)).toEqual({});
  });
});
