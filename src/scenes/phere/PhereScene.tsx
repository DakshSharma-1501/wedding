import { useRef } from 'react';
import { layerUrl } from '../../components/deity/assets';
import {
  AgniKund,
  MoonAndGanga,
  RangoliFloor,
  TempleBells,
  TrishulDamru,
} from '../../components/decor/PhereDecor';
import { SceneSection } from '../../components/scene/SceneSection';
import { wedding } from '../../data/config';
import { useBackdrop } from '../../hooks/useBackdrop';
import { useIdleLife } from '../../hooks/useIdleLife';
import { gsap, useGSAP } from '../../lib/gsap';
import { useExperience } from '../../store/experience';
import { deferSetup } from '../../lib/idle';

const copy = wedding.copy.phere;
const TAU = Math.PI * 2;
const ROUNDS = 7;

/* Scroll map (0–1 of the sticky range). */
const VARMALA_END = 0.11;
const PHERE_START = 0.14;
const PHERE_END = 0.86;
const START_ANGLE = 0.25; // Shiv's starting angle on the orbit (0 = front-centre)
const TRAIL = 0.62; // Parvati walks this many radians behind

const SPRITES = {
  shiv: layerUrl('shivparvati', 'shiv'),
  parvati: layerUrl('shivparvati', 'parvati'),
  nandi: layerUrl('shivparvati', 'nandi'),
  garland: layerUrl('shivparvati', 'garland'),
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

/**
 * Scene 4 — Shiv & Parvati's saat phere around the sacred agni.
 * One scrubbed timeline drives everything in onUpdate (transform/opacity writes only):
 * varmala exchange → seven rounds of the fire (behind it at the back of the orbit, in
 * front of it at the front, turning at the sides) → golden bloom.
 */
export function PhereScene() {
  const section = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const phase = useExperience((s) => s.phase);
  const reduced = useExperience((s) => s.reducedMotion);
  const live = phase === 'entering' || phase === 'revealed';

  useBackdrop(section, 'dusk');
  useIdleLife(stage, live && !reduced);

  useGSAP(
    (context) =>
      deferSetup(context, () => {
        const root = stage.current;
        const q = gsap.utils.selector(stage);
        const one = (sel: string) => q(sel)[0] as HTMLElement | undefined;
        const floor = one('[data-floor]');
        const shiv = one('[data-shiv]');
        const parvati = one('[data-parvati]');
        const g1 = one('[data-garland="1"]');
        const g2 = one('[data-garland="2"]');
        const cloth = q('[data-cloth]')[0];
        const counter = one('[data-counter]');
        const dots = q('[data-dot]');
        const vows = q('[data-vow]');
        if (!root || !floor || !shiv || !parvati || !g1 || !g2 || !cloth || !counter) return;

        let currentStep = -2;
        const showStep = (step: number) => {
          // step: -1 = varmala, 0..6 = phera, 7 = complete
          if (step === currentStep) return;
          currentStep = step;
          counter.textContent =
            step < 0
              ? 'Varmala'
              : step >= ROUNDS
                ? 'Saat Phere · complete'
                : `Phera ${step + 1} of ${ROUNDS}`;
          dots.forEach((d, i) =>
            d.classList.toggle('is-done', step >= 0 && i <= Math.min(step, ROUNDS - 1)),
          );
          vows.forEach((v, i) =>
            gsap.to(v, {
              autoAlpha: i === step + 1 ? 1 : 0,
              y: i === step + 1 ? 0 : 10,
              duration: 0.45,
              overwrite: true,
            }),
          );
        };

        const render = (p: number) => {
          const W = floor.clientWidth;
          const H = floor.clientHeight;
          const cx = W / 2;
          const cy = H * 0.52;
          const rx = W * 0.37;
          const ry = H * 0.36;
          const spriteH = W * 0.34;

          const walk = clamp01((p - PHERE_START) / (PHERE_END - PHERE_START));
          const theta = START_ANGLE + walk * ROUNDS * TAU;
          // Before the pheras the couple face each other for the varmala; then they turn to walk.
          const face = smooth(clamp01((p - VARMALA_END) / (PHERE_START - VARMALA_END)));

          const place = (el: HTMLElement, ang: number, faceEachOther: number) => {
            const sx = Math.sin(ang);
            const cz = Math.cos(ang);
            const depth = 0.8 + 0.2 * (cz * 0.5 + 0.5);
            const x = cx + rx * sx;
            const y =
              cy + ry * cz - Math.abs(Math.sin(ang * 9)) * 3 * (walk > 0 && walk < 1 ? 1 : 0);
            const walking = Math.max(-1, Math.min(1, cz * 2.6));
            const facing = faceEachOther * (1 - face) + walking * face;
            el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%) scale(${(depth * facing).toFixed(3)}, ${depth.toFixed(3)})`;
            el.style.zIndex = cz > -0.05 ? '30' : '10';
            return { x, y, depth, facing, h: spriteH * depth };
          };
          const s = place(shiv, theta, -1);
          const pv = place(parvati, theta - TRAIL, 1);

          // Gathbandhan: gold cloth from Shiv's waist to Parvati's hands.
          const ax = s.x;
          const ay = s.y - s.h * 0.45;
          const bx = pv.x + pv.facing * spriteH * 0.12;
          const by = pv.y - pv.h * 0.5;
          const mx = (ax + bx) / 2;
          const my = Math.max(ay, by) + 16;
          cloth.setAttribute(
            'd',
            `M${ax.toFixed(1)},${ay.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)}`,
          );
          cloth.parentElement?.style.setProperty('z-index', s.depth + pv.depth > 1.82 ? '29' : '9');
          cloth.parentElement?.style.setProperty(
            'opacity',
            String(smooth(clamp01((p - 0.1) / 0.04))),
          );

          // Varmala: each garland arcs from one partner's hands to the other's neck, then rides along.
          const t = smooth(clamp01((p - 0.025) / 0.07));
          const lerp = (a: number, b: number) => a + (b - a) * t;
          const arc = Math.sin(Math.PI * t) * spriteH * 0.35;
          const gSize = spriteH * 0.3;
          const neck = (f: { x: number; y: number; h: number }) => ({
            x: f.x,
            y: f.y - f.h * 0.72,
          });
          const hands = (f: { x: number; y: number; h: number; facing: number }) => ({
            x: f.x + f.facing * spriteH * 0.16,
            y: f.y - f.h * 0.48,
          });
          const placeGarland = (
            el: HTMLElement,
            from: { x: number; y: number },
            to: { x: number; y: number },
            depth: number,
            z: string,
          ) => {
            const x = lerp(from.x, to.x);
            const y = lerp(from.y, to.y) - arc;
            el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) scale(${(depth * (1 - 0.25 * t)).toFixed(3)})`;
            el.style.width = `${gSize.toFixed(1)}px`;
            el.style.zIndex = z;
          };
          placeGarland(g1, hands(pv), neck(s), s.depth, shiv.style.zIndex === '30' ? '31' : '11');
          placeGarland(
            g2,
            hands(s),
            neck(pv),
            pv.depth,
            parvati.style.zIndex === '30' ? '31' : '11',
          );

          const step =
            p < PHERE_START
              ? -1
              : walk >= 1
                ? ROUNDS
                : Math.min(ROUNDS - 1, Math.floor((theta - START_ANGLE) / TAU));
          showStep(step);
        };

        if (reduced) {
          // Calm fallback: one still pose — garlands exchanged, gathbandhan tied, no scroll play.
          render(PHERE_START - 0.005);
          const onResize = () => render(PHERE_START - 0.005);
          window.addEventListener('resize', onResize);
          return () => window.removeEventListener('resize', onResize);
        }
        render(0);
        gsap
          .timeline({
            scrollTrigger: {
              trigger: section.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              onUpdate: (self) => render(self.progress),
              onRefresh: (self) => render(self.progress),
            },
          })
          .fromTo(
            q('[data-bloom]'),
            { autoAlpha: 0, scale: 0.6 },
            { autoAlpha: 1, scale: 1.15, ease: 'power1.out', duration: 0.1 },
            0.88,
          )
          .fromTo(
            q('[data-closing]'),
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.07 },
            0.91,
          )
          .to(q('[data-vows]'), { autoAlpha: 0, duration: 0.04 }, 0.88)
          .to({}, { duration: 0.01 }, 0.99);

        gsap.fromTo(
          q('[data-phere-enter]'),
          { autoAlpha: 0, y: 80 },
          {
            autoAlpha: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section.current,
              start: 'top 80%',
              end: 'top top',
              scrub: true,
            },
          },
        );
      }),
    { scope: section, dependencies: [reduced] },
  );

  return (
    <SceneSection
      id="shivparvati"
      label="Saat phere — Shiv and Parvati's sacred union"
      className={reduced ? '' : 'h-[560svh]'}
    >
      <div ref={section} className="absolute inset-0" aria-hidden="true" />
      <div
        ref={stage}
        className={`${reduced ? 'relative' : 'sticky top-0'} h-[100dvh] overflow-hidden text-center text-cream`}
      >
        <MoonAndGanga className="pointer-events-none absolute top-0 right-0 w-[min(70vw,30rem)] opacity-90" />
        <TempleBells className="absolute inset-x-0 top-0 h-40" />

        <div data-phere-enter className="absolute inset-0">
          <header className="absolute inset-x-0 top-[calc(var(--safe-top)+4.25rem)] flex flex-col items-center px-6">
            <p lang="hi" className="font-deva text-[clamp(1.05rem,4vw,1.35rem)] text-champagne">
              ॥ सप्तपदी ॥
            </p>
            <h2 className="mt-1 font-display text-[clamp(2.1rem,8.5vw,3.4rem)] leading-none italic">
              {copy.title}
            </h2>
            <p
              data-counter
              aria-live="polite"
              className="mt-3 text-[0.68rem] tracking-[0.38em] text-champagne uppercase"
            >
              Varmala
            </p>
            <div className="mt-2.5 flex gap-2" aria-hidden="true">
              {copy.vows.map((v) => (
                <span
                  key={v}
                  data-dot
                  className="size-2 rounded-full border border-champagne/70 transition-colors duration-500 [&.is-done]:border-gold [&.is-done]:bg-gold [&.is-done]:shadow-[0_0_10px_2px_rgb(243_214_119/0.55)]"
                />
              ))}
            </div>
          </header>

          <div
            data-floor
            className="absolute top-[57%] left-1/2 w-[min(94vw,42rem)] -translate-x-1/2 -translate-y-1/2"
            style={{ aspectRatio: '2.1 / 1' }}
          >
            <RangoliFloor className="absolute inset-0 h-full w-full" />
            {SPRITES.nandi && (
              <img
                src={SPRITES.nandi}
                alt=""
                aria-hidden="true"
                className="absolute bottom-[-6%] left-[-4%] z-20 w-[27%] drop-shadow-[0_8px_10px_rgb(0_0_0/0.35)]"
              />
            )}
            <TrishulDamru className="absolute right-[2%] bottom-[30%] z-[5] h-[82%]" />
            <AgniKund className="absolute top-[52%] left-1/2 z-20 w-[22%] -translate-x-1/2 -translate-y-[60%]" />

            <svg
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              aria-hidden="true"
            >
              <path
                data-cloth
                d=""
                fill="none"
                stroke="#F3D677"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </svg>
            {SPRITES.shiv && (
              <img
                data-shiv
                src={SPRITES.shiv}
                alt="Shiv Ji"
                className="absolute top-0 left-0 h-auto w-[18.5%] origin-center drop-shadow-[0_6px_8px_rgb(0_0_0/0.35)]"
              />
            )}
            {SPRITES.parvati && (
              <img
                data-parvati
                src={SPRITES.parvati}
                alt="Parvati Ji"
                className="absolute top-0 left-0 h-auto w-[18.5%] origin-center drop-shadow-[0_6px_8px_rgb(0_0_0/0.35)]"
              />
            )}
            {SPRITES.garland && (
              <>
                <img
                  data-garland="1"
                  src={SPRITES.garland}
                  alt=""
                  aria-hidden="true"
                  className="absolute top-0 left-0"
                />
                <img
                  data-garland="2"
                  src={SPRITES.garland}
                  alt=""
                  aria-hidden="true"
                  className="absolute top-0 left-0"
                />
              </>
            )}
          </div>

          <div
            data-vows
            hidden={reduced}
            className="absolute inset-x-0 bottom-[calc(var(--safe-bottom)+2rem)] mx-auto h-24 max-w-md px-6"
          >
            <p
              data-vow
              className="absolute inset-x-6 top-0 font-display text-[clamp(1.2rem,4.6vw,1.6rem)] leading-snug text-balance text-cream/90 italic"
            >
              The exchange of garlands — a promise of acceptance.
            </p>
            {copy.vows.map((v, i) => (
              <p
                key={v}
                data-vow
                className="invisible absolute inset-x-6 top-0 font-display text-[clamp(1.2rem,4.6vw,1.6rem)] leading-snug text-balance text-cream/90 opacity-0"
              >
                <span className="mr-2 font-body text-[0.62em] tracking-[0.3em] text-champagne not-italic">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {v}
              </p>
            ))}
          </div>
        </div>

        <div
          data-bloom
          aria-hidden="true"
          className="pointer-events-none invisible absolute -inset-[20%] bg-[radial-gradient(closest-side,rgb(255_236_179/0.95),rgb(243_214_119/0.55)_40%,rgb(201_162_39/0.15)_70%,transparent)] opacity-0"
        />
        <p
          data-closing
          className="invisible absolute inset-x-6 top-1/2 -translate-y-1/2 font-display text-[clamp(2.6rem,11vw,5rem)] leading-tight text-balance text-[#5A3A08] italic opacity-0"
        >
          {copy.closing}
        </p>
      </div>
      {reduced && (
        <ol className="relative mx-auto max-w-md px-6 pb-16 text-left font-display text-lg text-cream/90">
          {copy.vows.map((v, i) => (
            <li key={v} className="mt-2">
              <span className="mr-2 text-champagne lining-nums">{i + 1}.</span>
              {v}
            </li>
          ))}
          <li className="mt-6 list-none text-center text-3xl italic">{copy.closing}</li>
        </ol>
      )}
    </SceneSection>
  );
}
