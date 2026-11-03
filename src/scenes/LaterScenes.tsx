import { useEffect, useState, type ComponentType } from 'react';
import { cancelIdle, requestIdle } from '../lib/idle';
import { useExperience } from '../store/experience';
import { CoupleScene } from './couple/CoupleScene';
import { ItineraryScene } from './itinerary/ItineraryScene';
import { KaliScene } from './kali/KaliScene';
import { PhereScene } from './phere/PhereScene';
import { RsvpScene } from './rsvp/RsvpScene';
import { ShreenathjiScene } from './shreenathji/ShreenathjiScene';

const SCENES: readonly ComponentType[] = [
  ShreenathjiScene,
  KaliScene,
  PhereScene,
  CoupleScene,
  ItineraryScene,
  RsvpScene,
];

/** Start preparing the scenes this long after load if nothing else triggers it sooner. */
const QUIET_START_MS = 7000;
/** …or this long after the envelope opens (Ganesh's entrance has settled by then). */
const AFTER_REVEAL_MS = 1200;

/**
 * Scenes 2–7: one lazy chunk, mounted **one per idle slot**, in page order.
 *
 * Their first style/layout costs ~200 ms (1×) — real work that can only be moved, not
 * removed. So it starts at a calm moment that never collides with start-up (fonts,
 * images, ScrollTrigger's load refresh): QUIET_START_MS after load while the guest is on
 * the envelope, or shortly after the reveal, or at the guest's first scroll — whichever
 * comes first, so nobody can scroll into missing scenes. Appending in order keeps every
 * earlier ScrollTrigger valid; unlockScroll() refreshes them all when the envelope opens.
 */
export default function LaterScenes() {
  const [started, setStarted] = useState(false);
  const [mounted, setMounted] = useState(0);

  useEffect(() => {
    if (started) return;
    const start = () => setStarted(true);
    const quiet = window.setTimeout(start, QUIET_START_MS);
    let afterReveal = 0;
    const onIntent = () => {
      if (useExperience.getState().phase === 'revealed') start();
    };
    const unsubscribe = useExperience.subscribe((s) => {
      if (s.phase === 'revealed' && !afterReveal) {
        afterReveal = window.setTimeout(start, AFTER_REVEAL_MS);
      }
    });
    const opts = { passive: true } as const;
    window.addEventListener('wheel', onIntent, opts);
    window.addEventListener('touchmove', onIntent, opts);
    window.addEventListener('keydown', onIntent);
    return () => {
      clearTimeout(quiet);
      clearTimeout(afterReveal);
      unsubscribe();
      window.removeEventListener('wheel', onIntent);
      window.removeEventListener('touchmove', onIntent);
      window.removeEventListener('keydown', onIntent);
    };
  }, [started]);

  useEffect(() => {
    if (!started || mounted >= SCENES.length) return;
    const id = requestIdle(() => setMounted((n) => n + 1));
    return () => cancelIdle(id);
  }, [started, mounted]);

  return (
    <>
      {SCENES.slice(0, mounted).map((Scene, i) => (
        <Scene key={i} />
      ))}
    </>
  );
}
