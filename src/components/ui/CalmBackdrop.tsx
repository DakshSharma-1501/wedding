/**
 * Static stand-in for the WebGL layer — used with prefers-reduced-motion or when WebGL is
 * unavailable. Soft champagne light pools and a few still gold glints; no animation.
 */
const GLINTS = [
  { x: 12, y: 18, s: 10 },
  { x: 84, y: 26, s: 12 },
  { x: 22, y: 64, s: 8 },
  { x: 76, y: 72, s: 10 },
  { x: 50, y: 88, s: 7 },
  { x: 91, y: 52, s: 6 },
  { x: 6, y: 40, s: 7 },
];

export function CalmBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[100lvh] bg-[radial-gradient(ellipse_45%_35%_at_15%_20%,rgb(232_213_163/0.35),transparent),radial-gradient(ellipse_40%_30%_at_85%_75%,rgb(14_124_123/0.08),transparent)]"
    >
      {GLINTS.map((g) => (
        <svg
          key={`${g.x}-${g.y}`}
          viewBox="-10 -10 20 20"
          className="absolute opacity-60"
          style={{ left: `${g.x}%`, top: `${g.y}%`, width: g.s, height: g.s }}
        >
          <path
            d="M0,-10 C1,-2 2,-1 10,0 C2,1 1,2 0,10 C-1,2 -2,1 -10,0 C-2,-1 -1,-2 0,-10 Z"
            fill="#C9A227"
          />
        </svg>
      ))}
    </div>
  );
}
