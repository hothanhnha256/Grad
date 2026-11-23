// Ambient stars & caps drifting down behind the page. Fixed values (no
// Math.random during render) so server and client markup match.
const ITEMS = [
  { c: "✦", l: 4, s: 18, d: 0, t: 21 },
  { c: "✧", l: 15, s: 20, d: 7, t: 25 },
  { c: "⋆", l: 27, s: 16, d: 12, t: 23 },
  { c: "✦", l: 39, s: 14, d: 3, t: 22 },
  { c: "✦", l: 52, s: 15, d: 15, t: 26 },
  { c: "✧", l: 64, s: 18, d: 9, t: 24 },
  { c: "⋆", l: 75, s: 17, d: 1, t: 27 },
  { c: "✦", l: 86, s: 13, d: 17, t: 21 },
  { c: "✦", l: 95, s: 16, d: 5, t: 25 },
];

export function Drift() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {ITEMS.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 text-sun opacity-40"
          style={{
            left: `${p.l}%`,
            fontSize: p.s,
            animation: `drift ${p.t}s linear ${p.d}s infinite`,
            transform: "translate3d(0,-10vh,0)",
            ["--dx" as string]: `${i % 2 ? 60 : -60}px`,
            ["--rot" as string]: `${i % 2 ? 300 : -300}deg`,
          }}
        >
          {p.c}
        </span>
      ))}
    </div>
  );
}
