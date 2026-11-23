import { describe, it, expect } from "vitest";
import { HONORIFICS, slugify, normalizeName, resolveRecipient, greetingFor } from "@/lib/recipient";
import { GUESTS, guestLinks } from "@/lib/guests";

describe("slugify", () => {
  it("strips Vietnamese diacritics and đ", () => {
    expect(slugify("Thịnh")).toBe("thinh");
    expect(slugify("Đức Anh")).toBe("duc-anh");
    expect(slugify("  Nguyễn  Văn  A ")).toBe("nguyen-van-a");
  });
});

describe("normalizeName", () => {
  it("trims, collapses spaces and capitalizes words", () => {
    expect(normalizeName("  thịnh   nguyễn ")).toBe("Thịnh Nguyễn");
  });
  it("caps length at 40 characters", () => {
    expect(normalizeName("a".repeat(60))).toHaveLength(40);
  });
});

describe("resolveRecipient", () => {
  it("looks up the pretty name from the guest list", () => {
    expect(resolveRecipient("ban", "thinh")?.name).toBe("Thịnh");
  });
  it("decodes a URL-encoded name and applies honorific rules", () => {
    expect(resolveRecipient("anh", "Tu%E1%BA%A5n")).toEqual({
      key: "anh", label: "Anh", name: "Tuấn", self: "em Nhã",
    });
  });
  it("normalizes a messy name", () => {
    expect(resolveRecipient("ban", "  th%E1%BB%8Bnh ")?.name).toBe("Thịnh");
  });
  it("does not throw on malformed percent-encoding", () => {
    expect(resolveRecipient("ban", "%E0%A4%A")?.name).toBe("");
  });
  it("returns null for an unknown honorific", () => {
    expect(resolveRecipient("sep", "A")).toBeNull();
    expect(resolveRecipient(undefined, "A")).toBeNull();
  });
  it("accepts the honorific label as well as the key", () => {
    expect(resolveRecipient("Thầy")?.key).toBe("thay");
  });
});

describe("greetingFor", () => {
  it("greets with honorific only when no name", () => {
    expect(greetingFor(resolveRecipient("thay"))).toEqual({ greeting: "Thân mời Thầy", self: "em" });
  });
  it("greets with honorific and name", () => {
    expect(greetingFor(resolveRecipient("ban", "Thịnh")).greeting).toBe("Thân mời Bạn Thịnh");
  });
  it("falls back to the default greeting", () => {
    expect(greetingFor(null)).toEqual({ greeting: "Trân trọng kính mời bạn", self: "Nhã" });
  });
});

describe("GUESTS", () => {
  it("every entry has a valid honorific and a non-empty name", () => {
    for (const [path, name] of Object.entries(GUESTS)) {
      const [key, slug] = path.split("/");
      expect(HONORIFICS[key], path).toBeDefined();
      expect(slug, path).toBe(slugify(slug));
      expect(name.trim(), path).not.toBe("");
    }
  });
  it("guestLinks lists one tab-separated line per guest", () => {
    const lines = guestLinks("https://x.vercel.app");
    expect(lines).toHaveLength(Object.keys(GUESTS).length);
    expect(lines).toContain("Bạn Thịnh\thttps://x.vercel.app/ban/thinh");
  });
});
