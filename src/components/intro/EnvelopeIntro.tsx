import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { wedding } from '../../data/config';
import { useViewport } from '../../hooks/useViewport';
import { inviteAudio } from '../../lib/audio';
import { gsap, useGSAP } from '../../lib/gsap';
import { createRng } from '../../lib/random';
import { lockScroll, scrollToTop, unlockScroll } from '../../lib/scroll';
import { useExperience } from '../../store/experience';
import { Ornament } from '../decor/Ornament';
import { EnvelopeBack, EnvelopePocket, FlapFace } from './EnvelopeParts';
import { WaxSeal } from './WaxSeal';

const { couple, dates } = wedding;
/** How far the card slides out, as a fraction of its own height. */
const RISE = 0.5;

/** Isolated so progress ticks re-render one text node, not the envelope. */
function LoadPercent() {
  const progress = useExperience((s) => s.loadProgress);
  return <>{Math.round(progress * 100)}%</>;
}

/** Envelope size for the current screen: portrait envelope on phones, landscape on laptops. */
function envelopeLayout(vw: number, vh: number) {
  const portrait = vh > vw * 1.1;
  const ratio = portrait ? 0.74 : 1.48;
  let w = portrait ? Math.min(vw * 0.84, 400) : Math.min(vw * 0.6, 680);
  let h = w / ratio;
  const maxH = vh * (portrait ? 0.56 : 0.54);
  if (h > maxH) {
    h = maxH;
    w = h * ratio;
  }
  w = Math.round(w);
  h = Math.round(h);
  const flapH = Math.round(h * (portrait ? 0.5 : 0.58));
  const seal = Math.round(Math.min(132, Math.max(88, w * (portrait ? 0.34 : 0.2))));
  return { w, h, flapH, seal, portrait };
}

const DUST = (() => {
  const rng = createRng(5);
  return Array.from({ length: 18 }, () => ({
    x: rng() * 100,
    y: rng() * 100,
    size: 6 + rng() * 9,
    delay: rng() * 3.2,
  }));
})();

const FLECKS = Array.from({ length: 14 }, (_, i) => i);

/**
 * Scene 0 — the sealed envelope. Doubles as the preloader (gold ring around the seal),
 * then on tap: seal cracks & lifts → flap opens in 3D → card slides out → card flies
 * past the camera into Scene 1.
 */
