import type { RefObject } from 'react';
import type { BackdropId } from '../components/scene/backdrops';
import { gsap, useGSAP } from '../lib/gsap';
import { deferSetup } from '../lib/idle';

/*
 * Curtain geometry (see SceneBackdrops): the layer is 150lvh tall — a 100lvh opaque band
 * with a 25lvh feathered edge above and below. yPercent is relative to the layer height:
 *   66.67 → layer entirely below the viewport (fully hidden)
 *  -16.67 → opaque band exactly covers the viewport
 *  -100   → layer entirely above the viewport (fully hidden)
 * Each move spans 125lvh over 125vh of scroll, so the edge tracks the section boundary,
 * and both triggers are stretched by the 25lvh feather so no soft tail is left on screen.
 */
const BELOW = 200 / 3;
const COVER = -100 / 6;
const ABOVE = -100;

/** Silk-wipe a fixed backdrop in with the scene's top edge and out with its bottom edge. */
export function useBackdrop(scope: RefObject<HTMLElement | null>, id: BackdropId): void {
  useGSAP(
    (context) =>
      deferSetup(context, () => {
        const el = scope.current;
        const layer = document.querySelector<HTMLElement>(`[data-backdrop="${id}"]`);
        if (!el || !layer) return;
        gsap.fromTo(
          layer,
          { yPercent: BELOW, y: 0 },
          {
            yPercent: COVER,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 125%', end: 'top top', scrub: true },
          },
        );
        gsap.fromTo(
          layer,
          { yPercent: COVER },
          {
            yPercent: ABOVE,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: { trigger: el, start: 'bottom bottom', end: 'bottom -25%', scrub: true },
          },
        );
      }),
    { dependencies: [id] },
  );
}
