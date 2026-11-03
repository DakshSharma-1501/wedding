import { useId } from 'react';
import { archPath } from '../../lib/arch';
import { cn } from '../../lib/cn';
import { createRng } from '../../lib/random';

const VW = 300;
const VH = 400;
const OUTER = archPath(VW, VH, { inset: 2, pointiness: 0.3 });
const DOTS = archPath(VW, VH, { inset: 7.5, pointiness: 0.3 });
const MID = archPath(VW, VH, { inset: 13, pointiness: 0.3 });
const OPENING = archPath(VW, VH, { inset: 20, pointiness: 0.3, lobes: 5 });

/** Stars, kadamba leaves/flowers and pond lotuses — deterministic so renders are pure. */
const ART = (() => {
  const rng = createRng(17);
  const stars = Array.from({ length: 34 }, () => ({
    x: 30 + rng() * 240,
    y: 40 + rng() * 210,
    r: 0.5 + rng() * 1.1,
    o: 0.35 + rng() * 0.5,
  }));
  const cluster = (cx: number, cy: number, dir: 1 | -1) =>
    Array.from({ length: 11 }, (_, i) => {
      const a = (-0.2 + (i / 10) * 1.3) * Math.PI * dir;
      const d = 14 + rng() * 26;
      return {
        x: cx + Math.cos(a) * d * dir,
        y: cy + Math.sin(a) * d * 0.7,
        rot: (a * 180) / Math.PI + rng() * 40,
        flower: i % 3 === 1,
      };
    });
  return { stars, leaves: [...cluster(48, 168, 1), ...cluster(252, 168, -1)] };
})();

interface PichwaiFrameProps {
  className?: string;
}

/**
 * Nathdwara pichwai panel: gold cusped arch over a night sky, a kadamba canopy (Krishna's
 * tree) and a lotus pond at the base. Arch lines carry [data-draw] for a scroll draw-in.
 */
export function PichwaiFrame({ className }: PichwaiFrameProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full overflow-visible',
        className,
      )}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0D3655" />
          <stop offset="0.65" stopColor="#082A44" />
          <stop offset="1" stopColor="#06364A" />
        </linearGradient>
        <linearGradient id={`${id}line`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3D677" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#A9821B" />
        </linearGradient>
        <linearGradient id={`${id}water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E5A6B" />
          <stop offset="1" stopColor="#073845" />
        </linearGradient>
        <radialGradient id={`${id}kad`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#FFE07A" />
          <stop offset="1" stopColor="#E08E0B" />
        </radialGradient>
        <clipPath id={`${id}clip`}>
          <path d={OPENING} />
        </clipPath>
      </defs>

      <g data-arch-fill>
        <path d={OPENING} fill={`url(#${id}sky)`} />
        <g clipPath={`url(#${id}clip)`}>
          {ART.stars.map((s) => (
            <circle
              key={`${s.x}-${s.y}`}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#F6E3A6"
              fillOpacity={s.o}
            />
          ))}
          {/* crescent moon */}
          <path
            d="M226,78 A16,16 0 1 0 244,104 A12,12 0 1 1 226,78 Z"
            fill="#F6E7B8"
            fillOpacity="0.85"
          />
          {ART.leaves.map((l) =>
            l.flower ? (
              <g key={`${l.x}-${l.y}`}>
                <circle cx={l.x} cy={l.y} r="5.2" fill={`url(#${id}kad)`} />
                <circle
                  cx={l.x}
                  cy={l.y}
                  r="5.2"
                  fill="none"
                  stroke="#FFF1C2"
                  strokeOpacity="0.5"
                  strokeWidth="0.6"
                  strokeDasharray="0.6 1.4"
                />
              </g>
            ) : (
              <ellipse
                key={`${l.x}-${l.y}`}
                cx={l.x}
                cy={l.y}
                rx="11"
                ry="4.2"
                transform={`rotate(${l.rot.toFixed(1)} ${l.x.toFixed(1)} ${l.y.toFixed(1)})`}
                fill="#1F7A52"
                stroke="#5FBF8C"
                strokeOpacity="0.45"
                strokeWidth="0.6"
              />
            ),
          )}
          {/* lotus pond */}
          <rect x="0" y="336" width={VW} height="70" fill={`url(#${id}water)`} />
          {[346, 356, 366, 376].map((y, i) => (
            <path
              key={y}
              d={`M20 ${y} Q 60 ${y - 3} 100 ${y} T 180 ${y} T 260 ${y} T 340 ${y}`}
              stroke="#5CC9BF"
              strokeOpacity={0.35 - i * 0.05}
              strokeWidth="0.8"
            />
          ))}
          {[
            [58, 352, 1],
            [242, 356, 1.1],
            [92, 372, 0.8],
            [214, 374, 0.75],
          ].map(([x = 0, y = 0, s = 1]) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${s})`}>
              <ellipse cx="0" cy="4" rx="17" ry="4.5" fill="#1B6B4A" />
              <path d="M0,4 C-10,2 -12,-8 -6,-14 C-2,-8 0,-2 0,4 Z" fill="#F4B6C2" />
              <path d="M0,4 C10,2 12,-8 6,-14 C2,-8 0,-2 0,4 Z" fill="#F4B6C2" />
              <path d="M0,4 C-4,-4 -3,-14 0,-19 C3,-14 4,-4 0,4 Z" fill="#FBD5DC" />
            </g>
          ))}
        </g>
      </g>

      <g stroke={`url(#${id}line)`} strokeLinejoin="round">
        <path data-draw pathLength={1} d={OUTER} strokeWidth="1.6" />
        <path
          data-arch-dots
          d={DOTS}
          stroke="#E2C25A"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="0 7"
        />
        <path data-draw pathLength={1} d={MID} strokeWidth="0.9" />
        <path data-draw pathLength={1} d={OPENING} strokeWidth="1.3" />
      </g>
      <g transform={`translate(${VW / 2} 2)`}>
        <path
          d="M0,-24 C5,-17 6,-10 0,-4 C-6,-10 -5,-17 0,-24 Z"
          fill="#E8D5A3"
          stroke="#B08A22"
          strokeWidth="0.9"
        />
        <path d="M-9,-2 C-6,-8 6,-8 9,-2 Z" fill="#D4AF37" />
      </g>
    </svg>
  );
}
