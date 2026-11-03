# Shubh Vivah: a cinematic wedding invitation

A scroll-driven Indian wedding invitation website: a wax-sealed envelope that opens in 3D,
then a sequence of devotional and celebration scenes in peacock-feather tones on cream.
It's frontend only, built with TypeScript, and deploys as a static site.

**Stack:** Vite 8 · React 19 · TypeScript (strict) · Three.js via @react-three/fiber + drei ·
GSAP + ScrollTrigger · Lenis · Tailwind CSS 4 · Framer Motion (small UI bits) · zustand ·
Vitest · self-hosted fonts (Cormorant Garamond, Poppins, Tiro Devanagari Hindi).

| #   | Scene                     | Highlights                                                                                                                                                                                                                                                                                    |
| --- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | **Envelope**              | Preload ring around the seal, embossed ginkgo paper, peacock liner, the seal cracks and lifts, the flap opens in 3D, the card flies past the camera, temple-bell chime                                                                                                                        |
| 1   | **Shri Ganesh Ji**        | Marigold toran, jharokha arch, layered Ganesh (float, ear flap, trunk sway, blink), breathing halo, diyas, marigold petals (WebGL)                                                                                                                                                            |
| 2   | **Shreenathji**           | Pinned scroll hero: Nathdwara pichwai, glancing and blinking lotus eyes, smiling lips, falling and twirling WebGL peacock feathers, blurred foreground feather, flute, lotus-pond ripples, camera dolly, three-line blessing                                                                  |
| 3   | **Maa Kali**              | Indigo-to-teal night, ring of golden flame, breathing figure, swaying hair and hibiscus garland, rising gold embers, blessing rays blooming from the abhaya hand on scroll                                                                                                                    |
| 4   | **Saat Phere**            | Varmala exchange, then Shiv and Parvati walk 7 rounds around the agni (behind it at the back, turning at the sides), gold gathbandhan, "Phera n of 7" + the seven vows, Nandi, trishul + damru, Ganga and moon, temple bells, rose petals and sparks, golden bloom: "Two souls, one journey." |
| 5   | **The couple**            | Arched hero (illustration until you add a photo), "Our story", polaroid/arch gallery with parallax and a lightbox                                                                                                                                                                             |
| 6   | **Itinerary**             | Live countdown, self-drawing timeline, event cards with **Add to calendar (.ics)** and **Directions**                                                                                                                                                                                         |
| 7   | **Venue · RSVP · footer** | Click-to-load Google map, WhatsApp RSVP form, family blessing, monogram, hashtag                                                                                                                                                                                                              |

