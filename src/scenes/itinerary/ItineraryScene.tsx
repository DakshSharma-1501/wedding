import { useRef } from 'react';
import { Ornament } from '../../components/decor/Ornament';
import { SceneSection } from '../../components/scene/SceneSection';
import { Countdown } from '../../components/ui/Countdown';
import { Timeline } from '../../components/ui/Timeline';
import { wedding } from '../../data/config';
import { eventDays } from '../../data/events';
import { gsap, useGSAP } from '../../lib/gsap';
import { useExperience } from '../../store/experience';
import { deferSetup } from '../../lib/idle';

/** Scene 6 — the itinerary: live countdown, then the three days as a self-drawing timeline. */
export function ItineraryScene() {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useExperience((s) => s.reducedMotion);

  useGSAP(
    (context) =>
      deferSetup(context, () => {
        if (reduced) return;
        gsap.fromTo(
          '[data-itin-head] > *',
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: '[data-itin-head]', start: 'top 82%', once: true },
          },
        );
      }),
    { scope, dependencies: [reduced] },
  );

  return (
    <SceneSection
      id="itinerary"
      label="Wedding itinerary"
      className="px-5 py-[clamp(4rem,12svh,8rem)]"
    >
      <div ref={scope} className="mx-auto max-w-5xl">
        <header data-itin-head className="flex flex-col items-center text-center">
          <p className="text-[0.68rem] tracking-[0.42em] text-teal uppercase">Save the dates</p>
          <h2 className="mt-3 font-display text-[clamp(2.4rem,9vw,4.2rem)] leading-none text-peacock">
            The Celebrations
          </h2>
          <Ornament className="mt-5" />
          <p className="mt-6 max-w-md text-ink/75">
            Three days of colour, music and blessings at {wedding.venue.name}, {wedding.venue.city}.
          </p>
          <Countdown target={wedding.dates.countdownTarget} className="mt-9" />
        </header>
        <div className="mt-16 md:mt-24">
          <Timeline days={eventDays} />
        </div>
      </div>
    </SceneSection>
  );
}
