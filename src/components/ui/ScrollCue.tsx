import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useExperience } from '../../store/experience';

/**
 * Vertical "Scroll" hint tucked into the bottom-right edge (never over the centred copy);
 * disappears after the first scroll.
 */
export function ScrollCue() {
  const phase = useExperience((s) => s.phase);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const show = phase === 'revealed' && !scrolled;

  return (
    <AnimatePresence>
      {show && (
        <m.div
          aria-hidden="true"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed right-[max(0.7rem,var(--safe-right))] bottom-[calc(var(--safe-bottom)+1rem)] z-30 flex flex-col items-center gap-2.5"
        >
          <span className="text-[0.58rem] tracking-[0.4em] text-gold-deep uppercase [writing-mode:vertical-rl]">
            Scroll
          </span>
          <span className="relative h-10 w-px overflow-hidden bg-champagne">
            <m.span
              className="absolute inset-x-0 top-0 h-3 bg-gold-deep"
              animate={{ y: ['-100%', '330%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </m.div>
      )}
    </AnimatePresence>
  );
}
