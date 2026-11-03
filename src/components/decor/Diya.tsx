import { useId } from 'react';
import { cn } from '../../lib/cn';

interface DiyaProps {
  className?: string;
  /** Stagger the flicker so a pair of diyas never moves in lockstep. */
  delay?: number;
}

/**
 * Clay diya with a flickering flame and warm glow.
 * The flame and glow are separate HTML-level elements so their CSS keyframes run on the
 * compositor — animating shapes *inside* an SVG forces a repaint every frame.
 */
export function Diya({ className, delay = 0 }: DiyaProps) {
  const id = useId().replace(/:/g, '');
  return (
    <div className={cn('relative', className)} aria-hidden="true">
      <div
        className="diya-glow pointer-events-none absolute rounded-full"
        style={{
          left: '16%',
          top: '-8%',
          width: '68%',
          aspectRatio: '1',
          background:
            'radial-gradient(closest-side, rgb(255 217 138 / 0.85), rgb(255 193 90 / 0.3) 45%, rgb(255 179 71 / 0) 100%)',
          animationDelay: `${delay}s`,
        }}
      />
      <svg
        viewBox="38 2 24 38"
        className="diya-flame pointer-events-none absolute overflow-visible"
        style={{ left: '38%', top: '2.2%', width: '24%', animationDelay: `${delay}s` }}
      >
        <defs>
          <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFF6D6" />
            <stop offset="0.35" stopColor="#FFD36B" />
            <stop offset="0.8" stopColor="#F59A23" />
            <stop offset="1" stopColor="#E0641A" />
          </linearGradient>
        </defs>
        <path
          d="M50,4 C57,15 61,25 57,34 C55,39 45,39 43,34 C39,25 43,15 50,4 Z"
          fill={`url(#${id}f)`}
        />
        <path
          d="M50,18 C53,24 54,29 52,33 C51,35 49,35 48,33 C46,29 47,24 50,18 Z"
          fill="#FFFBEA"
        />
      </svg>
      <svg viewBox="0 0 100 92" className="relative block w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#B8673A" />
            <stop offset="1" stopColor="#6E321A" />
          </linearGradient>
        </defs>
        <path d="M50,36 L50,42" stroke="#3A2414" strokeWidth="1.6" strokeLinecap="round" />
        <path
          d="M10,48 C16,70 34,80 50,80 C66,80 84,70 90,48 C80,52 66,54 50,54 C34,54 20,52 10,48 Z"
          fill={`url(#${id}b)`}
        />
        <ellipse cx="50" cy="47" rx="40" ry="7.5" fill="#CF7E48" />
        <ellipse cx="50" cy="47" rx="33" ry="5" fill="#5A2C12" />
        <ellipse cx="50" cy="46.2" rx="28" ry="3.4" fill="#C9852B" fillOpacity="0.55" />
        <path
          d="M16,58 C30,68 70,68 84,58"
          fill="none"
          stroke="#E8C062"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="0 5"
        />
        <path d="M22,66 C36,74 64,74 78,66" fill="none" stroke="#E8C062" strokeWidth="0.8" />
        <ellipse cx="50" cy="84" rx="20" ry="3" fill="#6E321A" fillOpacity="0.18" />
      </svg>
    </div>
  );
}
