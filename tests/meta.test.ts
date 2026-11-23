import { describe, it, expect } from "vitest";
import { OG_IMAGE, recipientMetadata } from "@/lib/meta";
import { resolveRecipient, resolveSegment } from "@/lib/recipient";

describe("recipientMetadata", () => {
  it("keeps the preview image when overriding the title for a guest", () => {
    const m = recipientMetadata(resolveRecipient("ban", "thinh"));
    expect(m.title).toBe("Thân mời Bạn Thịnh · Thiệp tốt nghiệp Hồ Thanh Nhã");
    expect(m.openGraph?.title).toBe(m.title);
    expect(m.openGraph?.images).toEqual([OG_IMAGE]);
  });
  it("addresses the guest correctly in the preview description", () => {
    const m = recipientMetadata(resolveRecipient("thay", "Hùng"));
    expect(m.title).toBe("Kính mời Thầy Hùng · Thiệp tốt nghiệp Hồ Thanh Nhã");
    expect(m.description).toContain("Thầy");
    expect(m.description).not.toMatch(/\bbạn\b/);
    expect(m.openGraph?.description).toBe(m.description);
  });
  it("titles a no-honorific guest by name", () => {
    expect(recipientMetadata(resolveSegment("ai-my")).title).toBe("Thân mời Ái My · Thiệp tốt nghiệp Hồ Thanh Nhã");
  });
  it("returns no overrides without a recipient", () => {
    expect(recipientMetadata(null)).toEqual({});
  });
});
