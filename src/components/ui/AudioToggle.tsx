import { AnimatePresence, m } from 'framer-motion';
import { inviteAudio } from '../../lib/audio';
import { useExperience } from '../../store/experience';

const BARS = [0.55, 1, 0.7, 0.9];

/** Fixed mute/unmute button (top-right, safe-area aware). The choice persists in localStorage. */
export function AudioToggle() {
  const muted = useExperience((s) => s.muted);
  const setMuted = useExperience((s) => s.setMuted);
  const phase = useExperience((s) => s.phase);
  const visible = phase === 'entering' || phase === 'revealed';

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    inviteAudio.setMuted(next);
  };

  return (
    <AnimatePresence>
      {visible && (
        <m.button
          type="button"
          onClick={toggle}
          aria-pressed={!muted}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="gold-shimmer fixed top-[max(0.875rem,var(--safe-top))] right-[max(0.875rem,var(--safe-right))] z-40 grid size-11 place-items-center rounded-full border border-champagne bg-cream/80 shadow-[0_4px_18px_-6px_rgb(107_78_12/0.35)] backdrop-blur-sm transition-colors hover:border-gold"
        >
          <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
            {BARS.map((h, i) => (
              <m.span
                key={i}
                className="w-[2.5px] rounded-full bg-gold-deep"
                style={{ height: '100%', originY: 1 }}
                animate={
                  muted ? { scaleY: 0.18 } : { scaleY: [h * 0.4, h, h * 0.55, h * 0.9, h * 0.4] }
                }
                transition={
                  muted
                    ? { duration: 0.3 }
                    : { duration: 1.1 + i * 0.17, repeat: Infinity, ease: 'easeInOut' }
                }
              />
            ))}
          </span>
          {muted && (
            <span
              className="absolute h-[1.5px] w-6 rotate-[-40deg] rounded-full bg-gold-deep"
              aria-hidden="true"
            />
          )}
        </m.button>
      )}
    </AnimatePresence>
  );
}
