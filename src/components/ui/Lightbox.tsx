import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import type { GalleryItem } from '../../scenes/couple/photos';
import { lockScroll, unlockScroll } from '../../lib/scroll';
import { GalleryArt } from './GalleryArt';

interface LightboxProps {
  items: readonly GalleryItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (index: number) => void;
}

/** Full-screen photo viewer: Esc / arrows / swipe, focus moves into the dialog. */
export function Lightbox({ items, index, onClose, onIndex }: LightboxProps) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const swipe = useRef<number | null>(null);
  const open = index !== null;
  const item = index === null ? undefined : items[index];

  useEffect(() => {
    if (!open) return;
    lockScroll();
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [open, index, items.length, onClose, onIndex]);

  const go = (dir: 1 | -1) => {
    if (index !== null) onIndex((index + dir + items.length) % items.length);
  };
  const onPointerDown = (e: ReactPointerEvent) => {
    swipe.current = e.clientX;
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    if (swipe.current === null) return;
    const dx = e.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  return (
    <AnimatePresence>
      {open && item && (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-label={item.caption}
          className="fixed inset-0 z-[85] flex flex-col items-center justify-center bg-[rgb(7_42_66/0.94)] px-4 py-[calc(var(--safe-top)+4rem)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <m.figure
            key={index}
            className="relative flex max-h-full w-full max-w-3xl flex-col items-center"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <div className="relative aspect-[4/5] max-h-[72dvh] w-auto overflow-hidden rounded-xl border border-champagne/40 shadow-2xl sm:aspect-[4/3]">
              <GalleryArt item={item} large />
            </div>
            <figcaption className="mt-4 font-display text-xl text-cream italic">
              {item.caption}
            </figcaption>
          </m.figure>

          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-[calc(var(--safe-top)+0.875rem)] right-[max(0.875rem,var(--safe-right))] grid size-11 place-items-center rounded-full border border-champagne/50 text-cream"
          >
            <svg
              viewBox="0 0 16 16"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
          {items.length > 1 && (
            <div className="absolute bottom-[calc(var(--safe-bottom)+1rem)] flex gap-3">
              {([-1, 1] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(dir);
                  }}
                  aria-label={dir < 0 ? 'Previous photo' : 'Next photo'}
                  className="grid size-11 place-items-center rounded-full border border-champagne/50 text-cream"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={dir < 0 ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'} />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
}
