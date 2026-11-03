import type { RefObject } from 'react';
import { ScrollTrigger, useGSAP } from '../lib/gsap';
import { deferSetup } from '../lib/idle';

/**
 * Drives a scene's CSS idle loops (see "Idle life" in src/styles/index.css) by setting
 * `data-idle` on the scene root: 'on' while visible, 'paused' off-screen, 'off' before
 * the scene starts. Written straight to the DOM — no React re-renders.
 */
export function useIdleLife(scope: RefObject<HTMLElement | null>, active: boolean): void {
  useGSAP(
    (context) =>
      deferSetup(context, () => {
        const el = scope.current;
        if (!el) return;
        if (!active) {
          el.setAttribute('data-idle', 'off');
          return;
        }
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            el.setAttribute('data-idle', self.isActive ? 'on' : 'paused');
          },
        });
        el.setAttribute('data-idle', st.isActive ? 'on' : 'paused');
        return () => {
          el.setAttribute('data-idle', 'off');
        };
      }),
    { dependencies: [active] },
  );
}
