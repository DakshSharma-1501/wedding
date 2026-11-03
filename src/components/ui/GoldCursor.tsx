import { useEffect, useRef } from 'react';
import { isFinePointer } from '../../lib/device';
import { gsap } from '../../lib/gsap';
import { useExperience } from '../../store/experience';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label';

/**
 * Desktop-only gold glow that trails the pointer (the native cursor stays visible).
 * Grows softly over interactive elements. Never rendered on touch devices.
 */
export function GoldCursor() {
  const reduced = useExperience((s) => s.reducedMotion);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const enabled = !reduced && isFinePointer();

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const d = dot.current;
    const r = ring.current;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 });
    const dx = gsap.quickTo(d, 'x', { duration: 0.18, ease: 'power3' });
    const dy = gsap.quickTo(d, 'y', { duration: 0.18, ease: 'power3' });
    const rx = gsap.quickTo(r, 'x', { duration: 0.55, ease: 'power3' });
    const ry = gsap.quickTo(r, 'y', { duration: 0.55, ease: 'power3' });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) {
        shown = true;
        gsap.set([d, r], { x: e.clientX, y: e.clientY });
        gsap.to([d, r], { opacity: 1, duration: 0.4 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const hot = e.target instanceof Element && e.target.closest(INTERACTIVE);
      gsap.to(r, { scale: hot ? 1.7 : 1, duration: 0.35, overwrite: 'auto' });
    };
    const leave = () => {
      shown = false;
      gsap.to([d, r], { opacity: 0, duration: 0.3 });
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ring}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[70] size-9 rounded-full border border-gold/60 bg-[radial-gradient(closest-side,rgb(232_213_163/0.28),transparent)]"
      />
      <div
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[70] size-1.5 rounded-full bg-gold shadow-[0_0_12px_3px_rgb(201_162_39/0.55)]"
      />
    </>
  );
}
