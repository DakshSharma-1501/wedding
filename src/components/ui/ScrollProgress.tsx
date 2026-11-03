import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { scrollState } from '../../lib/scroll';

/** Thin peacock-gradient progress line pinned to the top edge. Writes transform directly per tick. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = -1;
    const tick = () => {
      const p = Math.round(scrollState.progress * 1000) / 1000;
      if (p === last || !bar.current) return;
      last = p;
      bar.current.style.transform = `scaleX(${p})`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px]" aria-hidden="true">
      <div
        ref={bar}
        className="h-full origin-left bg-[linear-gradient(90deg,#1B6B4A,#0E7C7B_35%,#0B3C5D_70%,#C9A227)]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
