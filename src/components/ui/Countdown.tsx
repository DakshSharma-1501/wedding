import { AnimatePresence, m } from 'framer-motion';
import { useSyncExternalStore } from 'react';
import { cn } from '../../lib/cn';
import { timeLeft } from '../../lib/countdown';

/* One shared 1 s clock for every countdown on the page. */
const listeners = new Set<() => void>();
let timer = 0;
function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!timer) timer = window.setInterval(() => listeners.forEach((l) => l()), 1000);
  return () => {
    listeners.delete(cb);
    if (!listeners.size) {
      clearInterval(timer);
      timer = 0;
    }
  };
}
const getSecond = () => Math.floor(Date.now() / 1000);

function Unit({ value, label, pad = 2 }: { value: number; label: string; pad?: number }) {
  const text = String(value).padStart(pad, '0');
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-[clamp(3.6rem,15vw,5.4rem)] min-w-[clamp(3.6rem,15vw,5.6rem)] items-center justify-center overflow-hidden rounded-2xl border border-gold/45 bg-[linear-gradient(180deg,#fffaf0,#f5ead2)] px-2 shadow-[inset_0_1px_0_#fff,0_10px_24px_-14px_rgb(107_78_12/0.45)]">
        <span className="absolute inset-x-2 top-1/2 h-px bg-gold/20" aria-hidden="true" />
        {/* Default (sync) mode with absolutely stacked digits: no per-second layout measuring. */}
        <AnimatePresence initial={false}>
          <m.span
            key={text}
            initial={{ y: '-70%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '70%', opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center font-display text-[clamp(2rem,9vw,3.3rem)] font-medium text-peacock lining-nums tabular-nums [text-shadow:0_0_18px_rgb(232_213_163/0.9)]"
          >
            {text}
          </m.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-[0.62rem] tracking-[0.32em] text-ink/75 uppercase">{label}</span>
    </div>
  );
}

interface CountdownProps {
  /** ISO 8601 target. */
  target: string;
  className?: string;
}

/** Live countdown with rolling digits. Screen readers get one calm summary, not ticks. */
export function Countdown({ target, className }: CountdownProps) {
  const second = useSyncExternalStore(subscribe, getSecond, getSecond);
  const t = timeLeft(new Date(target), new Date(second * 1000));

  if (t.done) {
    return (
      <p className={cn('font-display text-3xl text-peacock italic', className)}>
        The celebrations have begun ✨
      </p>
    );
  }
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <p className="sr-only">
        {t.days} days, {t.hours} hours and {t.minutes} minutes to go.
      </p>
      <div className="flex items-start gap-[clamp(0.4rem,2.2vw,1rem)]" aria-hidden="true">
        <Unit value={t.days} label="Days" pad={t.days > 99 ? 3 : 2} />
        <Unit value={t.hours} label="Hours" />
        <Unit value={t.minutes} label="Minutes" />
        <Unit value={t.seconds} label="Seconds" />
      </div>
    </div>
  );
}
