import { memo, useId } from 'react';

/**
 * Envelope paper pieces as SVG drawn at the exact pixel size (viewBox = w×h), so the
 * tiled emboss and liner patterns are never stretched on any screen shape.
 */

const GINKGO = 'M0,9 L-12.5,-4.5 Q-7,-11.5 -0.9,-8.4 L0,-6.2 L0.9,-8.4 Q7,-11.5 12.5,-4.5 Z';
const GINKGO_VEINS = 'M0,9 L0,16 M0,9 L-7.5,-8.6 M0,9 L-3.5,-9 M0,9 L3.5,-9 M0,9 L7.5,-8.6';

function GinkgoPattern({ id }: { id: string }) {
  const leaf = (x: number, y: number, r: number, s: number) => (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d={GINKGO} transform="translate(0.8 0.9)" fill="#7A5C2E" fillOpacity="0.07" />
      <path d={GINKGO} transform="translate(-0.6 -0.6)" fill="#FFFFFF" fillOpacity="0.5" />
      <path d={GINKGO} fill="#F3EAD8" fillOpacity="0.55" />
      <path d={GINKGO_VEINS} fill="none" stroke="#A88A55" strokeOpacity="0.16" strokeWidth="0.6" />
    </g>
  );
  return (
    <pattern id={id} width="96" height="96" patternUnits="userSpaceOnUse">
      {leaf(22, 24, -24, 0.85)}
      {leaf(70, 66, 150, 0.75)}
      {leaf(74, 20, 62, 0.5)}
      {leaf(20, 74, -118, 0.55)}
    </pattern>
  );
}

/** Peacock-blue liner with a gold ogee (onion) lattice. */
export function LinerPattern({ id }: { id: string }) {
  return (
    <pattern id={id} width="36" height="48" patternUnits="userSpaceOnUse">
      <rect width="36" height="48" fill="#0B3C5D" />
      <path
        d="M0,24 C9,24 9,0 18,0 C27,0 27,24 36,24 M0,24 C9,24 9,48 18,48 C27,48 27,24 36,24"
        fill="none"
        stroke="#C9A227"
        strokeOpacity="0.7"
        strokeWidth="0.8"
      />
      <circle
        cx="18"
        cy="24"
        r="2.2"
        fill="#0E7C7B"
        stroke="#C9A227"
        strokeOpacity="0.8"
        strokeWidth="0.6"
      />
      <circle cx="0" cy="0" r="1.2" fill="#E8D5A3" fillOpacity="0.8" />
      <circle cx="36" cy="0" r="1.2" fill="#E8D5A3" fillOpacity="0.8" />
      <circle cx="0" cy="48" r="1.2" fill="#E8D5A3" fillOpacity="0.8" />
      <circle cx="36" cy="48" r="1.2" fill="#E8D5A3" fillOpacity="0.8" />
    </pattern>
  );
}

interface SizeProps {
  w: number;
  h: number;
}

