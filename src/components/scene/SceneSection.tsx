import { useRef, type ReactNode } from 'react';
import type { SceneId } from '../../data/types';
import { cn } from '../../lib/cn';
import { ScrollTrigger, useGSAP } from '../../lib/gsap';
import { scrollState } from '../../lib/scroll';
import { useExperience } from '../../store/experience';
import { deferSetup } from '../../lib/idle';

interface SceneSectionProps {
  id: SceneId;
  /** Accessible name for the region. */
  label: string;
  className?: string;
  children: ReactNode;
}

/**
 * A scroll scene. Publishes its 0–1 progress to `scrollState.scenes[id]` (read by the
 * WebGL layer each frame) and marks itself as the active scene while it holds the
 * middle of the viewport (drives which particle fields are visible).
 */
export function SceneSection({ id, label, className, children }: SceneSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (context) =>
      deferSetup(context, () => {
        const el = ref.current;
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            scrollState.scenes[id] = self.progress;
          },
        });
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          onToggle: (self) => {
            if (self.isActive) useExperience.getState().setActiveScene(id);
          },
        });
      }),
    { scope: ref, dependencies: [id] },
  );

  return (
    <section
      ref={ref}
      id={id}
      data-scene={id}
      aria-label={label}
      className={cn('relative isolate', className)}
    >
      {children}
    </section>
  );
}
