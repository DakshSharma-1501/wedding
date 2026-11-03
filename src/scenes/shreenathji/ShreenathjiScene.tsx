import { useRef } from 'react';
import { Aura } from '../../components/deity/Aura';
import { DeityFigure } from '../../components/deity/DeityFigure';
import { Flute } from '../../components/decor/Flute';
import { Glint } from '../../components/decor/Glint';
import { PeacockFeather } from '../../components/decor/PeacockFeather';
import { PichwaiFrame } from '../../components/decor/PichwaiFrame';
import { SceneSection } from '../../components/scene/SceneSection';
import { wedding } from '../../data/config';
import { useBackdrop } from '../../hooks/useBackdrop';
import { useIdleLife } from '../../hooks/useIdleLife';
import { gsap, useGSAP } from '../../lib/gsap';
import { useExperience } from '../../store/experience';
import { shreenathjiGlints, shreenathjiRig } from './shreenathji.rig';
import { deferSetup } from '../../lib/idle';

const copy = wedding.copy.shreenathji;

/**
 * Scene 2 — Shreenathji, the scroll-driven hero.
 * The section is ~3.4 screens tall; a sticky stage holds the pichwai while scroll drives a
 * slow camera dolly, three lines of text and a blurred foreground feather drifting past.
 * (CSS sticky instead of a JS pin: no pin-spacer, no jitter with iOS momentum scrolling.)
 */