export const EnvelopeBack = memo(function EnvelopeBack({ w, h }: SizeProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="absolute inset-0"
      aria-hidden="true"
    >
      <defs>
        <LinerPattern id={`${id}liner`} />
        <linearGradient id={`${id}depth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020F1A" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#020F1A" stopOpacity="0.1" />
          <stop offset="1" stopColor="#020F1A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={w} height={h} rx="6" fill="#EFE5D2" />
      <rect x="4" y="4" width={w - 8} height={h - 8} rx="4" fill={`url(#${id}liner)`} />
      <rect x="4" y="4" width={w - 8} height={h - 8} rx="4" fill={`url(#${id}depth)`} />
    </svg>
  );
});

export const EnvelopePocket = memo(function EnvelopePocket({
  w,
  h,
  flapH,
}: SizeProps & { flapH: number }) {
  const id = useId().replace(/:/g, '');
  // Tips sit just above the flap tip so the closed flap fully hides the opening.
  const sideTip = flapH * 0.96;
  const bottomTip = flapH * 0.9;
  const left = `M0,0 L${w * 0.5},${sideTip} L0,${h} Z`;
  const right = `M${w},0 L${w * 0.5},${sideTip} L${w},${h} Z`;
  const bottom = `M0,${h} Q${w * 0.06},${h * 0.9} ${w * 0.44},${bottomTip + h * 0.02} Q${w * 0.5},${bottomTip - h * 0.012} ${w * 0.56},${bottomTip + h * 0.02} Q${w * 0.94},${h * 0.9} ${w},${h} Z`;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="absolute inset-0 overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <GinkgoPattern id={`${id}g`} />
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F4ECDC" />
          <stop offset="1" stopColor="#E7DAC1" />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#F4ECDC" />
          <stop offset="1" stopColor="#E7DAC1" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBF6EC" />
          <stop offset="1" stopColor="#F1E7D4" />
        </linearGradient>
        <linearGradient id={`${id}edge`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B08A22" />
          <stop offset="0.5" stopColor="#E8C866" />
          <stop offset="1" stopColor="#B08A22" />
        </linearGradient>
      </defs>
      <path d={left} fill={`url(#${id}l)`} />
      <path d={right} fill={`url(#${id}r)`} />
      <path d={left} fill={`url(#${id}g)`} />
      <path d={right} fill={`url(#${id}g)`} />
      {/* soft shadow the bottom flap casts on the sides */}
      <path d={bottom} fill="#6B4E1C" fillOpacity="0.12" transform="translate(0 -3)" />
      <path d={bottom} fill={`url(#${id}b)`} />
      <path d={bottom} fill={`url(#${id}g)`} />
      <path
        d={`M0,${h} Q${w * 0.06},${h * 0.9} ${w * 0.44},${bottomTip + h * 0.02} Q${w * 0.5},${bottomTip - h * 0.012} ${w * 0.56},${bottomTip + h * 0.02} Q${w * 0.94},${h * 0.9} ${w},${h}`}
        fill="none"
        stroke={`url(#${id}edge)`}
        strokeWidth="1.2"
      />
      <path
        d={`M${w * 0.18},${h * 0.83} Q${w * 0.5},${bottomTip + h * 0.12} ${w * 0.82},${h * 0.83}`}
        fill="none"
        stroke="#C9A227"
        strokeOpacity="0.45"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="0 6"
      />
      {/* sides + bottom only: a top edge here would cross the card as it slides out */}
      <path
        d={`M0.5,0.5 V${h - 0.5} H${w - 0.5} V0.5`}
        fill="none"
        stroke="#C9A227"
        strokeOpacity="0.35"
      />
    </svg>
  );
});

interface FlapProps extends SizeProps {
  side: 'front' | 'back';
}

/** One face of the top flap. `h` is the flap height, not the envelope height. */
export const FlapFace = memo(function FlapFace({ w, h, side }: FlapProps) {
  const id = useId().replace(/:/g, '');
  const d = `M0,0 L${w},0 L${w * 0.535},${h - 6} Q${w * 0.5},${h + 2} ${w * 0.465},${h - 6} Z`;
  if (side === 'back') {
    return (
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="absolute inset-0 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <LinerPattern id={`${id}liner`} />
        </defs>
        <path d={d} fill="#EFE5D2" />
        <path
          d={d}
          fill={`url(#${id}liner)`}
          transform={`translate(${w * 0.025} ${h * 0.03}) scale(0.95)`}
        />
      </svg>
    );
  }
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="absolute inset-0 overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <GinkgoPattern id={`${id}g`} />
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2E9D7" />
          <stop offset="1" stopColor="#FBF6EC" />
        </linearGradient>
        <linearGradient id={`${id}edge`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B08A22" />
          <stop offset="0.5" stopColor="#E8C866" />
          <stop offset="1" stopColor="#B08A22" />
        </linearGradient>
      </defs>
      <path d={d} fill="#5A3F12" fillOpacity="0.1" transform="translate(0 5)" />
      <path d={d} fill="#5A3F12" fillOpacity="0.08" transform="translate(0 2.5)" />
      <path d={d} fill={`url(#${id}p)`} />
      <path d={d} fill={`url(#${id}g)`} />
      <path
        d={`M0,0 L${w * 0.465},${h - 6} Q${w * 0.5},${h + 2} ${w * 0.535},${h - 6} L${w},0`}
        fill="none"
        stroke="#C9A227"
        strokeOpacity="0.55"
        strokeWidth="1.1"
      />
    </svg>
  );
});
