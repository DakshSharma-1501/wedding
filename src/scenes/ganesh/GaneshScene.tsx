import { useRef } from 'react';
import { DeityFigure } from '../../components/deity/DeityFigure';
import { Aura } from '../../components/deity/Aura';
import { ArchFrame } from '../../components/decor/ArchFrame';
import { Diya } from '../../components/decor/Diya';
import { Glint } from '../../components/decor/Glint';
import { Ornament } from '../../components/decor/Ornament';
import { PeacockFeather } from '../../components/decor/PeacockFeather';
import { Toran } from '../../components/decor/Toran';
import { SceneSection } from '../../components/scene/SceneSection';
import { RevealText } from '../../components/ui/RevealText';
import { wedding } from '../../data/config';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { useIdleLife } from '../../hooks/useIdleLife';
import { useExperience } from '../../store/experience';
import { ganeshGlints, ganeshRig } from './ganesh.rig';

const { couple, invocation, tagline, dates, venue } = wedding;

function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" aria-hidden="true">
      <path
        d="M8 1.5c-2.6 0-4.5 2-4.5 4.5 0 3.2 4.5 8.5 4.5 8.5s4.5-5.3 4.5-8.5c0-2.5-1.9-4.5-4.5-4.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="6" r="1.6" fill="currentColor" />
    </svg>
  );
}

/**
 * Scene 1 — Shri Ganesh Ji, the auspicious beginning.
 * Entrance plays once the envelope card flies past the camera; afterwards the deity
 * idles (float, ear flap, trunk sway, blink, halo turn) and parallaxes away on scroll.
 */
