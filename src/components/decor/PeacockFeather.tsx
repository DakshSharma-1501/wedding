import { useId } from 'react';
import { cn } from '../../lib/cn';

const H = 420;

/** Rachis (quill) centre-line: a gentle S-curve from the base up to the eye. */
function rachisX(y: number): number {
  const t = 1 - y / H;
  return 60 + Math.sin(t * Math.PI * 1.1) * 5 - t * 3;
}

/** Fine barbs fanning off the quill, denser and longer around the eye. Pure → computed once. */
const BARBS = (() => {
  const lines: string[] = [];
  for (let y = 46; y < H - 30; y += 3.2) {
    const t = 1 - y / H;
    const x = rachisX(y);
    const reach =
      y < 210 ? 46 * Math.sin(((y - 30) / 190) * Math.PI) + 10 : 26 * (1 - (y - 210) / 190) + 6;
    for (const dir of [-1, 1]) {
      const ex = x + dir * reach;
      const ey = y - reach * (0.55 + t * 0.25);
      const cx = x + dir * reach * 0.55;
      const cy = y - reach * 0.08;
      lines.push(
        `M${x.toFixed(1)},${y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`,
      );
    }
  }
  return lines.join(' ');
})();

const RACHIS = (() => {
  let d = '';
  for (let y = H; y >= 30; y -= 6) d += `${d ? ' L' : 'M'}${rachisX(y).toFixed(1)},${y}`;
  return d;
})();

interface PeacockFeatherProps {
  className?: string;
  /** Pre-blur (SVG units) for depth-of-field foreground feathers. Rasterised once, so
   *  moving the feather afterwards stays a cheap compositor transform. */
  blur?: number;
}

/** Stylised peacock feather: gold-green barbs and the iridescent eye (ocellus). */
export function PeacockFeather({ className, blur = 0 }: PeacockFeatherProps) {
  const id = useId().replace(/:/g, '');
  const eyeX = rachisX(100);
  return (
    <svg
      viewBox={`0 0 120 ${H}`}
      className={cn('overflow-visible', className)}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id={`${id}barb`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B6B4A" stopOpacity="0.9" />
          <stop offset="0.45" stopColor="#8C8A2E" stopOpacity="0.75" />
          <stop offset="1" stopColor="#C9A227" stopOpacity="0.25" />
        </linearGradient>
        {blur > 0 && (
          <filter id={`${id}blur`} x="-30%" y="-10%" width="160%" height="120%">
            <feGaussianBlur stdDeviation={blur} />
          </filter>
        )}
        <radialGradient id={`${id}halo`}>
          <stop offset="0.55" stopColor="#C9A227" stopOpacity="0.55" />
          <stop offset="1" stopColor="#C9A227" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g filter={blur > 0 ? `url(#${id}blur)` : undefined}>
        <path d={BARBS} stroke={`url(#${id}barb)`} strokeWidth="0.55" strokeLinecap="round" />
        <path d={RACHIS} stroke="#9C7A16" strokeWidth="1.6" strokeLinecap="round" />
        <g transform={`translate(${eyeX.toFixed(1)} 100)`}>
          <ellipse rx="38" ry="46" fill={`url(#${id}halo)`} />
          <ellipse rx="27" ry="34" fill="#B8922A" />
          <ellipse rx="22" ry="28" cy="2" fill="#2F8A5B" />
          <ellipse rx="17" ry="22" cy="4" fill="#0E7C7B" />
          <path
            d="M0,-10 C9,-14 14,-2 10,8 C7,15 3,20 0,22 C-3,20 -7,15 -10,8 C-14,-2 -9,-14 0,-10 Z"
            fill="#0B3C5D"
          />
          <ellipse rx="3.2" ry="4.6" cx="-3.5" cy="-1" fill="#5CC9BF" fillOpacity="0.55" />
        </g>
      </g>
    </svg>
  );
}
