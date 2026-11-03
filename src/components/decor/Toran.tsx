import { useId, useMemo, useRef } from 'react';
import { useElementWidth } from '../../hooks/useElementWidth';
import { cn } from '../../lib/cn';

interface ToranProps {
  className?: string;
}

const LEAF = 'M0,0 C7,6 8.5,18 0,30 C-8.5,18 -7,6 0,0 Z';

/** One string of marigold beads along a path (round-capped zero-length dashes). */
function MarigoldString({ d, size }: { d: string; size: number }) {
  const step = size + 0.8;
  return (
    <>
      <path
        d={d}
        stroke="rgb(120 60 10 / 0.28)"
        strokeWidth={size + 1.5}
        strokeLinecap="round"
        strokeDasharray={`0 ${step}`}
        transform="translate(0.7 1.3)"
      />
      <path
        d={d}
        stroke="#F59E0B"
        strokeWidth={size}
        strokeLinecap="round"
        strokeDasharray={`0 ${step * 2}`}
      />
      <path
        d={d}
        stroke="#E46F0A"
        strokeWidth={size}
        strokeLinecap="round"
        strokeDasharray={`0 ${step * 2}`}
        strokeDashoffset={-step}
      />
      <path
        d={d}
        stroke="#FFE3A1"
        strokeOpacity="0.8"
        strokeWidth={size * 0.3}
        strokeLinecap="round"
        strokeDasharray={`0 ${step}`}
        transform={`translate(${-size * 0.18} ${-size * 0.2})`}
      />
    </>
  );
}

/**
 * Bandhanwar / toran: mango leaves and marigold swags strung across the top of the
 * first scene. Generated for the measured width so it never stretches.
 */
export function Toran({ className }: ToranProps) {
  const ref = useRef<HTMLDivElement>(null);
  const width = useElementWidth(ref);
  const id = useId().replace(/:/g, '');

  const geometry = useMemo(() => {
    if (!width) return null;
    const compact = width < 640;
    const height = compact ? 86 : 112;
    const swags = Math.max(2, Math.round(width / (compact ? 190 : 250)));
    const span = width / swags;
    const sag = height * 0.36;
    const top = 8;
    const swagPaths = Array.from({ length: swags }, (_, i) => {
      const x0 = i * span;
      const x1 = x0 + span;
      return `M${x0.toFixed(1)},${top} Q${(x0 + span / 2).toFixed(1)},${(top + sag * 2).toFixed(1)} ${x1.toFixed(1)},${top}`;
    });
    const strands = Array.from({ length: swags + 1 }, (_, i) => ({
      x: i * span,
      length: height * (i % 2 ? 0.62 : 0.52),
    }));
    const leafGap = compact ? 26 : 30;
    const leaves = Array.from({ length: Math.ceil(width / leafGap) + 1 }, (_, i) => ({
      x: i * leafGap + leafGap / 2,
      rot: ((i * 37) % 17) - 8,
      scale: 0.85 + ((i * 53) % 7) * 0.04,
    }));
    return { height, swagPaths, strands, leaves, beadSize: compact ? 9.5 : 11.5, top };
  }, [width]);

  return (
    <div ref={ref} className={cn('pointer-events-none relative', className)} aria-hidden="true">
      {geometry && (
        <svg
          width="100%"
          height={geometry.height + 40}
          viewBox={`0 0 ${width} ${geometry.height + 40}`}
          fill="none"
          className="block overflow-visible"
        >
          <defs>
            <linearGradient id={`${id}leaf`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2F8A5B" />
              <stop offset="1" stopColor="#14583A" />
            </linearGradient>
            <linearGradient id={`${id}bell`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#9C7A16" />
              <stop offset="0.5" stopColor="#F3D677" />
              <stop offset="1" stopColor="#9C7A16" />
            </linearGradient>
          </defs>

          {geometry.leaves.map((leaf) => (
            <g
              key={leaf.x}
              transform={`translate(${leaf.x.toFixed(1)} ${geometry.top}) rotate(${leaf.rot}) scale(${leaf.scale})`}
            >
              <path d={LEAF} fill={`url(#${id}leaf)`} />
              <path d="M0,2 L0,26" stroke="#9FD1B2" strokeOpacity="0.55" strokeWidth="0.8" />
            </g>
          ))}

          <path d={`M0 ${geometry.top} H${width}`} stroke="#B08A22" strokeWidth="2.4" />
          <path
            d={`M0 ${geometry.top} H${width}`}
            stroke="#F3D98A"
            strokeWidth="1"
            strokeDasharray="0 6"
            strokeLinecap="round"
          />

          {geometry.swagPaths.map((d) => (
            <MarigoldString key={d} d={d} size={geometry.beadSize} />
          ))}
        </svg>
      )}
      {/* Each swaying strand is its own small <svg> so the sway runs on the compositor;
          animating a <g> inside the big SVG would repaint the whole toran every frame. */}
      {geometry?.strands.map((s, i) => {
        const w = Math.ceil(geometry.beadSize * 2 + 10);
        const h = Math.ceil(geometry.top + s.length + 24);
        const x0 = s.x - w / 2;
        return (
          <svg
            key={s.x}
            className="toran-strand pointer-events-none absolute top-0 overflow-visible"
            width={w}
            height={h}
            viewBox={`${x0.toFixed(1)} 0 ${w} ${h}`}
            fill="none"
            style={{
              left: x0,
              transformOrigin: `50% ${geometry.top}px`,
              animationDelay: `${-i * 0.7}s`,
            }}
          >
            <MarigoldString
              d={`M${s.x.toFixed(1)},${geometry.top + 4} V${(geometry.top + s.length).toFixed(1)}`}
              size={geometry.beadSize * 0.85}
            />
            <g
              transform={`translate(${s.x.toFixed(1)} ${(geometry.top + s.length + 6).toFixed(1)})`}
            >
              <path d="M-6,8 C-6,1 -3,-3 0,-3 C3,-3 6,1 6,8 Z" fill={`url(#${id}bell)`} />
              <path d="M-7.5,8 H7.5" stroke="#8C6A12" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="0" cy="10.5" r="1.8" fill="#8C6A12" />
            </g>
          </svg>
        );
      })}
    </div>
  );
}
