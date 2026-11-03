import { cn } from '../../lib/cn';

interface OrnamentProps {
  className?: string;
  variant?: 'divider' | 'small';
}

/** Thin gold divider with a lotus-bud centre. Lines are drawable via [data-draw]. */
export function Ornament({ className, variant = 'divider' }: OrnamentProps) {
  if (variant === 'small') {
    return (
      <svg
        viewBox="0 0 120 12"
        className={cn('h-3 w-28', className)}
        aria-hidden="true"
        fill="none"
      >
        <path data-draw pathLength={1} d="M2 6 H48" stroke="#C9A227" strokeWidth="0.8" />
        <path data-draw pathLength={1} d="M72 6 H118" stroke="#C9A227" strokeWidth="0.8" />
        <path d="M60 1 L65 6 L60 11 L55 6 Z" fill="#C9A227" />
        <circle cx="51" cy="6" r="1.4" fill="#0E7C7B" />
        <circle cx="69" cy="6" r="1.4" fill="#0E7C7B" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 240 24" className={cn('h-6 w-56', className)} aria-hidden="true" fill="none">
      <path data-draw pathLength={1} d="M4 12 H92" stroke="#C9A227" strokeWidth="0.9" />
      <path data-draw pathLength={1} d="M148 12 H236" stroke="#C9A227" strokeWidth="0.9" />
      <circle cx="4" cy="12" r="1.6" fill="#C9A227" />
      <circle cx="236" cy="12" r="1.6" fill="#C9A227" />
      <circle cx="98" cy="12" r="1.8" fill="#0E7C7B" />
      <circle cx="142" cy="12" r="1.8" fill="#0E7C7B" />
      <path
        d="M120 2 C126 7 128 12 120 22 C112 12 114 7 120 2 Z"
        fill="#E8D5A3"
        stroke="#8C6A12"
        strokeWidth="0.9"
      />
      <path
        d="M120 7 C109 6 104 10 106 14 C110 15 116 14 120 12"
        stroke="#8C6A12"
        strokeWidth="0.9"
      />
      <path
        d="M120 7 C131 6 136 10 134 14 C130 15 124 14 120 12"
        stroke="#8C6A12"
        strokeWidth="0.9"
      />
    </svg>
  );
}
