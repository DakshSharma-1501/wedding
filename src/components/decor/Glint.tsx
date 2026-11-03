interface GlintProps {
  /** Position as fractions of the parent box. */
  x: number;
  y: number;
  /** px */
  size: number;
  /** Animation delay, s. */
  delay: number;
  color?: string;
}

/** A twinkling four-point star (CSS keyframes on an HTML-level SVG → compositor). */
export function Glint({ x, y, size, delay, color = '#FFF7DA' }: GlintProps) {
  return (
    <svg
      viewBox="-10 -10 20 20"
      className="glint pointer-events-none absolute"
      style={{
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        animationDelay: `${delay}s`,
      }}
      aria-hidden="true"
    >
      <path
        d="M0,-10 C1,-2 2,-1 10,0 C2,1 1,2 0,10 C-1,2 -2,1 -10,0 C-2,-1 -1,-2 0,-10 Z"
        fill={color}
      />
      <circle r="1.6" fill="#fff" />
    </svg>
  );
}