export function EnvelopeIntro() {
  const phase = useExperience((s) => s.phase);
  const reduced = useExperience((s) => s.reducedMotion);
  const setPhase = useExperience((s) => s.setPhase);
  const { width: vw, height: vh } = useViewport();
  const L = envelopeLayout(vw, vh);
  const root = useRef<HTMLDivElement>(null);
  const ready = phase === 'sealed';
  const cardW = L.w * 0.9;

  useEffect(() => {
    lockScroll();
    scrollToTop();
    const el = root.current;
    if (!el) return;
    // iOS ignores overflow:hidden on body for touch; stop the gesture at the overlay.
    const stop = (e: TouchEvent) => e.preventDefault();
    el.addEventListener('touchmove', stop, { passive: false });
    return () => el.removeEventListener('touchmove', stop);
  }, []);

  useGSAP(
    () => {
      // Also bail once the overlay has unmounted (e.g. reduced-motion toggled later).
      if (reduced || !root.current) return;
      gsap.from('[data-env-wrap]', {
        autoAlpha: 0,
        y: 36,
        scale: 0.95,
        duration: 1.6,
        ease: 'expo.out',
        delay: 0.1,
      });
      gsap.from('[data-env-title] > *', {
        autoAlpha: 0,
        y: 12,
        duration: 1.3,
        stagger: 0.12,
        ease: 'expo.out',
        delay: 0.35,
      });
      gsap.fromTo(
        '[data-seal-shine]',
        { x: 0 },
        { x: 220, duration: 1.7, ease: 'power2.inOut', repeat: -1, repeatDelay: 2.6, delay: 1.2 },
      );
    },
    { scope: root, dependencies: [reduced] },
  );

  // Plain event handler (not render-time), so reading refs here is safe.
  function open() {
    if (useExperience.getState().phase !== 'sealed') return;
    inviteAudio.unlock(useExperience.getState().muted);
    inviteAudio.playIntro();
    setPhase('opening');

    const q = gsap.utils.selector(root);
    const finish = () => {
      unlockScroll();
      setPhase('revealed');
    };

    if (reduced) {
      gsap
        .timeline({ onComplete: finish })
        .call(() => setPhase('entering'))
        .to(root.current, { autoAlpha: 0, duration: 0.9, ease: 'power1.out' });
      return;
    }

    const card = q('[data-env-card]')[0];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const risenCenterY = rect.top + rect.height / 2 - rect.height * RISE;
    const dx = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const dy = window.innerHeight / 2 - risenCenterY;
    const scale = Math.max(window.innerWidth / rect.width, window.innerHeight / rect.height) * 1.1;

    gsap
      .timeline({ onComplete: finish })
      .to(q('[data-env-hint], [data-env-title]'), { autoAlpha: 0, duration: 0.45 }, 0)
      .to(q('[data-seal-pulse]'), { autoAlpha: 0, duration: 0.2 }, 0)
      // press, crack, split
      .to(q('[data-seal]'), { scale: 0.93, duration: 0.12, ease: 'power2.in' }, 0)
      .to(q('[data-seal]'), { scale: 1.05, duration: 0.4, ease: 'back.out(3)' }, 0.12)
      .to(q('[data-seal-crack]'), { strokeDashoffset: 0, duration: 0.28, ease: 'power3.out' }, 0.1)
      .to(
        q('[data-seal-half="left"]'),
        { rotation: -15, x: -9, y: 4, svgOrigin: '0 52', duration: 0.65, ease: 'power2.out' },
        0.38,
      )
      .to(
        q('[data-seal-half="right"]'),
        { rotation: 15, x: 9, y: 4, svgOrigin: '0 52', duration: 0.65, ease: 'power2.out' },
        0.38,
      )
      .to(q('[data-seal-crack]'), { autoAlpha: 0, duration: 0.2 }, 0.42)
      .set(q('[data-fleck]'), { autoAlpha: 1 }, 0.36)
      .to(
        q('[data-fleck]'),
        {
          x: () => gsap.utils.random(-L.seal, L.seal),
          y: () => gsap.utils.random(-L.seal * 0.9, L.seal * 0.6),
          rotation: () => gsap.utils.random(-180, 180),
          scale: () => gsap.utils.random(0.4, 1.1),
          autoAlpha: 0,
          duration: () => gsap.utils.random(0.6, 1.1),
          ease: 'power3.out',
        },
        0.37,
      )
      // the seal lifts away
      .to(
        q('[data-seal]'),
        { y: -38, scale: 1.14, autoAlpha: 0, duration: 0.6, ease: 'power2.in' },
        0.8,
      )
      // flap opens in 3D (z-order swaps once it passes vertical)
      .set(q('[data-card-content]'), { autoAlpha: 1 }, 0.9)
      .to(q('[data-env-flap]'), { rotationX: 180, duration: 1.15, ease: 'power2.inOut' }, 0.95)
      .set(q('[data-env-flap]'), { zIndex: 1 }, 1.52)
      // card slides out
      .to(q('[data-env-card]'), { yPercent: -RISE * 100, duration: 1.2, ease: 'power3.out' }, 1.85)
      // Envelope pieces drop away individually — fading a shared wrapper would make it a
      // stacking context and pop the sandwiched card in front of the pocket.
      .to(
        q('[data-env-part]'),
        { y: () => window.innerHeight * 0.6, autoAlpha: 0, duration: 1.05, ease: 'power2.in' },
        2.6,
      )
      .addLabel('zoom', 2.95)
      .to(
        q('[data-env-card]'),
        { x: dx, y: dy, scale, duration: 1.4, ease: 'power3.inOut' },
        'zoom',
      )
      // by now the pocket has fallen clear, so lifting the card's z-order is invisible
      .set(q('[data-env-card]'), { zIndex: 8 }, 'zoom+=0.35')
      .call(() => setPhase('entering'), [], 'zoom+=0.4')
      .to(q('[data-card-content]'), { autoAlpha: 0, duration: 0.5 }, 'zoom+=0.5')
      .to(q('[data-env-bg]'), { autoAlpha: 0, duration: 1, ease: 'power1.inOut' }, 'zoom+=0.55')
      .to(q('[data-env-card]'), { autoAlpha: 0, duration: 0.65, ease: 'power1.in' }, 'zoom+=0.8');
  }

  if (phase === 'revealed') return null;

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={`Wedding invitation of ${couple.bride.firstName} and ${couple.groom.firstName}`}
      className="fixed inset-0 z-80 h-dvh touch-none overflow-hidden select-none"
    >
      <div
        data-env-bg
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#FCF9F2_0%,#F3EBDD_62%,#E9DCC4_100%)]"
      >
        {DUST.map((d) => (
          <svg
            key={`${d.x}-${d.y}`}
            viewBox="-10 -10 20 20"
            className="glint absolute"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: d.size,
              height: d.size,
              animationDelay: `${d.delay}s`,
            }}
            aria-hidden="true"
          >
            <path
              d="M0,-10 C1,-2 2,-1 10,0 C2,1 1,2 0,10 C-1,2 -2,1 -10,0 C-2,-1 -1,-2 0,-10 Z"
              fill="#C9A227"
              fillOpacity="0.55"
            />
          </svg>
        ))}
      </div>

      <div
        className="relative flex h-full flex-col items-center justify-center px-6"
        style={{ paddingTop: L.flapH * 0.35 }}
      >
        <div
          data-env-title
          className="mb-[clamp(1.25rem,4svh,2.25rem)] flex flex-col items-center text-center"
        >
          <p lang="hi" className="font-deva text-[clamp(1rem,3.8vw,1.3rem)] text-gold-deep">
            ॥ शुभ विवाह ॥
          </p>
          <p className="mt-2 text-[0.62rem] font-light tracking-[0.42em] text-ink/75 uppercase">
            The wedding of
          </p>
          <p className="mt-1 font-display text-[clamp(1.6rem,6.4vw,2.3rem)] font-medium text-peacock">
            {couple.bride.firstName}{' '}
            <span className="font-normal text-gold-deep italic">&amp;</span>{' '}
            {couple.groom.firstName}
          </p>
        </div>

        <div
          data-env-wrap
          className="relative cursor-pointer"
          style={{ width: L.w, height: L.h }}
          onClick={open}
        >
          {/* No wrapper around the parts: the card is z-sandwiched between them. */}
          <div
            data-env-part
            className="absolute inset-0 rounded-md shadow-[0_34px_60px_-22px_rgb(70_50_12/0.45),0_10px_24px_-12px_rgb(70_50_12/0.3)]"
            aria-hidden="true"
          />
          <div data-env-part className="absolute inset-0 z-0">
            <EnvelopeBack w={L.w} h={L.h} />
          </div>
          <div data-env-part className="pointer-events-none absolute inset-0 z-3">
            <EnvelopePocket w={L.w} h={L.h} flapH={L.flapH} />
          </div>
          <div>
            <div
              data-env-flap
              data-env-part
              className="absolute inset-x-0 top-0 z-5"
              style={{ height: L.flapH, transformOrigin: '50% 0%', transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 [-webkit-backface-visibility:hidden] backface-hidden">
                <FlapFace w={L.w} h={L.flapH} side="front" />
              </div>
              <div
                className="absolute inset-0 [-webkit-backface-visibility:hidden] backface-hidden"
                style={{ transform: 'rotateX(180deg)' }}
              >
                <FlapFace w={L.w} h={L.flapH} side="back" />
              </div>
            </div>

            {FLECKS.map((i) => (
              <span
                key={i}
                data-fleck
                aria-hidden="true"
                className="pointer-events-none absolute z-7 rounded-full bg-[radial-gradient(circle_at_35%_30%,#F6DA7E,#A9821B)] opacity-0"
                style={{
                  width: 4 + (i % 4) * 2,
                  height: 4 + (i % 4) * 2,
                  left: L.w / 2,
                  top: L.flapH,
                }}
              />
            ))}

            <button
              type="button"
              data-seal
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              disabled={!ready}
              // The name starts with the visible monogram (WCAG "label in name").
              aria-label={`${couple.monogram.bride}&${couple.monogram.groom} — ${
                ready ? 'break the seal to open the invitation' : 'preparing your invitation'
              }`}
              className="absolute z-6 rounded-full transition-transform duration-500 enabled:hover:scale-[1.04] disabled:cursor-progress"
              style={{
                width: L.seal,
                height: L.seal,
                left: L.w / 2 - L.seal / 2,
                top: L.flapH - L.seal / 2,
              }}
            >
              {ready && !reduced && (
                <>
                  <span
                    data-seal-pulse
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-[-6%] animate-[seal-pulse_2.4s_ease-out_infinite] rounded-full border border-gold/70"
                  />
                  <span
                    data-seal-pulse
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-[-6%] animate-[seal-pulse_2.4s_ease-out_1.2s_infinite] rounded-full border border-gold/50"
                  />
                </>
              )}
              <WaxSeal
                bride={couple.monogram.bride}
                groom={couple.monogram.groom}
                ready={ready || phase === 'opening'}
              />
            </button>
          </div>

          <div
            data-env-card
            className="absolute z-2 overflow-hidden rounded-[3px] bg-[#FCF8F0] shadow-[0_6px_24px_-10px_rgb(70_50_12/0.35)]"
            style={{ left: '5%', top: '4%', width: '90%', height: '90%' }}
          >
            {/* Hidden until the flap lifts (it's inside the envelope anyway) — also keeps this
                big text block from being picked as the page's LCP element. */}
            <div
              data-card-content
              className="invisible absolute inset-0 flex flex-col items-center justify-center text-center opacity-0"
              style={{ fontSize: cardW * 0.01 }}
            >
              <div className="absolute inset-[3.5%] border border-gold/55" aria-hidden="true" />
              <div className="absolute inset-[5%] border border-gold/25" aria-hidden="true" />
              <p lang="hi" className="font-deva text-gold-deep" style={{ fontSize: '4.8em' }}>
                ॥ शुभ विवाह ॥
              </p>
              <p
                className="foil mt-[0.08em] font-display font-medium italic"
                style={{ fontSize: L.portrait ? '20em' : '15em', lineHeight: 1.05 }}
              >
                {couple.monogram.bride}
                <span className="text-[0.62em]">&amp;</span>
                {couple.monogram.groom}
              </p>
              <p
                className="mt-[1.6em] font-light tracking-[0.36em] text-ink/70 uppercase"
                style={{ fontSize: '3.1em' }}
              >
                You are invited
              </p>
              <Ornament variant="small" className="my-[3.5em] h-[3em] w-[30em]" />
              <p className="font-display font-medium text-peacock" style={{ fontSize: '5.6em' }}>
                {dates.teaser}
              </p>
            </div>
          </div>
        </div>

        <div data-env-hint className="mt-[clamp(1.5rem,5svh,2.75rem)] h-6" aria-live="polite">
          <AnimatePresence mode="wait">
            {ready ? (
              <m.p
                key="tap"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="animate-[hint-breathe_2.4s_ease-in-out_infinite] text-[0.68rem] tracking-[0.42em] text-gold-deep uppercase"
              >
                Tap the seal to open
              </m.p>
            ) : phase === 'loading' ? (
              <m.p
                key="load"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                className="text-[0.66rem] tracking-[0.36em] text-ink/75 uppercase tabular-nums"
              >
                Preparing your invitation · <LoadPercent />
              </m.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
