import { describe, it, expect } from "vitest";
import { existsSync, statSync, readFileSync } from "node:fs";
import path from "node:path";

const IMG = path.resolve(__dirname, "../public/img");
const KB = 1024;

const budgets: Record<string, number> = {
  "hero-800.webp": 150 * KB,
  "hero-1600.webp": 350 * KB,
  "campus-map.webp": 400 * KB,
  "og.jpg": 200 * KB,
  "hcmut-logo.webp": 30 * KB,
  "hcmut-campus-1600.webp": 300 * KB,
  "hcmut-campus-800.webp": 120 * KB,
};
for (let i = 1; i <= 5; i++) {
  budgets[`gallery-${i}-600.webp`] = 120 * KB;
  budgets[`gallery-${i}-1200.webp`] = Infinity;
}

describe("optimized images", () => {
  it("all optimized images exist", () => {
    const missing = Object.keys(budgets).filter((f) => !existsSync(path.join(IMG, f)));
    expect(missing).toEqual([]);
  });

  it("optimized images are small", () => {
    const over = Object.entries(budgets)
      .filter(([f, max]) => statSync(path.join(IMG, f)).size > max)
      .map(([f]) => f);
    expect(over).toEqual([]);
  });

  it("webp files have RIFF/WEBP magic", () => {
    for (const f of Object.keys(budgets).filter((f) => f.endsWith(".webp"))) {
      const b = readFileSync(path.join(IMG, f));
      expect(b.subarray(0, 4).toString("ascii"), f).toBe("RIFF");
      expect(b.subarray(8, 12).toString("ascii"), f).toBe("WEBP");
    }
  });
});
