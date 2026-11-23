import { describe, it, expect } from "vitest";
import { HONORIFICS, slugify, normalizeName, resolveRecipient, resolveSegment, greetingFor } from "@/lib/recipient";
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
      key: "anh", label: "Anh", name: "Tuấn", self: "em Nhã", you: "anh", invite: "Thân mời",
    });
  });
  it("normalizes a messy name", () => {
    expect(resolveRecipient("ban", "  th%E1%BB%8Bnh ")?.name).toBe("Thịnh");
  });
  it("keeps an already-decoded name containing %", () => {
    expect(resolveRecipient("ban", "100%")?.name).toBe("100%");
  });
  it("does not throw on malformed percent-encoding", () => {
    expect(resolveRecipient("ban", "%E0%A4%A")?.name).toBe("");
  });
  it("returns null for an unknown honorific", () => {
    expect(resolveRecipient("sep", "A")).toBeNull();
    expect(resolveRecipient(undefined, undefined)).toBeNull();
    expect(resolveRecipient(undefined, "   ")).toBeNull();
  });
  it("accepts the honorific label as well as the key", () => {
    expect(resolveRecipient("Thầy")?.key).toBe("thay");
  });
});

describe("guests without an honorific", () => {
  it("resolves a bare guest slug from the list", () => {
    expect(resolveSegment("khanh-linh")).toEqual({
      key: "", label: "", name: "Khánh Linh", self: "Nhã", you: "Khánh Linh", invite: "Thân mời",
    });
  });
  it("greets and addresses them by name", () => {
    expect(greetingFor(resolveSegment("king"))).toEqual({ greeting: "Thân mời King", self: "Nhã", you: "King" });
  });
  it("still treats a bare honorific segment as honorific-only", () => {
    expect(greetingFor(resolveSegment("thay")).greeting).toBe("Kính mời Thầy");
  });
  it("returns null for an unknown single segment", () => {
    expect(resolveSegment("khong-co-ai")).toBeNull();
  });
  it("supports ?t=Name without an honorific", () => {
    expect(greetingFor(resolveRecipient(undefined, "%C3%81i%20My"))).toEqual({ greeting: "Thân mời Ái My", self: "Nhã", you: "Ái My" });
  });
});

describe("greetingFor", () => {
  it("uses 'Kính mời' and respectful address for teachers", () => {
    expect(greetingFor(resolveRecipient("thay"))).toEqual({ greeting: "Kính mời Thầy", self: "em", you: "Thầy" });
    expect(greetingFor(resolveRecipient("co", "Lan")).greeting).toBe("Kính mời Cô Lan");
  });
  it("addresses older guests as anh/chị, not bạn", () => {
    expect(greetingFor(resolveRecipient("anh", "Tuấn")).you).toBe("anh");
    expect(greetingFor(resolveRecipient("chi")).you).toBe("chị");
    expect(greetingFor(resolveRecipient("em")).you).toBe("em");
  });
  it("greets with honorific and name", () => {
    expect(greetingFor(resolveRecipient("ban", "Thịnh")).greeting).toBe("Thân mời Bạn Thịnh");
  });
  it("falls back to the default greeting", () => {
    expect(greetingFor(null)).toEqual({ greeting: "Trân trọng kính mời bạn", self: "Nhã", you: "bạn" });
  });
});

describe("GUESTS", () => {
  it("every entry is 'honorific/slug' or a bare slug, with a non-empty name", () => {
    for (const [path, name] of Object.entries(GUESTS)) {
      const parts = path.split("/");
      const slug = parts.at(-1)!;
      if (parts.length === 2) expect(HONORIFICS[parts[0]], path).toBeDefined();
      else {
        expect(parts, path).toHaveLength(1);
        expect(HONORIFICS[slug], `${path} collides with an honorific`).toBeUndefined();
      }
      expect(slug, path).toBe(slugify(slug));
      expect(name.trim(), path).not.toBe("");
    }
  });
  it("guestLinks lists one tab-separated line per guest", () => {
    const lines = guestLinks("https://x.vercel.app");
    expect(lines).toHaveLength(Object.keys(GUESTS).length);
    expect(lines).toContain("Bạn Thịnh\thttps://x.vercel.app/ban/thinh");
    expect(lines).toContain("Khánh Linh\thttps://x.vercel.app/khanh-linh");
  });
});
