# Wedding invitation — design record

**Date:** 2026-11-03 · **Status:** All scenes (0–7) built.
**Source of requirements:** the user's brief, used as the approved spec. This file records
the decisions taken while implementing it, so later scenes stay consistent.

## Architecture decisions

1. **Deities are layered DOM images, not WebGL planes.** They stay crisp at iPhone 3× DPR
   (the canvas is capped at 1.5×), work without WebGL, are accessible, and the art is
   drop-in replaceable (`src/assets/deities/<deity>/<layer>.{avif,webp,png,svg}`, best
   format wins). Per-layer motion is GSAP transform-only. Eyes are masked by the eye-white
   shape; blink means the lid slides down, glance means the irises slide sideways.
2. **One persistent fixed WebGL canvas** behind the DOM (`z-0`; content `z-10`) holds the
   particle fields (instanced petals, point sparkles; feathers and embers next). Fields fade
   by `activeScene`; motion lives in shaders; scroll velocity feeds uniforms.
3. **Scroll engine:** Lenis for wheel only (`syncTouch: false`) + ScrollTrigger. A mutable
   `scrollState` is written every GSAP tick for rAF consumers; zustand holds low-frequency
   UI state (phase, mute, quality, active scene).
4. **Intro phases:** `loading → sealed → opening → entering → revealed`. The overlay owns
   scroll lock and touch blocking. Scene 1's entrance keys off `entering`.
5. **Performance budget:** three.js loads only after the seal breaks (prefetched on first
   pointer intent). Scenes mount one task after the envelope paints. The static boot screen
   shows the names (LCP before JS). Quality tiers (`budget.ts`) are stepped by drei's
   PerformanceMonitor.
6. **Fallbacks:** reduced motion → native scroll, no WebGL, fades only. No WebGL, or a
   context error/loss → static CSS backdrop.
7. **Design tokens:** Tailwind v4 `@theme` in `src/styles/index.css`. Gold text uses
   `gold-deep #8C6A12` (4.6:1 on cream). Bright gold `#C9A227` is reserved for ornament.

## Gotchas found while building

- GSAP folds CSS `rotate`/`scale` properties into its matrix. Never put Tailwind
  rotate/scale on an element GSAP animates; use a static wrapper.
- Fading a wrapper creates a stacking context; the envelope parts are animated
  individually because the card is z-sandwiched between them.
- Unlayered custom CSS beats Tailwind utilities, so component classes that set
  `position` belong in `@layer components`.
- Keep the OG image a JPEG under 300 KB for WhatsApp previews.

## Decisions from Scenes 2–7 (and the scroll-lag investigation)

8. **Pinned scenes are CSS sticky**, driven by ScrollTrigger progress (no JS pin), so
   there's no jitter with iOS momentum scrolling.
9. **Dark scenes are silk curtains**: fixed 150lvh layers with feathered edges under the
   canvas, translated so the edge tracks each section boundary. They must start fully
   below and end fully above, or a soft tail lingers on screen.
10. **Idle motion is CSS keyframes on HTML elements** gated by `data-idle`, so it runs
    on the compositor. GSAP is for one-time choreography and scroll scrubbing only.
11. **Never read layout in the GSAP ticker** (e.g. `window.scrollY`). Use Lenis's value
    or a cached scroll-event value.
12. **Scenes 2–7 mount one per idle slot at a calm moment** (7 s after load, 1.2 s after
    reveal, or first scroll), and each scene's GSAP setup runs in the next idle slot
    (`deferSetup`). Their first style/layout (~200 ms at 1×) can only be moved, not removed.
13. **Lazy chunks sit inside an error boundary** with a retry, never a blank page.
14. **Content-critical logic is unit-tested** (.ics, RSVP message/link, countdown).

## Measured results

- Wheel latency to 90%: 466 → 290 ms. Paints: 913 → 172 per 3.5 s. Idle layerize: 489 → 6 ms.
- Lighthouse mobile: median 90 (86–93), TBT ~250 ms (was ~6 s right after Scenes 2–7 landed).
