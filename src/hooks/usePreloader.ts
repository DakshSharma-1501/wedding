import { useEffect } from 'react';
import { rigImageUrls } from '../components/deity/assets';
import { ganeshRig } from '../scenes/ganesh/ganesh.rig';
import { CRITICAL_FONTS } from '../styles/fonts';
import { loadCanvas } from '../three/loadCanvas';
import { useExperience } from '../store/experience';

/** Shortest time the loader ring is shown, so it never flashes. */
const MIN_MS = 1300;
/** Never hold guests longer than this on a slow network; the rest streams in after. */
const MAX_MS = 7000;

function loadImage(src: string): Promise<void> {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  return img.decode().catch(() => undefined);
}

/**
 * Preloads fonts, Scene 1 artwork and the three.js chunk behind the sealed envelope,
 * reporting progress to the store. Moves the phase to 'sealed' once ready.
 */
export function usePreloader(): void {
  useEffect(() => {
    let cancelled = false;
    const { webgl, reducedMotion, setLoadProgress, setPhase } = useExperience.getState();

    // three.js is deliberately NOT a blocking task: evaluating it is the heaviest main-thread
    // work on the page. It starts downloading on the guest's first touch/hover of the
    // envelope (see warmCanvas) and is mounted when the seal breaks — the ~3 s opening
    // sequence hides the load.
    const tasks: (() => Promise<unknown>)[] = [
      ...CRITICAL_FONTS.map((font) => () => document.fonts.load(font)),
      ...rigImageUrls(ganeshRig).map((url) => () => loadImage(url)),
    ];
    if (webgl && !reducedMotion) {
      const warm = () => void loadCanvas();
      window.addEventListener('pointerdown', warm, { once: true, capture: true });
      window.addEventListener('pointermove', warm, { once: true, capture: true });
      window.addEventListener('keydown', warm, { once: true, capture: true });
    }

    let done = 0;
    const tick = () => {
      if (cancelled) return;
      done += 1;
      setLoadProgress(done / tasks.length);
    };
    const all = Promise.allSettled(tasks.map((run) => run().finally(tick)));
    const cap = new Promise((resolve) => setTimeout(resolve, MAX_MS));
    const floor = new Promise((resolve) => setTimeout(resolve, MIN_MS));

    void Promise.all([Promise.race([all, cap]), floor]).then(() => {
      if (cancelled) return;
      setLoadProgress(1);
      // Let the ring visibly complete before the seal becomes tappable.
      setTimeout(() => !cancelled && setPhase('sealed'), 450);
    });

    return () => {
      cancelled = true;
    };
  }, []);
}
