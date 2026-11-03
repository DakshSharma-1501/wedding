import Lenis from 'lenis';
import type { SceneId } from '../data/types';
import { gsap, ScrollTrigger } from './gsap';

/**
 * Per-frame scroll values. Deliberately a plain mutable object, not React/zustand
 * state: Three.js fields and DOM writers read it inside rAF without re-rendering.
 */
export const scrollState = {
  y: 0,
  /** 0–1 over the whole document. */
  progress: 0,
  /** Smoothed px/s, positive when scrolling down. */
  velocity: 0,
  /** 0–1 progress of each scene from "top hits bottom of viewport" to "bottom leaves top". */
  scenes: {} as Partial<Record<SceneId, number>>,
};

let lenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

/**
 * Lenis smooths wheel/trackpad only. Touch keeps native momentum scrolling
 * (`syncTouch: false`), which is what feels right — and stays glitch-free — on iOS Safari.
 */
export function startScrollEngine({ smooth }: { smooth: boolean }): () => void {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  ScrollTrigger.config({ ignoreMobileResize: true });

  if (smooth) {
    lenis = new Lenis({
      autoRaf: false,
      // 0.15 ≈ 90% of a wheel gesture in ~250 ms: a glide that still answers immediately.
      // (0.09 measured 466 ms to 90% and felt laggy.)
      lerp: 0.15,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
  }

  let max = 1;
  const measure = () => {
    max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  };
  measure();
  ScrollTrigger.addEventListener('refresh', measure);
  const ro = new ResizeObserver(measure);
  ro.observe(document.body);

  // Never read window.scrollY inside the ticker: GSAP has just written styles this frame,
  // so that read would force a synchronous style+layout of the whole page every frame
  // (measured: ~1,900 forced recalcs in a 14 s load). Lenis keeps its own scroll value
  // (it also tracks native touch scrolling); without Lenis, cache it from scroll events.
  let nativeY = window.scrollY;
  const onNativeScroll = () => {
    nativeY = window.scrollY;
  };
  if (!lenis) window.addEventListener('scroll', onNativeScroll, { passive: true });

  let lastY = nativeY;
  const tick = (time: number, deltaMs: number) => {
    lenis?.raf(time * 1000);
    const y = lenis ? lenis.scroll : nativeY;
    const dt = Math.max(deltaMs, 1) / 1000;
    const instant = (y - lastY) / dt;
    scrollState.velocity += (instant - scrollState.velocity) * Math.min(1, dt * 8);
    lastY = y;
    scrollState.y = y;
    scrollState.progress = Math.min(1, Math.max(0, y / max));
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    window.removeEventListener('scroll', onNativeScroll);
    ScrollTrigger.removeEventListener('refresh', measure);
    ro.disconnect();
    lenis?.destroy();
    lenis = null;
  };
}

export function lockScroll(): void {
  document.documentElement.classList.add('scroll-locked');
  lenis?.stop();
}

export function unlockScroll(): void {
  document.documentElement.classList.remove('scroll-locked');
  lenis?.start();
  ScrollTrigger.refresh();
}

export function scrollToTop(): void {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}
