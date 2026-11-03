import { memo, useId } from 'react';
import { createRng } from '../../lib/random';
import { useExperience } from '../../store/experience';

/* Irregular wax blob — deterministic so it never changes between renders. */
const BLOB = (() => {
  const rng = createRng(11);
  const n = 28;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = 50 + rng() * 4.2 + (i % 4 === 0 ? 2.2 : 0);
    return [Math.cos(a) * r, Math.sin(a) * r] as const;
  });
  const at = (i: number): readonly [number, number] => pts[(i + n) % n] ?? [0, 0];
  const mid = (p: readonly [number, number], q: readonly [number, number]) =>
    `${((p[0] + q[0]) / 2).toFixed(2)},${((p[1] + q[1]) / 2).toFixed(2)}`;
  let d = `M${mid(at(n - 1), at(0))}`;
  for (let i = 0; i < n; i++) {
    const p = at(i);
    d += ` Q${p[0].toFixed(2)},${p[1].toFixed(2)} ${mid(p, at(i + 1))}`;
  }
  return `${d} Z`;
})();

const CRACK = [
  [2, -58],
  [-3, -40],
  [4, -25],
  [-2, -10],
  [5, 4],
  [-4, 19],
  [3, 34],
  [-2, 58],
] as const;
const CRACK_D = CRACK.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
const LEFT_CLIP = `M-80,-80 L2,-80 ${CRACK.map(([x, y]) => `L${x},${y}`).join(' ')} L-2,80 L-80,80 Z`;
const RIGHT_CLIP = `M80,-80 L2,-80 ${CRACK.map(([x, y]) => `L${x},${y}`).join(' ')} L-2,80 L80,80 Z`;

interface WaxSealProps {
  bride: string;
  groom: string;
  /** Hides the preload ring once loading is done. */
  ready: boolean;
}

/** Only this arc re-renders as preload progress ticks — not the whole seal. */
function ProgressArc() {
  const progress = useExperience((s) => s.loadProgress);
  return (
    <circle
      r="64"
      fill="none"
      stroke="#B08A22"
      strokeWidth="2.2"
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray="1"
      strokeDashoffset={1 - progress}
      transform="rotate(-90)"
      style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
    />
  );
}

function SealBody({ id, bride, groom }: { id: string; bride: string; groom: string }) {
  return (
    <>
      <path d={BLOB} fill={`url(#${id}wax)`} />
      <path d={BLOB} fill="none" stroke={`url(#${id}rim)`} strokeWidth="2.2" />
      <circle r="40.5" fill={`url(#${id}well)`} />
      <circle r="40.5" fill="none" stroke="#5E450B" strokeOpacity="0.55" strokeWidth="1.3" />
      <circle r="41.6" fill="none" stroke="#FBE7A6" strokeOpacity="0.6" strokeWidth="0.7" />
      <circle
        r="45.2"
        fill="none"
        stroke="#6B4E0C"
        strokeOpacity="0.55"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="0 5.4"
      />
      <g
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontStyle="italic"
        fontWeight={500}
        textAnchor="middle"
      >
        <text
          y="11.5"
          fontSize="33"
          fill="#FBE7A6"
          fillOpacity="0.5"
          transform="translate(0.7 0.9)"
        >
          {bride}
          <tspan fontSize="21" dy="-3">
            &amp;
          </tspan>
          <tspan dy="3">{groom}</tspan>
        </text>
        <text y="11.5" fontSize="33" fill="#5E450B">
          {bride}
          <tspan fontSize="21" dy="-3">
            &amp;
          </tspan>
          <tspan dy="3">{groom}</tspan>
        </text>
      </g>
      <path
        d="M-14,24 C-8,22 -3,24 0,28 C3,24 8,22 14,24 M-9,21.5 C-7,19 -4,19 -3,21 M9,21.5 C7,19 4,19 3,21"
        fill="none"
        stroke="#5E450B"
        strokeOpacity="0.7"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="M0,-30 L2.2,-26 L0,-22 L-2.2,-26 Z" fill="#5E450B" fillOpacity="0.65" />
      <g clipPath={`url(#${id}blob)`}>
        <rect data-seal-shine x="-140" y="-70" width="70" height="140" fill={`url(#${id}shine)`} />
      </g>
    </>
  );
}

/** Gold wax seal with debossed monogram; splits into two halves along a jagged crack. */
export const WaxSeal = memo(function WaxSeal({ bride, groom, ready }: WaxSealProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="-72 -72 144 144" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}wax`} cx="38%" cy="32%" r="78%">
          <stop offset="0" stopColor="#F2D677" />
          <stop offset="0.35" stopColor="#D8B03E" />
          <stop offset="0.72" stopColor="#A9821B" />
          <stop offset="1" stopColor="#6E510D" />
        </radialGradient>
        <radialGradient id={`${id}well`} cx="60%" cy="66%" r="70%">
          <stop offset="0" stopColor="#E7C258" />
          <stop offset="0.7" stopColor="#C29A2C" />
          <stop offset="1" stopColor="#9C7718" />
        </radialGradient>
        <linearGradient id={`${id}rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF0B8" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#C9A227" stopOpacity="0.2" />
          <stop offset="1" stopColor="#4A3508" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id={`${id}shine`}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientTransform="rotate(18)"
        >
          <stop offset="0" stopColor="#FFF8DC" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFF8DC" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFF8DC" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}shadow`}>
          <stop offset="0.6" stopColor="#3A2A06" stopOpacity="0.35" />
          <stop offset="1" stopColor="#3A2A06" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}blob`}>
          <path d={BLOB} />
        </clipPath>
        <clipPath id={`${id}l`}>
          <path d={LEFT_CLIP} />
        </clipPath>
        <clipPath id={`${id}r`}>
          <path d={RIGHT_CLIP} />
        </clipPath>
      </defs>

      <ellipse data-seal-shadow cx="3" cy="7" rx="60" ry="58" fill={`url(#${id}shadow)`} />

      <g data-seal-ring style={{ opacity: ready ? 0 : 1, transition: 'opacity 0.8s ease' }}>
        <circle r="64" fill="none" stroke="#E8D5A3" strokeWidth="1.2" />
        <ProgressArc />
      </g>

      <g data-seal-half="left">
        <g clipPath={`url(#${id}l)`}>
          <SealBody id={id} bride={bride} groom={groom} />
        </g>
      </g>
      <g data-seal-half="right">
        <g clipPath={`url(#${id}r)`}>
          <SealBody id={id} bride={bride} groom={groom} />
        </g>
      </g>
      <path
        data-seal-crack
        d={CRACK_D}
        fill="none"
        stroke="#3E2C06"
        strokeWidth="1.4"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="1"
      />
    </svg>
  );
});
