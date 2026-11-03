import { useRef, type CSSProperties } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { layerUrl } from './assets';
import { DeityLayer } from './DeityLayer';
import type { DeityId, EyeRig } from './types';

interface BlinkingEyesProps {
  deity: DeityId;
  rig: EyeRig;
  /** Run the blink/glance loops. Pause when off-screen to save battery. */
  active: boolean;
  /** Reduced motion keeps the eyes still and open. */
  reducedMotion: boolean;
}

/**
 * Layered eyes: sclera → irises (masked by sclera) → lids (masked by sclera) → lines.
 * Blinks slide the lid down; glances slide the irises sideways. Transform-only, so it
 * stays on the compositor.
 */
export function BlinkingEyes({ deity, rig, active, reducedMotion }: BlinkingEyesProps) {
  const irisRef = useRef<HTMLImageElement>(null);
  const lidRef = useRef<HTMLImageElement>(null);
  const scleraUrl = layerUrl(deity, rig.sclera);

  useGSAP(
    () => {
      if (!active || reducedMotion) return;
      let blinkCall: gsap.core.Tween | null = null;
      let dartCall: gsap.core.Tween | null = null;
      let alive = true;

      const blink = () => {
        if (!alive || !lidRef.current) return;
        const travel = rig.blinkTravel * 100;
        const tl = gsap.timeline();
        tl.to(lidRef.current, { yPercent: travel, duration: 0.07, ease: 'power2.in' }).to(
          lidRef.current,
          { yPercent: 0, duration: 0.15, ease: 'power2.out' },
          '+=0.045',
        );
        if (Math.random() < 0.16) {
          tl.to(
            lidRef.current,
            { yPercent: travel, duration: 0.07, ease: 'power2.in' },
            '+=0.08',
          ).to(lidRef.current, { yPercent: 0, duration: 0.16, ease: 'power2.out' }, '+=0.04');
        }
        blinkCall = gsap.delayedCall(
          gsap.utils.random(rig.blinkEvery[0], rig.blinkEvery[1]),
          blink,
        );
      };

      const dart = () => {
        if (!alive || !irisRef.current || !rig.dart) return;
        const { range, hold } = rig.dart;
        // Mostly look left/right, sometimes return to centre — like a calm, living gaze.
        const choices = [-1, -0.6, 0, 0.6, 1];
        const target = choices[Math.floor(Math.random() * choices.length)] ?? 0;
        gsap.to(irisRef.current, {
          xPercent: target * range * 100,
          duration: gsap.utils.random(0.28, 0.42),
          ease: 'sine.inOut',
        });
        dartCall = gsap.delayedCall(gsap.utils.random(hold[0], hold[1]), dart);
      };

      blinkCall = gsap.delayedCall(gsap.utils.random(1.2, 2.6), blink);
      if (rig.dart) dartCall = gsap.delayedCall(gsap.utils.random(0.6, 1.4), dart);

      return () => {
        alive = false;
        blinkCall?.kill();
        dartCall?.kill();
        gsap.killTweensOf([lidRef.current, irisRef.current]);
      };
    },
    { dependencies: [active, reducedMotion, deity, rig] },
  );

  const mask: CSSProperties | undefined = scleraUrl
    ? {
        WebkitMaskImage: `url("${scleraUrl}")`,
        maskImage: `url("${scleraUrl}")`,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
      }
    : undefined;

  return (
    <>
      <DeityLayer deity={deity} name={rig.sclera} />
      <div className="pointer-events-none absolute inset-0" style={mask} aria-hidden="true">
        <DeityLayer ref={irisRef} deity={deity} name={rig.iris} />
        <DeityLayer ref={lidRef} deity={deity} name={rig.lid} />
      </div>
      {rig.lines && <DeityLayer deity={deity} name={rig.lines} optional />}
    </>
  );
}