export function ShreenathjiScene() {
  const section = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const phase = useExperience((s) => s.phase);
  const reduced = useExperience((s) => s.reducedMotion);
  const live = phase === 'entering' || phase === 'revealed';

  useBackdrop(section, 'peacock');
  useIdleLife(stage, live && !reduced);

  useGSAP(
    (context) =>
      deferSetup(context, () => {
        const q = gsap.utils.selector(stage);
        const lines = q('[data-sn-line]');

        if (reduced) {
          // Calm fallback: everything visible, lines stacked, no scroll choreography.
          gsap.set(lines, { position: 'relative', autoAlpha: 1 });
          return;
        }

        gsap.set(lines, { autoAlpha: 0, y: 26 });
        gsap.set(q('[data-draw]'), { strokeDasharray: 1, strokeDashoffset: 1 });

        // Entrance while the section scrolls up into view.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: section.current,
              start: 'top 85%',
              end: 'top top',
              scrub: true,
            },
          })
          .fromTo(
            q('[data-sn-enter]'),
            { autoAlpha: 0, y: 90, scale: 0.9 },
            { autoAlpha: 1, y: 0, scale: 1, ease: 'none' },
            0,
          )
          .to(q('[data-draw]'), { strokeDashoffset: 0, ease: 'none', stagger: 0.04 }, 0.1)
          .fromTo(
            q('[data-sn-flute]'),
            { autoAlpha: 0, x: -40 },
            { autoAlpha: 1, x: 0, ease: 'none' },
            0.4,
          );

        // The pinned story, scrubbed across the sticky range.
        const [l0, l1, l2] = lines;
        gsap
          .timeline({
            defaults: { ease: 'power1.inOut' },
            scrollTrigger: {
              trigger: section.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          })
          .fromTo(
            q('[data-sn-dolly]'),
            { scale: 0.95, yPercent: 2 },
            { scale: 1.07, yPercent: -3, ease: 'none', duration: 1 },
            0,
          )
          .fromTo(
            q('[data-sn-aura]'),
            { scale: 0.85, opacity: 0.6 },
            { scale: 1.25, opacity: 1, ease: 'none', duration: 1 },
            0,
          )
          .fromTo(
            q('[data-sn-feather]'),
            { x: '38vw', y: '70vh', rotation: 22 },
            { x: '-46vw', y: '-120vh', rotation: -14, ease: 'none', duration: 0.9 },
            0.05,
          )
          .fromTo(
            q('[data-sn-flute]'),
            { rotation: -18 },
            { rotation: -6, ease: 'none', duration: 1 },
            0,
          )
          .to(l0 ?? [], { autoAlpha: 1, y: 0, duration: 0.09 }, 0.03)
          .to(l0 ?? [], { autoAlpha: 0, y: -22, duration: 0.07 }, 0.29)
          .to(l1 ?? [], { autoAlpha: 1, y: 0, duration: 0.09 }, 0.35)
          .to(l1 ?? [], { autoAlpha: 0, y: -22, duration: 0.07 }, 0.6)
          .to(l2 ?? [], { autoAlpha: 1, y: 0, duration: 0.09 }, 0.66);
      }),
    { scope: section, dependencies: [reduced] },
  );

  return (
    <SceneSection
      id="shreenathji"
      label="Blessings of Shreenathji"
      className={reduced ? '' : 'h-[340svh]'}
    >
      <div ref={section} className="absolute inset-0" aria-hidden="true" />
      <div
        ref={stage}
        className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center overflow-hidden px-5 pt-[calc(var(--safe-top)+3.5rem)] pb-[calc(var(--safe-bottom)+1.5rem)] text-cream"
      >
        <div data-sn-enter className="relative">
          <div data-sn-dolly className="relative">
            <div
              className="relative w-[min(76vw,25rem,calc(56dvh*0.75))]"
              style={{ aspectRatio: '300 / 400' }}
            >
              <div
                data-sn-aura
                className="absolute aspect-square w-[118%]"
                style={{ left: '-9%', top: '-6%' }}
              >
                <Aura
                  className="inset-0"
                  colors={[
                    'rgb(255 233 168 / 0.55)',
                    'rgb(212 175 55 / 0.22)',
                    'rgb(212 175 55 / 0)',
                  ]}
                  rayColor="rgb(243 214 119 / 0.13)"
                />
              </div>
              <PichwaiFrame />
              <div className="absolute bottom-[9%] left-[11%] w-[78%]">
                <DeityFigure rig={shreenathjiRig} active={live} reducedMotion={reduced} />
                {shreenathjiGlints.map((g) => (
                  <Glint key={`${g.x}-${g.y}`} {...g} />
                ))}
              </div>
              {/* lotus-pond ripples */}
              <div className="pointer-events-none absolute bottom-[3%] left-1/2 h-[9%] w-[70%] -translate-x-1/2">
                {[0, 1.4, 2.8].map((d) => (
                  <span
                    key={d}
                    className="idle-ripple absolute inset-0 rounded-[50%] border border-[#7FD6CC]/60"
                    style={{ animationDelay: `${d}s` }}
                  />
                ))}
              </div>
            </div>
            <div data-sn-flute className="absolute -bottom-[2%] -left-[16%] w-[52%]">
              <div className="idle-float-slow">
                <Flute className="w-full drop-shadow-[0_6px_10px_rgb(0_0_0/0.35)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-[clamp(1rem,3dvh,2rem)] min-h-[7.5rem] w-full max-w-xl text-center">
          <div data-sn-line className="absolute inset-x-0 top-0">
            <p lang="hi" className="font-deva text-[clamp(1.45rem,5.6vw,2.1rem)] text-champagne">
              {copy.mantra}
            </p>
            <p className="mt-2 text-[0.68rem] tracking-[0.3em] text-cream/75 uppercase">
              {copy.mantraMeaning}
            </p>
          </div>
          <p
            data-sn-line
            className="absolute inset-x-0 top-0 font-display text-[clamp(2rem,8vw,3.2rem)] leading-tight text-balance text-cream italic"
          >
            {copy.title}
          </p>
          <p
            data-sn-line
            className="absolute inset-x-0 top-0 mx-auto max-w-md font-display text-[clamp(1.4rem,5.4vw,2rem)] leading-snug text-balance text-cream/90"
          >
            {copy.blessing}
          </p>
        </div>

        {!reduced && (
          <div
            data-sn-feather
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-1/2 h-[95dvh] opacity-90"
          >
            <PeacockFeather blur={2.6} className="h-full w-auto" />
          </div>
        )}
      </div>
    </SceneSection>
  );
}
