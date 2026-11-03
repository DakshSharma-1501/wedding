import { useId } from 'react';
import { cn } from '../../lib/cn';

interface FluteProps {
  className?: string;
}

/** Krishna's bansuri: bamboo flute with gold bands, a red tassel and a small peacock feather. */
export function Flute({ className }: FluteProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 240 70" className={cn('overflow-visible', className)} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F1D08A" />
          <stop offset="0.5" stopColor="#C8963F" />
          <stop offset="1" stopColor="#8A5A22" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBE7A6" />
          <stop offset="1" stopColor="#A9821B" />
        </linearGradient>
      </defs>
      <rect x="8" y="22" width="224" height="13" rx="6.5" fill={`url(#${id}b)`} />
      <rect x="8" y="22" width="224" height="4" rx="2" fill="#FFF1C9" fillOpacity="0.45" />
      {[46, 70, 120, 140, 160, 180].map((x) => (
        <ellipse key={x} cx={x} cy="28.5" rx="3.4" ry="2.4" fill="#4A2A0E" />
      ))}
      {[20, 96, 214].map((x) => (
        <rect key={x} x={x} y="20.5" width="7" height="16" rx="2" fill={`url(#${id}g)`} />
      ))}
      <path
        d="M214,36 C212,46 208,54 204,62"
        stroke="#C2263F"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M218,36 C220,46 222,54 222,63"
        stroke="#C2263F"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="216" cy="37" r="3" fill="#F3D677" />
      <g transform="translate(26 22) rotate(-62)">
        <path d="M0,0 C1,-10 1,-24 0,-36" stroke="#B08A22" strokeWidth="1.2" fill="none" />
        <ellipse cx="0" cy="-34" rx="7" ry="9" fill="#B8922A" />
        <ellipse cx="0" cy="-33.5" rx="5.2" ry="7" fill="#2F8A5B" />
        <ellipse cx="0" cy="-33" rx="3.6" ry="5" fill="#0E7C7B" />
        <ellipse cx="0" cy="-32.5" rx="2.1" ry="3" fill="#0B3C5D" />
      </g>
    </svg>
  );
}
