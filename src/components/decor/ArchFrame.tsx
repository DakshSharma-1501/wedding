import { useId } from 'react';
import { archPath } from '../../lib/arch';
import { cn } from '../../lib/cn';

const VW = 300;
const VH = 380;

/** Precomputed once — the geometry never changes. */
const OUTER = archPath(VW, VH, { inset: 2, pointiness: 0.34 });
const DOTS = archPath(VW, VH, { inset: 7, pointiness: 0.34 });
const MID = archPath(VW, VH, { inset: 12, pointiness: 0.34 });
const OPENING = archPath(VW, VH, { inset: 20, pointiness: 0.34, lobes: 4 });

interface ArchFrameProps {
  className?: string;
}

/**
 * Gold-line jharokha arch with a cusped opening and a warm inner glow.
 * Lines carry `data-draw` + pathLength=1 so scenes can "draw" them in.
 */
export function ArchFrame({ className }: ArchFrameProps) {
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
        <radialGradient id={`${id}glow`} cx="50%" cy="36%" r="70%">
          <stop offset="0" stopColor="#FFF9E8" />
          <stop offset="0.45" stopColor="#F8ECCB" />
          <stop offset="1" stopColor="#EEDDB4" />
        </radialGradient>
        <pattern id={`${id}dots`} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.8" fill="#C9A227" fillOpacity="0.35" />
          <circle cx="9" cy="9" r="0.6" fill="#0E7C7B" fillOpacity="0.18" />
        </pattern>
        <linearGradient id={`${id}line`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9B54A" />
          <stop offset="0.5" stopColor="#B08A22" />
          <stop offset="1" stopColor="#8C6A12" />
        </linearGradient>
      </defs>

      <g data-arch-fill>
        <path d={OPENING} fill={`url(#${id}glow)`} />
        <path d={OPENING} fill={`url(#${id}dots)`} />
      </g>

      <g stroke={`url(#${id}line)`} strokeLinejoin="round">
        <path data-draw pathLength={1} d={OUTER} strokeWidth="1.4" />
        <path
          data-arch-dots
          d={DOTS}
          stroke="#C9A227"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="0 7"
        />
        <path data-draw pathLength={1} d={MID} strokeWidth="0.8" />
        <path data-draw pathLength={1} d={OPENING} strokeWidth="1.2" />
      </g>

      {/* apex finial: lotus bud on a little kalash */}
      <g data-arch-finial transform={`translate(${VW / 2} 2)`}>
        <path
          d="M0,-24 C5,-17 6,-10 0,-4 C-6,-10 -5,-17 0,-24 Z"
          fill="#E8D5A3"
          stroke="#8C6A12"
          strokeWidth="0.9"
        />
        <path d="M-9,-2 C-6,-8 6,-8 9,-2 Z" fill="#C9A227" />
        <circle cx="0" cy="-27" r="1.8" fill="#C9A227" />
      </g>

      {/* plinth */}
      <path
        data-draw
        pathLength={1}
        d={`M-6 ${VH + 2} H${VW + 6}`}
        stroke="#B08A22"
        strokeWidth="1.2"
      />
      <path
        data-draw
        pathLength={1}
        d={`M4 ${VH + 7} H${VW - 4}`}
        stroke="#C9A227"
        strokeWidth="0.7"
      />
      <path
        data-arch-dots
        d={`M10 ${VH + 11.5} H${VW - 10}`}
        stroke="#C9A227"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="0 8"
      />
    </svg>
  );
}