Scene transitions: the dark scenes rise and fall like **silk curtains** (feathered edges
that track the section boundary), returning to cream at the couple scene.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run dev:mobile   # also on your LAN — open the printed URL on your phone
```

| Script                                  | What it does                                                    |
| --------------------------------------- | --------------------------------------------------------------- |
| `npm run build`                         | Type-check + production build into `dist/`                      |
| `npm run preview` / `preview:mobile`    | Serve the production build (port 4173)                          |
| `npm test`                              | Unit tests (calendar files, RSVP message/link, countdown maths) |
| `npm run lint` · `typecheck` · `format` | ESLint (strict, no `any`) · `tsc` · Prettier                    |

Requires Node 20+.

---

## 1. Edit the content: two files

**`src/data/config.ts`** holds everything guests read:

- `couple`: names, the **monogram** letters (seal, favicon, footer), hashtag
- `families`: surnames + blessing line (footer)
- `invocation`: the Devanagari line above Ganesh Ji
- `copy`: scene words: Shreenathji and Maa Kali mantras/blessings, the **seven vows**,
  the closing line, "Our story"
- `dates`: teaser line + countdown target
- `venue`: name, address, Google Maps search query (no API key needed)
- `rsvp`: WhatsApp number (digits only, with country code), message template (`{name}`),
  reply-by date
- `audio`: optional files (see §3)
- `site`: production URL, title, description, share image. These feed the `<title>`,
  OpenGraph/Twitter tags and the static boot screen at build time.

**`src/data/events.ts`** holds the itinerary (typed): times in IST, the label guests see,
a dress code, and optionally a different venue per event.

> Aarohi & Vihaan, Rajmahal Gardens, the phone number and the story are **placeholders**.

---

## 2. Replace the artwork

Full guide: **[`src/assets/deities/README.md`](src/assets/deities/README.md)**. In short:

- Each deity is a stack of **same-size transparent layers** (body, head, eyes, eyelids,
  lips, halo…). Drop `body.webp` next to `body.svg` and it **wins automatically**
  (`avif > webp > png > svg`); no code edits.
- Animation pivots, blink and glance timing, and which layer sways live in each rig file
  (`src/scenes/*/<deity>.rig.ts`).
- Shiv, Parvati, Nandi and the varmala are cut-out sprites (they walk around the fire).

Couple photos: drop `hero.webp` and `gallery-01.jpg`, … into `src/assets/couple/`
(see the README there).

Placeholder art is generated by `node tools/placeholder-art/<name>.mjs` (`ganesh`,
`shreenathji`, `kali`, `shivparvati`, `couple`). Preview a layer stack at
`/tools/placeholder-art/preview.html?d=kali&bg=18204F&ar=600/760` on the dev server.

### Share image & home-screen icon

`public/og-image.jpg` (1200×630) and `public/apple-touch-icon.png` (180×180) are rendered
from `tools/og/index.html`, which reads `config.ts`. After changing names, open
`http://localhost:3000/tools/og/` and screenshot `#og` and `#icon`, or replace both files.
Keep the OG image a **JPEG under 300 KB**, or WhatsApp may skip the preview.

---

## 3. Audio

Nothing is required: the seal breaking plays a **synthesized temple-bell chime** (Web
Audio). To use files, put them in `public/audio/` and set:

```ts
audio: { intro: '/audio/bell.mp3', background: '/audio/shehnai.mp3', volume: 0.6 },
```

Use MP3/AAC; loops of 60–120 s at 96–128 kbps. Sound starts only after the guest's tap
(a browser rule), the top-right toggle remembers mute, and audio pauses in background
tabs. Only use music you have rights to.

## 4. RSVP & calendar (no backend)

- **RSVP** opens WhatsApp (`wa.me/<number>?text=…`) with the guest's name, attendance,
  party size and note pre-filled. Nothing is stored on the site.
- **Add to calendar** builds an RFC 5545 `.ics` file in the browser (UTC times, escaped
  and folded lines). On iPhone/Android it opens the "add event" sheet.

---

## 5. Deploy

It's a static site; the output is `dist/`.

- **Vercel:** import the repo. It auto-detects Vite (build `npm run build`, output `dist`).
- **Netlify:** import the repo. `netlify.toml` is included, with long-cache headers for
  hashed assets.
- **Anything else:** run `npm run build` and upload `dist/` to any static host.

Before going live, set `site.url` in `config.ts` to the real domain (share previews need
the absolute image URL). `public/robots.txt` allows indexing; change it to `Disallow: /`
if you'd rather the invitation stay out of search results.

---

## 6. Performance

Lighthouse **mobile** on the production build (`npm run preview`, simulated slow 4G + 4×
CPU), measured across 7 runs on a busy dev laptop: **Performance median 90** (86–93; one
outlier at 69), LCP ~2.2 s, TBT 210–410 ms, CLS 0.002. **Accessibility 100, Best
Practices 100, SEO 100.** Lighthouse can't measure scrolling smoothness, so the numbers
below are from frame profiling.

### What keeps it smooth (and why — each was measured)

| Technique                                                                                | Where                             | Measured effect                                                                                  |
| ---------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------ |
| Lenis `lerp 0.15` + ScrollTrigger `scrub: true`                                          | `lib/scroll.ts`, scenes           | Wheel → 90% settled in 290 ms (was 466 ms with lerp 0.09 + scrub 0.6; parallax no longer trails) |
| Idle loops as **CSS keyframes** on HTML elements (`data-idle` on/paused)                 | `styles/index.css`, `useIdleLife` | Idle layerize 489 → 6 ms per 2 s (4× CPU); GSAP tick ~2 → ~1 ms/frame                            |
| Animated pieces never _inside_ an SVG (flames, strands are their own elements)           | `Diya`, `Toran`, `PhereDecor`     | Paints 913 → 172 per 3.5 s; root document no longer repaints every frame                         |
| Scroll position from Lenis / passive scroll events, never `window.scrollY` in the ticker | `lib/scroll.ts`                   | Removed ~1,900 forced style+layout flushes per 14 s load                                         |
| Scenes 2–7 as a lazy chunk, mounted **one per idle slot** at a calm moment               | `scenes/LaterScenes.tsx`          | Lighthouse TBT ~6 s → ~250 ms                                                                    |
| GSAP/ScrollTrigger setup deferred out of React's commit                                  | `lib/idle.ts` `deferSetup`        | Halves each scene-mount task                                                                     |
| Dark scene washes as transform-only "silk curtains" under the canvas                     | `SceneBackdrops`, `useBackdrop`   | Compositor-only transitions                                                                      |
| three.js loaded only when the seal breaks; canvas paused when hidden/closed              | `App.tsx`, `BackgroundCanvas`     | Keeps three.js (~248 KB gz) off the critical path                                                |
| Static boot screen shows the couple's names before JS                                    | `index.html`, `vite.config.ts`    | LCP at first paint                                                                               |
| GPU-only particles (instanced petals and feathers, point sparkles and embers)            | `src/three/`                      | ~8 uniforms updated per frame regardless of count                                                |

### Knobs

| Lever                     | Where                                                    | Notes                                                                                                                              |
| ------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Particle budgets per tier | `src/three/budget.ts`                                    | petals / sparkles / feathers / embers + max DPR. Phones start `medium`, laptops `high`; drei `PerformanceMonitor` steps tiers live |
| Scene-2/3/4 scroll length | `h-[340svh]` / `h-[250svh]` / `h-[560svh]` in each scene | Shorter = faster story                                                                                                             |
| Deferred mount timing     | `QUIET_START_MS`, `AFTER_REVEAL_MS` in `LaterScenes.tsx` |                                                                                                                                    |
| Textures                  | your art                                                 | WebP ≤ 1440 px (2048 max); every layer costs decode memory on phones                                                               |

If a phone struggles: lower `medium.feathers` / `medium.petals`, then `medium.dpr` to 1.25.

**Fallbacks:** `prefers-reduced-motion` gets native scroll, no WebGL, static poses and
fades only (pinned scenes become normal-height static layouts). No WebGL or a lost
context gives a static CSS backdrop. A failed chunk download shows a retry note instead
of a blank page.

---

## 7. How it works

```
index.html               static boot screen (names); meta injected from config at build
src/
  data/                  config.ts · events.ts · types.ts            ← content
  store/experience.ts    zustand: intro phase, mute, quality tier, active scene
  lib/                   scroll (Lenis+ScrollTrigger) · audio · ics · rsvp · countdown · idle · arch …
  components/
    intro/               EnvelopeIntro · WaxSeal · EnvelopeParts
    deity/               DeityFigure · DeityLayer · BlinkingEyes · Aura · assets (drop-in resolver)
    decor/               ArchFrame · PichwaiFrame · Toran · Diya · PhereDecor · Flute · PeacockFeather · Glint
    scene/               SceneSection · SceneBackdrops · ChunkErrorBoundary
    ui/                  Countdown · Timeline · EventIcon · Lightbox · GalleryArt · AudioToggle · …
  scenes/                ganesh · shreenathji · kali · phere · couple · itinerary · rsvp · LaterScenes
  three/                 BackgroundCanvas · fields (Petal, Feather, Sparkle, Ember) · shaders · budget
  assets/deities/…       drop-in layer art          assets/couple/…   drop-in photos
tools/                   placeholder-art generators · OG/icon composer
```

- **Intro phases:** `loading → sealed → opening → entering → revealed`.
- **Pinned scenes** (2–4) use CSS `position: sticky` inside a tall section and are driven
  by ScrollTrigger progress, with no JS pinning and no pin-spacers, so there's no jitter
  with iOS momentum scrolling.
- **Scroll data:** every GSAP tick writes a plain mutable `scrollState` (y, velocity,
  progress) that WebGL fields read in `useFrame` without React re-renders.
  `<SceneSection>` sets `activeScene`, which fades particle fields in and out.
- **Deities are DOM layers, not WebGL planes:** they stay crisp on 3× screens (the canvas
  is capped at 1.5×), work without WebGL, and carry an accessible label.
- **iOS specifics:** `svh/dvh/lvh` units, a fixed canvas at `100lvh` (no resize as the
  toolbar moves), safe-area insets, `overscroll-behavior: none`, `overflow-x: clip` (keeps
  sticky working), touch-move blocked on the envelope, ≥ 44 px targets, 16 px form fields
  (no zoom-on-focus).

### Debug tooling (Parallax)

In dev, the R3F scene is exposed as `window.scene` (+ `__THREE_CAMERA__`, `__renderer__`)
for the Parallax three.js tooling. `lib/`, `scripts/`, `test/visual/` and `deno.json`
belong to that tooling and need [Deno](https://deno.land).

---

## 8. Known limitations

- **Placeholder art** is stylised vector illustration, respectful and fully rigged, but
  painted artwork will look far richer (see §9).
- Hair and garland "flow" is layer sway and skew (CSS), not a vertex-shader deformation;
  the deities are DOM layers by design.
- The phere fire is layered DOM flames plus WebGL sparks, not a shader fire, so the
  couple can pass correctly in front of and behind it.
- The audio is a synthesized bell; there's no shehnai until you add a licensed file.
  iPhones on silent won't chime (Web Audio follows the ring switch).
- Lenis smooths only wheel/trackpad. Touch scrolling is native on purpose.
- Tested in desktop Chrome and Chromium mobile emulation (390×844, 375×667, 1440×900).
  **Test on real iPhones/Android devices before sending.**
- Lighthouse scores vary ±5–10 between runs on a busy machine.
- `THREE.Clock` deprecation warning in the console comes from @react-three/fiber on
  three r187. It's harmless.

## 9. If you supply real artwork

1. Export each deity as full-artboard transparent layers with the **same file names**
   (see the art guide). Keep eyes, eyelids, irises and lips separate. Animation needs
   them apart.
2. Adjust pivots in the rig if ears, trunk, hair or lips sit elsewhere; adjust
   `blinkTravel` to your lid height and `kaliPalm` to the abhaya hand.
3. For painted art, consider moving hair and garland layers to a WebGL plane with a
   vertex-shader wave (`DeityLayer` is the swap point) for true cloth/hair motion.
4. Re-shoot the OG image from `tools/og/`, and compress everything to WebP.
