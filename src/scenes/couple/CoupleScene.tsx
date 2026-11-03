import { useCallback, useRef, useState } from 'react';
import { Ornament } from '../../components/decor/Ornament';
import { SceneSection } from '../../components/scene/SceneSection';
import { GalleryArt } from '../../components/ui/GalleryArt';
import { Lightbox } from '../../components/ui/Lightbox';
import { wedding } from '../../data/config';
import { useIdleLife } from '../../hooks/useIdleLife';
import { cn } from '../../lib/cn';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { useExperience } from '../../store/experience';
import { gallery, heroIllustration, heroPhoto } from './photos';
import { deferSetup } from '../../lib/idle';

const { couple, copy } = wedding;
const TILT = ['-rotate-2', 'rotate-1', 'rotate-2', '-rotate-1', 'rotate-1', '-rotate-2'];

/**
 * Scene 5 — the couple. Arched hero (illustration until hero.webp exists), "Our story",
 * and a polaroid / arched-frame gallery with per-column parallax and a lightbox.
 */
export function CoupleScene() {
  const scope = useRef<HTMLDivElement>(null);
  const phase = useExperience((s) => s.phase);
  const reduced = useExperience((s) => s.reducedMotion);
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useIdleLife(scope, (phase === 'entering' || phase === 'revealed') && !reduced);

  useGSAP(
    (context) =>
      deferSetup(context, () => {
        if (reduced) return;
        const q = gsap.utils.selector(scope);
        gsap.fromTo(
          q('[data-couple-hero]'),
          { autoAlpha: 0, y: 60, clipPath: 'inset(18% 10% 0% 10% round 999px 999px 24px 24px)' },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0% round 999px 999px 24px 24px)',
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: { trigger: q('[data-couple-hero]')[0], start: 'top 85%', once: true },
          },
        );
        gsap.set(q('[data-reveal-up]'), { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(q('[data-reveal-up]'), {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' }),
        });
        // Gentle per-column parallax on the gallery.
        q('[data-gallery-item]').forEach((el, i) => {
          const speed = [-10, 6, -4][i % 3] ?? 0;
          gsap.fromTo(
            el,
            { yPercent: -speed / 2 },
            {
              yPercent: speed,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });
      }),
    { scope, dependencies: [reduced] },
  );

  return (
    <SceneSection
      id="couple"
      label="The couple"
      className="px-5 pt-[clamp(6rem,18svh,11rem)] pb-[clamp(4rem,10svh,7rem)]"
    >
      <div ref={scope} className="mx-auto max-w-6xl">
        <header className="flex flex-col items-center text-center" data-reveal-up>
          <p className="text-[0.68rem] tracking-[0.42em] text-teal uppercase">The couple</p>
          <h2 className="mt-3 font-display text-[clamp(2.6rem,10vw,4.6rem)] leading-none font-medium">
            <span className="foil">{couple.bride.firstName}</span>{' '}
            <span className="font-normal text-teal italic">&amp;</span>{' '}
            <span className="foil">{couple.groom.firstName}</span>
          </h2>
          <Ornament className="mt-5" />
        </header>

        <div className="mt-12 grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <figure
            data-couple-hero
            className="relative mx-auto w-[min(82vw,25rem)] overflow-hidden rounded-t-full rounded-b-3xl border border-gold/50 bg-[radial-gradient(ellipse_at_50%_40%,#fff8e6,#f3e6c8)] shadow-[0_30px_60px_-30px_rgb(107_78_12/0.55)]"
            style={{ aspectRatio: '4 / 5' }}
          >
            {heroPhoto ? (
              <img
                src={heroPhoto}
                alt={`${couple.bride.firstName} and ${couple.groom.firstName}`}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <img
                src={heroIllustration}
                alt={`Illustration of ${couple.bride.firstName} and ${couple.groom.firstName} in wedding attire, hands joined under a floral arch`}
                className="idle-float-slow absolute inset-[4%] h-[92%] w-[92%] object-contain"
                loading="lazy"
                decoding="async"
              />
            )}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-2 rounded-t-full rounded-b-[1.25rem] border border-gold/40"
            />
          </figure>

          <div className="text-center md:text-left">
            <h3
              data-reveal-up
              className="font-display text-[clamp(2rem,7vw,3rem)] text-peacock italic"
            >
              {copy.story.heading}
            </h3>
            {copy.story.paragraphs.map((p) => (
              <p
                key={p}
                data-reveal-up
                className="mx-auto mt-5 max-w-md text-[1.02rem] leading-relaxed text-ink/80 md:mx-0"
              >
                {p}
              </p>
            ))}
            <p data-reveal-up className="mt-6 font-display text-xl text-gold-deep italic">
              — {couple.bride.firstName} &amp; {couple.groom.firstName}
            </p>
          </div>
        </div>

        <div className="mt-20 md:mt-28">
          <p
            data-reveal-up
            className="text-center text-[0.68rem] tracking-[0.42em] text-teal uppercase"
          >
            Moments
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-8 md:gap-y-12">
            {gallery.map((item, i) => (
              <li key={`${item.caption}-${i}`} data-gallery-item>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Open photo: ${item.caption}`}
                  className={cn(
                    'group block w-full transition-transform duration-500 hover:-translate-y-1 focus-visible:-translate-y-1',
                    TILT[i % TILT.length],
                  )}
                >
                  {item.shape === 'polaroid' ? (
                    <span className="block bg-white p-2 pb-9 shadow-[0_16px_34px_-18px_rgb(30_27_22/0.5)] sm:p-3 sm:pb-11">
                      <span className="block aspect-square overflow-hidden">
                        <GalleryArt item={item} />
                      </span>
                      <span className="mt-2 block font-display text-[0.95rem] text-ink/75 italic sm:text-lg">
                        {item.caption}
                      </span>
                    </span>
                  ) : (
                    <span className="block">
                      <span className="block aspect-[3/4] overflow-hidden rounded-t-full border-[3px] border-white shadow-[0_16px_34px_-18px_rgb(30_27_22/0.5)] outline outline-1 outline-gold/50">
                        <GalleryArt item={item} />
                      </span>
                      <span className="mt-2 block font-display text-[0.95rem] text-ink/75 italic sm:text-lg">
                        {item.caption}
                      </span>
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Lightbox items={gallery} index={open} onClose={close} onIndex={setOpen} />
    </SceneSection>
  );
}
