import { useId } from 'react';
import { cn } from '../../lib/cn';

/**
 * Props for the Saat Phere scene. Every looping animation sits on an HTML-level element
 * (flames, glow, bells) so it runs on the compositor.
 */

const FLAMES = [
  { left: 30, width: 26, height: 62, delay: 0, dur: 1.6 },
  { left: 52, width: 24, height: 58, delay: 0.4, dur: 1.9 },
  { left: 39, width: 34, height: 86, delay: 0.2, dur: 1.4 },
  { left: 24, width: 18, height: 40, delay: 0.9, dur: 2.1 },
  { left: 62, width: 16, height: 38, delay: 0.6, dur: 1.7 },
];

/** Havan kund (fire altar) with layered flickering flames and a pulsing glow. */
export function AgniKund({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <div className={cn('relative', className)} aria-hidden="true">
      <div className="diya-glow absolute inset-x-[-60%] top-[-140%] bottom-[-40%] rounded-full bg-[radial-gradient(closest-side,rgb(255_210_122/0.75),rgb(245_120_30/0.28)_45%,transparent)]" />
      <div className="absolute inset-x-0 bottom-[62%] h-[150%]">
        {FLAMES.map((fl) => (
          <svg
            key={`${fl.left}-${fl.height}`}
            viewBox="0 0 40 100"
            className="diya-flame absolute bottom-0"
            style={{
              left: `${fl.left}%`,
              width: `${fl.width}%`,
              height: `${fl.height}%`,
              animationDelay: `${fl.delay}s`,
              animationDuration: `${fl.dur}s`,
            }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`${id}f${fl.left}`} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#E8650C" />
                <stop offset="0.45" stopColor="#F7A81B" />
                <stop offset="0.85" stopColor="#FFE19A" />
                <stop offset="1" stopColor="#FFF6D6" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <path
              d="M20,0 C30,22 40,44 36,70 C33,90 7,90 4,70 C0,44 10,22 20,0 Z"
              fill={`url(#${id}f${fl.left})`}
            />
            <path
              d="M20,40 C25,52 28,62 26,74 C24,84 16,84 14,74 C12,62 15,52 20,40 Z"
              fill="#FFF6D6"
              fillOpacity="0.8"
            />
          </svg>
        ))}
      </div>
      <svg viewBox="0 0 160 70" className="relative block w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}k`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#B4543A" />
            <stop offset="1" stopColor="#6E2A1A" />
          </linearGradient>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#A9821B" />
            <stop offset="0.5" stopColor="#F3D677" />
            <stop offset="1" stopColor="#A9821B" />
          </linearGradient>
        </defs>
        <path d="M14,18 L146,18 L132,60 L28,60 Z" fill={`url(#${id}k)`} />
        <path d="M2,10 L158,10 L146,22 L14,22 Z" fill={`url(#${id}g)`} />
        <path
          d="M24,34 L136,34 M28,46 L132,46"
          stroke="#4A1A10"
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />
        <path d="M30,60 L130,60 L124,68 L36,68 Z" fill="#5A2414" />
        {[40, 62, 80, 98, 120].map((x) => (
          <circle key={x} cx={x} cy="28" r="2.2" fill="#F3D677" />
        ))}
        <path
          d="M6,12 C40,4 120,4 154,12"
          fill="none"
          stroke="#FFF1C2"
          strokeWidth="1"
          strokeDasharray="0 6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** Gold/teal/vermilion rangoli mandap floor (perspective ellipse). */
export function RangoliFloor({ className }: { className?: string }) {
  const petals = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <svg
      viewBox="-210 -100 420 200"
      className={cn('overflow-visible', className)}
      aria-hidden="true"
      fill="none"
    >
      <ellipse
        rx="206"
        ry="96"
        fill="rgb(255 210 122 / 0.06)"
        stroke="#E2C25A"
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />
      <ellipse
        rx="196"
        ry="91"
        stroke="#E2C25A"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeDasharray="0 7"
        strokeLinecap="round"
      />
      <g transform="scale(1 0.466)">
        {petals.map((a) => (
          <path
            key={a}
            d="M0,-150 C9,-162 9,-176 0,-186 C-9,-176 -9,-162 0,-150 Z"
            transform={`rotate(${a})`}
            fill={a % 30 ? '#0E7C7B' : '#C2263F'}
            fillOpacity="0.55"
          />
        ))}
        <circle r="120" stroke="#F3D677" strokeOpacity="0.45" strokeWidth="1.4" />
        <circle
          r="96"
          stroke="#E46F0A"
          strokeOpacity="0.35"
          strokeWidth="6"
          strokeDasharray="1 10"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** Temple bells hanging from the top edge, each swaying on its own string. */
export function TempleBells({ className }: { className?: string }) {
  const bells = [
    { x: 8, len: 46, s: 0.8, d: 0 },
    { x: 24, len: 76, s: 1, d: -1.2 },
    { x: 76, len: 64, s: 0.95, d: -0.5 },
    { x: 92, len: 40, s: 0.75, d: -2 },
  ];
  return (
    <div className={cn('pointer-events-none', className)} aria-hidden="true">
      {bells.map((b) => (
        <svg
          key={b.x}
          viewBox={`-20 0 40 ${b.len + 46}`}
          className="toran-strand absolute top-0 overflow-visible"
          style={{
            left: `${b.x}%`,
            width: 40 * b.s,
            height: (b.len + 46) * b.s,
            marginLeft: -20 * b.s,
            transformOrigin: '50% 0',
            animationDelay: `${b.d}s`,
          }}
        >
          <path d={`M0,0 V${b.len}`} stroke="#E2C25A" strokeWidth="1.4" />
          <circle cy={b.len - 2} r="3" fill="#F3D677" />
          <path
            d={`M-13,${b.len + 34} C-13,${b.len + 14} -8,${b.len + 4} 0,${b.len + 4} C8,${b.len + 4} 13,${b.len + 14} 13,${b.len + 34} Z`}
            fill="#D9B04A"
            stroke="#8C6A12"
            strokeWidth="1"
          />
          <path
            d={`M-15,${b.len + 34} H15`}
            stroke="#8C6A12"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cy={b.len + 39} r="3.2" fill="#8C6A12" />
          <path
            d={`M-6,${b.len + 12} C-4,${b.len + 20} -4,${b.len + 26} -5,${b.len + 31}`}
            stroke="#FFF1C2"
            strokeOpacity="0.7"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </div>
  );
}

/** Crescent moon with glow, and the Ganga flowing down from the night sky. */
export function MoonAndGanga({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      viewBox="0 0 400 300"
      className={cn('overflow-visible', className)}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <radialGradient id={`${id}m`}>
          <stop offset="0" stopColor="#FFF6D6" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFF6D6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8FD3E8" stopOpacity="0.75" />
          <stop offset="1" stopColor="#5CC9BF" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <circle cx="320" cy="70" r="70" fill={`url(#${id}m)`} />
      <path d="M300,40 A36,36 0 1 0 350,92 A28,28 0 1 1 300,40 Z" fill="#FFF3C4" />
      <path
        d="M318,108 C292,140 352,176 326,214 C304,246 348,276 334,320"
        stroke={`url(#${id}g)`}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M318,108 C292,140 352,176 326,214 C304,246 348,276 334,320"
        stroke="#FFFFFF"
        strokeOpacity="0.55"
        strokeWidth="1.4"
        strokeDasharray="2 12"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Trishul with a damru tied to it, planted beside the mandap. */
export function TrishulDamru({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 200"
      className={cn('overflow-visible', className)}
      aria-hidden="true"
      fill="none"
    >
      <path d="M30,200 L30,30" stroke="#D9B04A" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M14,44 C14,24 22,12 30,2 C38,12 46,24 46,44 M30,2 L30,44 M10,48 L50,48"
        stroke="#D9B04A"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18,44 C12,30 10,22 6,16 M42,44 C48,30 50,22 54,16"
        stroke="#D9B04A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g transform="translate(30 78)">
        <path
          d="M-14,-12 L14,-12 L2,0 L14,12 L-14,12 L-2,0 Z"
          fill="#B4543A"
          stroke="#F3D677"
          strokeWidth="1.2"
        />
        <path d="M-14,-12 L14,-12 M-14,12 L14,12" stroke="#F3D677" strokeWidth="2" />
        <path
          d="M-2,0 C-12,6 -18,10 -20,18 M2,0 C12,6 18,10 20,18"
          stroke="#C2263F"
          strokeWidth="1.2"
        />
        <circle cx="-20" cy="19" r="2.4" fill="#F3D677" />
        <circle cx="20" cy="19" r="2.4" fill="#F3D677" />
      </g>
    </svg>
  );
}
