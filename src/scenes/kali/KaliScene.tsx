import { useRef } from 'react';
import { Aura } from '../../components/deity/Aura';
import { DeityFigure } from '../../components/deity/DeityFigure';
import { Glint } from '../../components/decor/Glint';
import { Ornament } from '../../components/decor/Ornament';
import { SceneSection } from '../../components/scene/SceneSection';
import { wedding } from '../../data/config';
import { useBackdrop } from '../../hooks/useBackdrop';
import { useIdleLife } from '../../hooks/useIdleLife';
import { gsap, useGSAP } from '../../lib/gsap';
import { useExperience } from '../../store/experience';
import { kaliGlints, kaliPalm, kaliRig } from './kali.rig';
import { deferSetup } from '../../lib/idle';

const copy = wedding.copy.kali;

/**
 * Scene 3 — Maa Kali's blessing. Deep indigo-to-teal night, a ring of golden flame,
 * gold embers rising (WebGL). As you scroll, rays bloom from her raised abhaya hand and
 * the blessing writes itself in beneath her.
 */
export function KaliScene() {
  const section = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const phase = useExperience((s) => s.phase);
  const reduced = useExperience((s) => s.reducedMotion);
  const live = phase === 'entering' || phase === 'revealed';

  useBackdrop(section, 'indigo');
  useIdleLife(stage, live && !reduced);

  useGSAP(
    (context) =>
      deferSetup(context, () => {
        if (reduced) return;
        const q = gsap.utils.selector(stage);
        gsap
          .timeline({
            scrollTrigger: {
              trigger: section.current,
              start: 'top 80%',
              end: 'top top',
              scrub: true,
            },
          })
          .fromTo(
            q('[data-kali-enter]'),
            { autoAlpha: 0, y: 100, scale: 0.88 },
            { autoAlpha: 1, y: 0, scale: 1, ease: 'none' },
          );

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
            q('[data-kali-rays]'),
            { scale: 0.35, opacity: 0.25 },
            { scale: 1.5, opacity: 1, ease: 'none', duration: 0.8 },
            0,
          )
          .fromTo(
            q('[data-kali-dolly]'),
            { scale: 0.97 },
            { scale: 1.05, ease: 'none', duration: 1 },
            0,
          )
          .fromTo(
            q('[data-kali-line="0"]'),
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.12 },
            0.02,
          )
          .fromTo(
            q('[data-kali-line="1"]'),
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.14 },
            0.22,
          )
          .fromTo(
            q('[data-kali-line="2"]'),
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.14 },
            0.42,
          );
      }),
    { scope: section, dependencies: [reduced] },
  );

  return (
    <SceneSection id="kali" label="Blessings of Maa Kali" className={reduced ? '' : 'h-[250svh]'}>
      <div ref={section} className="absolute inset-0" aria-hidden="true" />
      <div
        ref={stage}
        className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center overflow-hidden px-5 pt-[calc(var(--safe-top)+3rem)] pb-[calc(var(--safe-bottom)+1.25rem)] text-center text-cream"
      >
        <p
          data-kali-line="0"
          lang="hi"
          className="font-deva text-[clamp(1.3rem,5vw,1.9rem)] text-champagne"
        >
          {copy.mantra}
          <span className="sr-only"> — {copy.mantraMeaning}</span>
        </p>

        <div data-kali-enter className="relative mt-[clamp(0.5rem,2dvh,1.25rem)]">
          <div data-kali-dolly className="relative">
            <div className="idle-breathe relative w-[min(80vw,25rem,calc(52dvh*0.789))] origin-bottom">
              <div
                className="absolute aspect-square w-[130%]"
                style={{ left: '-15%', top: '-12%' }}
              >
                <Aura
                  className="inset-0"
                  colors={[
                    'rgb(255 210 122 / 0.45)',
                    'rgb(245 158 11 / 0.16)',
                    'rgb(245 158 11 / 0)',
                  ]}
                  rayColor="rgb(255 225 154 / 0.1)"
                />
              </div>
              <DeityFigure rig={kaliRig} active={live} reducedMotion={reduced} />
              {kaliGlints.map((g) => (
                <Glint key={`${g.x}-${g.y}`} {...g} />
              ))}
              {/* Abhaya-mudra blessing rays */}
              <div
                className="pointer-events-none absolute aspect-square w-[46%]"
                style={{
                  left: `${kaliPalm.x * 100}%`,
                  top: `${kaliPalm.y * 100}%`,
                  translate: '-50% -50%',
                }}
              >
                <div data-kali-rays className="absolute inset-0">
                  <div
                    className="idle-rays absolute inset-0 rounded-full"
                    style={{
                      background:
                        'repeating-conic-gradient(from 0deg, rgb(255 230 160 / 0.55) 0deg 3deg, transparent 3deg 15deg)',
                      WebkitMaskImage: 'radial-gradient(closest-side, #000 10%, transparent 100%)',
                      maskImage: 'radial-gradient(closest-side, #000 10%, transparent 100%)',
                    }}
                  />
                  <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(closest-side,rgb(255_245_214/0.95),rgb(255_210_122/0.5)_45%,transparent)]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[clamp(0.75rem,2.5dvh,1.75rem)] flex max-w-lg flex-col items-center">
          <h2
            data-kali-line="1"
            className="font-display text-[clamp(1.9rem,7.6vw,3rem)] leading-tight text-balance text-cream italic"
          >
            {copy.title}
          </h2>
          <div data-kali-line="2" className="flex flex-col items-center">
            <Ornament variant="small" className="mt-3 opacity-90" />
            <p className="mt-3 max-w-md font-display text-[clamp(1.15rem,4.4vw,1.55rem)] leading-snug text-balance text-cream/90">
              {copy.blessing}
            </p>
          </div>
        </div>
      </div>
    </SceneSection>
  );
}