export function GaneshScene() {
  const scope = useRef<HTMLDivElement>(null);
  const phase = useExperience((s) => s.phase);
  const reduced = useExperience((s) => s.reducedMotion);
  const started = phase === 'entering' || phase === 'revealed';
  useIdleLife(scope, started && !reduced);

  useGSAP(
    () => {
      const q = gsap.utils.selector(scope);

      if (reduced) {
        gsap.set(q('[data-intro]'), { autoAlpha: 0 });
        if (started) {
          gsap.to(q('[data-intro]'), {
            autoAlpha: 1,
            duration: 1.2,
            stagger: 0.1,
            ease: 'power1.out',
          });
        }
        return;
      }

      // Hidden "before" state — applied before first paint (useGSAP is a layout effect).
      gsap.set(q('[data-reveal-item]'), { yPercent: 118 });
      gsap.set(q('[data-draw]'), { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(q('[data-fade]'), { autoAlpha: 0, y: 18 });
      gsap.set(q('[data-deity]'), { autoAlpha: 0, y: 46, scale: 0.92 });
      gsap.set(q('[data-aura]'), { autoAlpha: 0, scale: 0.55 });
      gsap.set(q('[data-arch-fill], [data-arch-dots], [data-arch-finial]'), { autoAlpha: 0 });
      gsap.set(q('[data-diya]'), { autoAlpha: 0, y: 16 });
      gsap.set(q('[data-toran]'), { autoAlpha: 0, yPercent: -35 });
      gsap.set(q('[data-feather]'), { autoAlpha: 0, y: 60 });
      if (!started) return;

      gsap
        .timeline({ delay: 0.05 })
        .to(q('[data-toran]'), { autoAlpha: 1, yPercent: 0, duration: 1.6, ease: 'expo.out' }, 0)
        .to(
          q('[data-arch] [data-draw]'),
          { strokeDashoffset: 0, duration: 1.9, ease: 'power2.inOut', stagger: 0.1 },
          0.05,
        )
        .to(q('[data-arch-fill]'), { autoAlpha: 1, duration: 1.6, ease: 'power1.out' }, 0.45)
        .to(q('[data-arch-dots], [data-arch-finial]'), { autoAlpha: 1, duration: 1 }, 1.2)
        .to(q('[data-aura]'), { autoAlpha: 1, scale: 1, duration: 2.2, ease: 'expo.out' }, 0.55)
        .to(q('[data-deity]'), { autoAlpha: 1, y: 0, scale: 1, duration: 2, ease: 'expo.out' }, 0.7)
        .to(
          q('[data-invocation] [data-reveal-item]'),
          { yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out' },
          0.85,
        )
        .to(q('[data-invocation-rule] [data-draw]'), { strokeDashoffset: 0, duration: 1.2 }, 1.0)
        .to(q('[data-diya]'), { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.18 }, 1.25)
        .to(
          q('[data-names] [data-reveal-item]'),
          { yPercent: 0, duration: 1.4, stagger: 0.13, ease: 'expo.out' },
          1.4,
        )
        .to(
          q('[data-feather]'),
          { autoAlpha: 0.9, y: 0, duration: 2.4, stagger: 0.2, ease: 'expo.out' },
          1.1,
        )
        .to(q('[data-fade]'), { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.12 }, 1.95)
        .to(q('[data-details] [data-draw]'), { strokeDashoffset: 0, duration: 1.2 }, 2.1);

      // Idle loops (float, ears, trunk, halo, feathers, diyas, aura) are CSS keyframes run
      // by useIdleLife — on the compositor, not GSAP. Only the occasional foil glint
      // (a background-position sweep) stays here, paused while off-screen.
      const shimmer = gsap.to(q('.foil'), {
        backgroundPosition: '0% 0',
        duration: 2.6,
        ease: 'sine.inOut',
        repeat: -1,
        repeatDelay: 6,
        delay: 3,
      });
      ScrollTrigger.create({
        trigger: scope.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? shimmer.resume() : shimmer.pause()),
      });

      // Scroll-out parallax: layers drift at different depths.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: 'top top',
            end: 'bottom top',
            // `true` = locked to the (already Lenis-smoothed) scroll. A numeric scrub would
            // stack a second catch-up delay on top and make parallax trail the page.
            scrub: true,
          },
        })
        .to(q('[data-parallax="toran"]'), { yPercent: -60, ease: 'none' }, 0)
        .to(q('[data-parallax="stage"]'), { yPercent: -9, scale: 0.95, ease: 'none' }, 0)
        .to(q('[data-parallax="aura"]'), { scale: 1.2, opacity: 0.6, ease: 'none' }, 0)
        .to(q('[data-parallax="text"]'), { yPercent: -14, ease: 'none' }, 0)
        .to(q('[data-parallax="feather-l"]'), { yPercent: -22, ease: 'none' }, 0)
        .to(q('[data-parallax="feather-r"]'), { yPercent: -12, ease: 'none' }, 0);
    },
    { scope, dependencies: [started, reduced] },
  );

  const dateParts = dates.teaser.split('·').map((s) => s.trim());

  return (
    <SceneSection id="ganesh" label="Shri Ganesh Ji — an auspicious beginning">
      <div
        ref={scope}
        className="relative flex min-h-[100svh] flex-col items-center overflow-hidden px-5 pt-[calc(var(--safe-top)+clamp(5rem,15vw,6.75rem))] pb-[calc(var(--safe-bottom)+6rem)] text-center"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(ellipse_70%_55%_at_50%_38%,rgb(255_246_220/0.95),rgb(250_246_238/0)_70%)]"
        />

        <div data-parallax="toran" className="absolute inset-x-0 top-0">
          <div data-toran data-intro>
            <Toran />
          </div>
        </div>

        {/* Peacock feathers framing the scene on wide screens. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden lg:block"
        >
          {/* Static tilt/mirror lives on the outer element; GSAP only animates the inner
              one (GSAP folds CSS rotate/scale into its own matrix, which breaks mirroring). */}
          <div data-parallax="feather-l" className="absolute top-[17%] left-[6.5vw] h-[72svh]">
            <div className="h-full origin-bottom -rotate-6">
              <div data-feather data-intro className="h-full origin-bottom">
                <div className="idle-sway h-full origin-bottom">
                  <PeacockFeather className="h-full w-auto" />
                </div>
              </div>
            </div>
          </div>
          <div data-parallax="feather-r" className="absolute top-[17%] right-[6.5vw] h-[72svh]">
            <div className="h-full origin-bottom -scale-x-100 rotate-6">
              <div data-feather data-intro className="h-full origin-bottom">
                <div className="idle-sway h-full origin-bottom" style={{ animationDelay: '-2.6s' }}>
                  <PeacockFeather className="h-full w-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <p
          data-invocation
          data-intro
          className="font-deva text-[clamp(1.1rem,4.2vw,1.5rem)] text-gold-deep"
        >
          <span lang="hi">
            <RevealText text={invocation.devanagari} />
          </span>
          <span className="sr-only"> — {invocation.english}</span>
        </p>
        <div data-invocation-rule data-intro className="mt-1">
          <Ornament variant="small" />
        </div>

        <div
          data-parallax="stage"
          data-intro
          className="relative mt-[clamp(1.6rem,4.5svh,2.75rem)] w-[min(72vw,22rem,calc(49svh*0.79))] md:w-[min(22rem,calc(44svh*0.79))]"
          style={{ aspectRatio: '300 / 380' }}
        >
          <div data-arch className="absolute inset-0">
            <ArchFrame />
          </div>

          <div
            data-parallax="aura"
            className="absolute aspect-square w-[124%]"
            style={{ left: '-12%', top: '-8%' }}
          >
            <div data-aura className="absolute inset-0">
              <Aura className="inset-0" />
            </div>
          </div>

          <div className="absolute bottom-[1.5%] left-[5%] w-[90%]">
            <div data-deity>
              <div data-float className="idle-float relative">
                <DeityFigure rig={ganeshRig} active={started} reducedMotion={reduced} />
                {ganeshGlints.map((g) => (
                  <Glint key={`${g.x}-${g.y}`} {...g} />
                ))}
              </div>
            </div>
          </div>

          <div data-diya className="absolute -bottom-[3%] -left-[13%] w-[25%]">
            <div className="idle-bob">
              <Diya />
            </div>
          </div>
          <div data-diya className="absolute -right-[13%] -bottom-[3%] w-[25%]">
            <div className="idle-bob" style={{ animationDelay: '-1.3s' }}>
              <Diya delay={0.7} />
            </div>
          </div>
        </div>

        <div
          data-parallax="text"
          className="relative mt-[clamp(1.5rem,4.5svh,2.75rem)] flex flex-col items-center md:mt-[clamp(1.25rem,3svh,2rem)]"
        >
          <h1
            aria-label={`${couple.bride.firstName} weds ${couple.groom.firstName}`}
            data-names
            data-intro
            className="flex flex-col items-center font-display font-medium md:flex-row md:items-baseline md:gap-x-6"
          >
            <RevealText
              text={couple.bride.firstName}
              wordClassName="foil"
              className="block text-[clamp(3.2rem,15vw,6.25rem)] leading-[0.92]"
            />{' '}
            <RevealText
              text="weds"
              className="my-1 block text-[clamp(1.35rem,5.4vw,2.3rem)] leading-none font-normal text-teal italic md:my-0"
            />{' '}
            <RevealText
              text={couple.groom.firstName}
              wordClassName="foil"
              className="block text-[clamp(3.2rem,15vw,6.25rem)] leading-[0.92]"
            />
          </h1>

          <div data-details className="flex flex-col items-center">
            <p
              data-fade
              data-intro
              className="mt-5 text-[0.68rem] font-light tracking-[0.42em] text-ink/75 uppercase sm:text-xs"
            >
              {tagline}
            </p>
            <Ornament variant="small" className="mt-5" />
            <p
              data-fade
              data-intro
              className="mt-4 flex items-baseline gap-[0.45em] font-display text-[clamp(1.45rem,5.6vw,2.2rem)] font-medium text-peacock lining-nums"
            >
              {dateParts.map((part, i) => (
                <span key={part} className="flex items-baseline gap-[0.45em]">
                  {i > 0 && (
                    <span className="text-[0.7em] text-gold" aria-hidden="true">
                      ·
                    </span>
                  )}
                  {part}
                </span>
              ))}
            </p>
            <p
              data-fade
              data-intro
              className="mt-2 flex items-center gap-2 text-[0.7rem] tracking-[0.26em] text-ink/75 uppercase sm:text-xs"
            >
              <PinIcon />
              {venue.name}, {venue.city}
            </p>
          </div>
        </div>
      </div>
    </SceneSection>
  );
}
