import type { ReactNode } from 'react';
import type { EventIcon as EventIconName } from '../../data/types';

const PATHS: Record<EventIconName, ReactNode> = {
  // Hennaed hand
  mehndi: (
    <>
      <path d="M9 27V15.5c0-1.2.9-2 2-2s2 .8 2 2V12c0-1.2.9-2 2-2s2 .8 2 2v1.5c0-1.2.9-2 2-2s2 .8 2 2V16c0-1.2.9-2 2-2s2 .8 2 2v6c0 4.5-3 7-7.5 7S9 31 9 27Z" />
      <circle cx="16.5" cy="21" r="2" />
      <path d="M16.5 17.5v-1M13.5 21h-1M20.5 21h-1M16.5 25.5v-1" />
    </>
  ),
  // Dholak + note
  sangeet: (
    <>
      <ellipse cx="8" cy="20" rx="3" ry="6" />
      <path d="M8 14h13c1.7 0 3 2.7 3 6s-1.3 6-3 6H8" />
      <path d="M11 14l4 12M15 14l4 12M19 14l3 9" />
      <path d="M25 6v8.5" />
      <circle cx="23.2" cy="14.8" r="1.8" />
      <path d="M25 6l4 1.5v3L25 9" />
    </>
  ),
  // Haldi bowl with leaf
  haldi: (
    <>
      <path d="M5 18h24c0 5.5-5 9.5-12 9.5S5 23.5 5 18Z" />
      <path d="M8 18c2-2.5 6-3.5 9-3.5s7 1 9 3.5" />
      <path d="M21 13c1-4 4.5-6.5 8-6-0.5 3.5-3.5 6.2-8 6Z" />
      <path d="M21 13c2-2 4-3.5 6-4.3" />
    </>
  ),
  // Varmala + rings
  reception: (
    <>
      <circle cx="13" cy="19" r="6" />
      <circle cx="21" cy="19" r="6" />
      <path d="M17 7.5c-6 0-10 2.5-10 5M17 7.5c6 0 10 2.5 10 5" />
      <circle cx="17" cy="7.5" r="1.6" />
    </>
  ),
  // Agni in a kund
  phere: (
    <>
      <path d="M17 6c3 3.5 5 6.5 4.5 10-.3 2.5-2.2 4-4.5 4s-4.2-1.5-4.5-4c-.4-3.5 1.5-6.5 4.5-10Z" />
      <path d="M17 12c1.3 1.6 2 3 1.8 4.4-.2 1-.9 1.6-1.8 1.6s-1.6-.6-1.8-1.6C15 15 15.7 13.6 17 12Z" />
      <path d="M5 21h24l-3 8H8Z" />
      <path d="M4 21h26" />
    </>
  ),
};

/** Line icon for an itinerary event (gold stroke, 34px box). */
export function EventIcon({ name, className }: { name: EventIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 34 34"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </svg>
  );
}
