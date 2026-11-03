// Generates the placeholder Ganesh Ji layers → src/assets/deities/ganesh/*.svg
// Run: node tools/placeholder-art/ganesh.mjs
// Style: gold-foil iconography on cream with peacock/emerald/vermilion accents.
import { fileURLToPath } from 'node:url';
import { beads, curve, f, mirror, petalPath, radial, svg, tube, write } from './lib.mjs';

const dir = fileURLToPath(new URL('../../src/assets/deities/ganesh/', import.meta.url));
const out = (name, content) => write(`${dir}${name}.svg`, content);

const C = {
  outline: '#94701f',
  line: 'rgba(140,100,30,.45)',
  teal: '#0E7C7B',
  peacock: '#0B3C5D',
  emerald: '#1B6B4A',
  ruby: '#B8342A',
  pearl: '#FFF8E8',
  vermilion: '#C23B2C',
  gold: '#C9A227',
};

const skin = (id) =>
  `<radialGradient id="${id}" cx="300" cy="268" r="280" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#FCF2D6"/><stop offset=".48" stop-color="#F4DEA6"/><stop offset="1" stop-color="#DCB565"/>
  </radialGradient>`;
const gold = (id) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#F8E294"/><stop offset=".42" stop-color="#E0B94C"/><stop offset=".78" stop-color="#B68F26"/><stop offset="1" stop-color="#8C6A12"/>
  </linearGradient>`;
const goldH = (id) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#A9831E"/><stop offset=".5" stop-color="#F3D677"/><stop offset="1" stop-color="#A9831E"/>
  </linearGradient>`;
const jewel = (id, light, dark) =>
  `<radialGradient id="${id}" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></radialGradient>`;

const rosette = (cx, cy, r, color) => {
  let s = '';
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * 2 * i) / 6;
    s += `<circle cx="${f(cx + Math.cos(a) * r)}" cy="${f(cy + Math.sin(a) * r)}" r="${f(r * 0.55)}" fill="${color}"/>`;
  }
  return `${s}<circle cx="${cx}" cy="${cy}" r="${f(r * 0.6)}" fill="${C.gold}"/>`;
};

/* ───────────── halo: mandala ring behind the head (rotates slowly) ───────────── */
{
  const cx = 300,
    cy = 250;
  const petal = `<g transform="translate(${cx} ${cy - 160})"><path d="${petalPath(48, 13)}" fill="#F6E8C0" fill-opacity=".75" stroke="#B8922A" stroke-width="1.1"/><path d="M0,-9 L0,-38" stroke="#C9A227" stroke-width=".8" stroke-opacity=".75"/></g>`;
  const smallPetal = `<g transform="translate(${cx} ${cy - 132})"><path d="${petalPath(24, 8)}" fill="none" stroke="#C9A227" stroke-width="1" stroke-opacity=".7"/></g>`;
  out(
    'halo',
    svg(
      `<circle cx="${cx}" cy="${cy}" r="234" fill="url(#hg)"/>
      <g fill="none" stroke="#B8922A">
        <circle cx="${cx}" cy="${cy}" r="227" stroke-width="1.3" stroke-opacity=".7"/>
        <circle cx="${cx}" cy="${cy}" r="219" stroke-width="2.8" stroke-linecap="round" stroke-dasharray="0 8.6" stroke-opacity=".85"/>
        <circle cx="${cx}" cy="${cy}" r="211" stroke-width=".9" stroke-opacity=".6"/>
        <circle cx="${cx}" cy="${cy}" r="160" stroke-width="1" stroke-opacity=".6"/>
        <circle cx="${cx}" cy="${cy}" r="128" stroke-width=".8" stroke-opacity=".5"/>
      </g>
      ${radial(cx, cy, 24, petal)}
      ${radial(cx, cy, 24, `<circle cx="${cx}" cy="${cy - 203}" r="2.3" fill="#C9A227"/>`, 7.5)}
      ${radial(cx, cy, 32, smallPetal)}`,
      `<radialGradient id="hg" cx="${cx}" cy="${cy}" r="234" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FFF7DE" stop-opacity=".95"/><stop offset=".62" stop-color="#F6E5B4" stop-opacity=".55"/><stop offset="1" stop-color="#EBD8A6" stop-opacity=".15"/>
      </radialGradient>`,
    ),
  );
}

/* ───────────── body: shoulders, shawl, necklace, garlands ───────────── */
{
  const torso =
    'M300,386 C250,386 204,394 168,412 C118,438 90,486 86,546 C84,600 86,660 90,720 L510,720 C514,660 516,600 514,546 C510,486 482,438 432,412 C396,394 350,386 300,386 Z';
  const drape =
    'M90,530 C106,474 150,436 212,418 C202,470 188,560 184,720 L90,720 C86,650 86,580 90,530 Z';
  const drapeEdge = 'M214,418 C204,470 190,560 186,720';
  const shoulderEdge = 'M90,530 C106,474 150,436 212,418';
  const drapeSide = `
    <path d="${drape}" fill="url(#shawl)"/>
    <path d="${drape}" fill="url(#buti)"/>
    <path d="${shoulderEdge}" fill="none" stroke="${C.gold}" stroke-width="2.2"/>
    <path d="${drapeEdge}" fill="none" stroke="url(#gb)" stroke-width="9"/>
    <path d="${drapeEdge}" fill="none" stroke="#7A5A10" stroke-width="1" transform="translate(-4.6 0)"/>
    <path d="${drapeEdge}" fill="none" stroke="#FFF1C2" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="0 7"/>`;
  out(
    'body',
    svg(
      `<path d="${torso}" fill="url(#bskin)" stroke="${C.outline}" stroke-width="2.4"/>
      <path d="M232,470 C260,488 340,488 368,470" fill="none" stroke="${C.line}" stroke-width="1.4"/>
      <path d="M206,424 C252,500 330,600 432,704" fill="none" stroke="#9A7A35" stroke-width="3.2" stroke-opacity=".35"/>
      <path d="M206,424 C252,500 330,600 432,704" fill="none" stroke="#FBF1D2" stroke-width="2"/>
      ${drapeSide}
      ${mirror(drapeSide)}
      <path d="M222,418 C252,452 348,452 378,418" fill="none" stroke="#7A5A10" stroke-width="11" stroke-linecap="round"/>
      <path d="M222,418 C252,452 348,452 378,418" fill="none" stroke="url(#gb)" stroke-width="8" stroke-linecap="round"/>
      ${beads('M214,430 C248,478 352,478 386,430', { size: 5.4, gap: 2.2, a: '#FFFBF0', b: '#F2E6CC', shadow: 'rgba(120,90,40,.3)' })}
      ${[238, 260, 340, 362]
        .map(
          (x) =>
            `<path d="M${x},444 C${x + 5},451 ${x + 5},459 ${x},464 C${x - 5},459 ${x - 5},451 ${x},444 Z" fill="url(#teal)" stroke="#7A5A10" stroke-width="1.2"/>`,
        )
        .join('')}
      ${beads('M224,426 C228,512 262,582 300,594 C338,582 372,512 376,426', { size: 7.5, gap: 1, a: '#FFFDF6', b: '#F4EBD6', shadow: 'rgba(120,90,40,.28)' })}
      ${beads('M194,430 C196,540 246,634 300,648 C354,634 404,540 406,430', { size: 13.5, gap: 1.2, a: '#F59E0B', b: '#E46F0A', hi: '#FFE3A1' })}`,
      `${skin('bskin')}${gold('gb')}${jewel('teal', '#3FB5AE', '#0B4F5A')}
      <linearGradient id="shawl" x1="100" y1="420" x2="210" y2="720" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#127A7D"/><stop offset=".55" stop-color="#0B3C5D"/><stop offset="1" stop-color="#072A42"/>
      </linearGradient>
      <pattern id="buti" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="6" cy="6" r="1.5" fill="#E8D5A3" fill-opacity=".75"/><circle cx="18" cy="18" r="1.1" fill="#E8D5A3" fill-opacity=".55"/>
      </pattern>`,
    ),
  );
}

/* ───────────── ears (viewer's left; right is mirrored) ───────────── */
const earBody = (p) => `
  <path d="M214,226 C192,200 150,188 112,198 C78,207 56,236 54,276 C52,318 60,356 78,386 C96,416 128,436 162,436 C186,436 206,424 220,404 C212,380 208,356 208,330 C208,290 210,252 214,226 Z" fill="url(#${p}skin)" stroke="${C.outline}" stroke-width="2.4"/>
  <path d="M204,242 C186,222 152,214 124,222 C98,230 80,254 78,286 C76,318 84,348 98,372 C112,394 136,410 160,412 C178,412 192,404 202,392 C196,370 194,350 194,330 C194,298 198,266 204,242 Z" transform="translate(-9 -19.08) scale(1.06)" fill="none" stroke="${C.gold}" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="0 7.4"/>
  <path d="M204,242 C186,222 152,214 124,222 C98,230 80,254 78,286 C76,318 84,348 98,372 C112,394 136,410 160,412 C178,412 192,404 202,392 C196,370 194,350 194,330 C194,298 198,266 204,242 Z" fill="url(#${p}blush)" stroke="#B8922A" stroke-width="1.4"/>
  <path d="M132,362 C108,360 96,338 102,316 C108,294 130,282 152,286 C168,289 178,278 178,262 C190,280 188,306 174,326 C162,346 150,362 132,362 Z" fill="${C.teal}" stroke="#B8922A" stroke-width="1.6"/>
  <path d="M132,362 C108,360 96,338 102,316 C108,294 130,282 152,286 C168,289 178,278 178,262 C190,280 188,306 174,326 C162,346 150,362 132,362 Z" transform="translate(56 128.8) scale(.6)" fill="${C.emerald}" stroke="#E8D5A3" stroke-width="1.6"/>
  <circle cx="135" cy="334" r="4" fill="#E8D5A3"/>
  ${rosette(108, 262, 4.2, '#C9A227')}
  ${rosette(116, 392, 3.6, '#C9A227')}
  ${rosette(178, 384, 3.2, C.teal)}
  ${[
    [96, 300],
    [92, 334],
    [150, 240],
    [174, 236],
    [138, 396],
  ]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="${C.gold}"/>`)
    .join('')}
  <path d="M200,266 C192,296 192,350 202,384" fill="none" stroke="${C.line}" stroke-width="1.4"/>`;
const earDefs = (p) => `
  <radialGradient id="${p}skin" cx="214" cy="318" r="180" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#F8E6B6"/><stop offset=".6" stop-color="#EDCC86"/><stop offset="1" stop-color="#D8AC5C"/>
  </radialGradient>
  <radialGradient id="${p}blush" cx="150" cy="316" r="130" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#F8DDCB"/><stop offset=".65" stop-color="#EDBCA3"/><stop offset="1" stop-color="#DFA187"/>
  </radialGradient>`;
out('ear-left', svg(earBody('l'), earDefs('l')));
out('ear-right', svg(mirror(earBody('r')), earDefs('r')));

/* ───────────── head: face, brows, tilak, tusks ───────────── */
{
  const tuskL =
    'M252,384 C244,404 234,428 220,454 C218,459 223,461 227,457 C246,436 262,414 274,394 Z';
  const tuskR = 'M348,384 C356,398 362,410 364,420 L352,424 C348,414 340,402 326,394 Z';
  out(
    'head',
    svg(
      `<path d="M228,206 C200,212 184,246 184,286 C184,326 200,358 226,380 C244,396 262,404 280,408 L320,408 C338,404 356,396 374,380 C400,358 416,326 416,286 C416,246 400,212 372,206 C340,198 260,198 228,206 Z" fill="url(#hskin)" stroke="${C.outline}" stroke-width="2.4"/>
      <path d="M206,326 C214,354 234,374 258,386" fill="none" stroke="${C.line}" stroke-width="1.5"/>
      <path d="M394,326 C386,354 366,374 342,386" fill="none" stroke="${C.line}" stroke-width="1.5"/>
      <path d="M226,284 C236,272 258,268 278,277" fill="none" stroke="#7A5418" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M374,284 C364,272 342,268 322,277" fill="none" stroke="#7A5418" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M300,226 C309,241 310,259 300,278 C290,259 291,241 300,226 Z" fill="${C.vermilion}"/>
      <path d="M300,236 C304,245 304,256 300,266 C296,256 296,245 300,236 Z" fill="#E86A4F" fill-opacity=".7"/>
      <circle cx="300" cy="286" r="3" fill="${C.gold}"/>
      <path d="${tuskL}" fill="url(#ivory)" stroke="#AE9663" stroke-width="1.3"/>
      <path d="M248,398 L267,409" stroke="url(#hg2)" stroke-width="4.5" stroke-linecap="round"/>
      <path d="${tuskR}" fill="url(#ivory)" stroke="#AE9663" stroke-width="1.3"/>
      <path d="M333,398 L352,409" stroke="url(#hg2)" stroke-width="4.5" stroke-linecap="round"/>`,
      `${skin('hskin')}${goldH('hg2')}
      <linearGradient id="ivory" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFDF5"/><stop offset="1" stop-color="#E8DCBF"/></linearGradient>`,
    ),
  );
}

/* ───────────── eyes ───────────── */
const scleraL = 'M230,298 C241,287 262,285 277,297 C264,308 243,310 230,298 Z';
out(
  'eye-whites',
  svg(
    `<path d="${scleraL}" fill="url(#sc)"/>${mirror(`<path d="${scleraL}" fill="url(#sc)"/>`)}`,
    `<linearGradient id="sc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E7DABD"/><stop offset=".5" stop-color="#FFFCF3"/><stop offset="1" stop-color="#F7F0DF"/></linearGradient>`,
  ),
);
const iris = (cx) => `
  <circle cx="${cx}" cy="298.5" r="7.6" fill="url(#ir)"/>
  <circle cx="${cx}" cy="298.5" r="3.4" fill="#170D06"/>
  <circle cx="${cx - 2.6}" cy="295.8" r="2" fill="#fff" fill-opacity=".9"/>
  <circle cx="${cx + 2.4}" cy="301.2" r=".9" fill="#fff" fill-opacity=".5"/>`;
out(
  'irises',
  svg(
    `${iris(254)}${iris(346)}`,
    `<radialGradient id="ir"><stop offset="0" stop-color="#6A4320"/><stop offset=".7" stop-color="#3C2410"/><stop offset="1" stop-color="#1E1208"/></radialGradient>`,
  ),
);
const lidL = `
  <path d="M224,301 C237,286 262,281 283,297 L283,236 L224,236 Z" fill="url(#lid)"/>
  <path d="M228,299 C240,287 262,283 279,296" fill="none" stroke="#33200F" stroke-width="2.8" stroke-linecap="round"/>`;
out(
  'eyelids',
  svg(
    `${lidL}${mirror(lidL)}`,
    `<linearGradient id="lid" x1="0" y1="236" x2="0" y2="300" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#F7E6BC"/><stop offset=".8" stop-color="#F1D9A0"/><stop offset="1" stop-color="#E2C07C"/></linearGradient>`,
  ),
);
const linesL = `
  <path d="M232,300 C245,309 265,307 276,298" fill="none" stroke="#5A3A1C" stroke-width="1.2" stroke-opacity=".7"/>
  <path d="M231,298 C225,295 219,293 211,294" fill="none" stroke="#33200F" stroke-width="2.3" stroke-linecap="round"/>
  <path d="M228,291 C240,279 262,276 281,289" fill="none" stroke="rgba(122,84,24,.4)" stroke-width="1.1"/>`;
out('eye-lines', svg(`${linesL}${mirror(linesL)}`));

/* ───────────── trunk (sways around its root) ───────────── */
{
  const points = [
    [300, 288],
    [300, 328],
    [298, 382],
    [296, 434],
    [298, 484],
    [308, 528],
    [330, 560],
    [360, 572],
    [386, 562],
    [399, 541],
    [395, 520],
    [382, 512],
  ];
  const widths = [24, 62, 60, 54, 46, 39, 33, 28, 24, 20, 17, 15];
  const { d, pts, ns } = tube(points, widths, 14);

  // Open outline (skip the flat top so the root blends into the forehead).
  const startAt = 9;
  const left = pts.map((p, i) => [p.x + ns[i].nx * p.v * 0.5, p.y + ns[i].ny * p.v * 0.5]);
  const right = pts.map((p, i) => [p.x - ns[i].nx * p.v * 0.5, p.y - ns[i].ny * p.v * 0.5]);
  const endR = f(pts[pts.length - 1].v * 0.5);
  let outline = `M${f(left[startAt][0])},${f(left[startAt][1])}`;
  for (const [x, y] of left.slice(startAt + 1)) outline += ` L${f(x)},${f(y)}`;
  const [rx, ry] = right[right.length - 1];
  outline += ` A${endR},${endR} 0 0 1 ${f(rx)},${f(ry)}`;
  for (const [x, y] of right.slice(startAt, -1).reverse()) outline += ` L${f(x)},${f(y)}`;

  // Soft ring creases across the trunk.
  let creases = '';
  for (let i = 26; i < pts.length - 10; i += 6) {
    const p = pts[i],
      n = ns[i],
      w = p.v * 0.4;
    const ax = p.x + n.nx * w,
      ay = p.y + n.ny * w,
      bx = p.x - n.nx * w,
      by = p.y - n.ny * w;
    const cx = p.x + n.tx * 3.5,
      cy = p.y + n.ty * 3.5;
    creases += `<path d="M${f(ax)},${f(ay)} Q${f(cx)},${f(cy)} ${f(bx)},${f(by)}" fill="none" stroke="rgba(150,108,36,.38)" stroke-width="1.3"/>`;
  }
  // Painted ornament: chain of gold & teal dots down the upper trunk.
  let dots = '';
  for (let i = 22, k = 0; i < 64; i += 5, k++) {
    const p = pts[i];
    dots +=
      k % 2
        ? `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="2.2" fill="${C.teal}"/>`
        : `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="3.1" fill="${C.gold}" stroke="#8C6A12" stroke-width=".6"/>`;
  }
  const hl = pts
    .slice(14, 80)
    .map(
      (p, i) =>
        `${i ? 'L' : 'M'}${f(p.x - ns[i + 14].nx * p.v * 0.2)},${f(p.y - ns[i + 14].ny * p.v * 0.2)}`,
    )
    .join(' ');
  const tip = pts[pts.length - 3];

  out(
    'trunk',
    svg(
      `<path d="${d}" fill="url(#tskin)"/>
      <path d="${hl}" fill="none" stroke="#FFF7E0" stroke-width="4" stroke-linecap="round" stroke-opacity=".5"/>
      ${creases}
      <path d="M300,318 C307,327 308,338 300,348 C292,338 293,327 300,318 Z" fill="${C.teal}" stroke="#B8922A" stroke-width="1.3"/>
      <circle cx="300" cy="334" r="2" fill="#E8D5A3"/>
      ${dots}
      <ellipse cx="${f(tip.x)}" cy="${f(tip.y)}" rx="3.6" ry="2.2" fill="#7E5420" fill-opacity=".55" transform="rotate(-35 ${f(tip.x)} ${f(tip.y)})"/>
      <path d="${outline}" fill="none" stroke="${C.outline}" stroke-width="2.3" stroke-linejoin="round"/>`,
      skin('tskin'),
    ),
  );
}

/* ───────────── crown (mukut) ───────────── */
{
  const lappets = (y, x0, x1, n, L, w) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + ((x1 - x0) * i) / (n - 1);
      s += `<g transform="translate(${f(x)} ${y})"><path d="${petalPath(L, w)}" fill="url(#cg)" stroke="#6B4E0C" stroke-width="1.1"/></g>`;
    }
    return s;
  };
  const band = (d) => `<path d="${d}" fill="url(#cgd)" stroke="#6B4E0C" stroke-width="1.2"/>`;
  const gemRow = (y, x0, x1, n) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + ((x1 - x0) * i) / (n - 1);
      s +=
        i % 2
          ? `<circle cx="${f(x)}" cy="${y}" r="2.6" fill="${C.pearl}" stroke="#8C6A12" stroke-width=".6"/>`
          : `<circle cx="${f(x)}" cy="${y}" r="3.4" fill="url(${i % 4 === 0 ? '#gt' : '#gr'})" stroke="#6B4E0C" stroke-width=".8"/>`;
    }
    return s;
  };
  const flare = `<path d="M208,214 C190,210 180,224 184,240 C188,254 204,256 211,244 C204,246 194,242 194,232 C194,222 202,218 210,222 Z" fill="url(#cg)" stroke="#6B4E0C" stroke-width="1.2"/><circle cx="196" cy="236" r="3" fill="url(#gt)"/>`;
  out(
    'crown',
    svg(
      `${flare}${mirror(flare)}
      <circle cx="300" cy="28" r="5" fill="${C.pearl}" stroke="#8C6A12" stroke-width=".8"/>
      <path d="M300,54 C295,47 295,40 300,31 C305,40 305,47 300,54 Z" fill="url(#cg)" stroke="#6B4E0C" stroke-width="1"/>
      <path d="M280,86 C282,71 289,60 300,51 C311,60 318,71 320,86 Z" fill="url(#cg)" stroke="#6B4E0C" stroke-width="1.2"/>
      <circle cx="300" cy="72" r="3.6" fill="url(#gt)" stroke="#6B4E0C" stroke-width=".7"/>
      ${lappets(88, 282, 318, 3, 12, 5)}
      <path d="M262,116 C264,101 270,91 281,83 L319,83 C330,91 336,101 338,116 Z" fill="url(#cg)" stroke="#6B4E0C" stroke-width="1.2"/>
      <circle cx="300" cy="100" r="5" fill="url(#gt)" stroke="#6B4E0C" stroke-width=".9"/>
      ${lappets(118, 262, 338, 5, 15, 6)}
      <path d="M236,156 C238,138 246,124 258,113 L342,113 C354,124 362,138 364,156 Z" fill="url(#cg)" stroke="#6B4E0C" stroke-width="1.3"/>
      ${band('M240,156 L360,156 L361,146 C330,142 270,142 239,146 Z')}
      ${gemRow(150.5, 250, 350, 9)}
      <circle cx="300" cy="129" r="7" fill="url(#gr)" stroke="#6B4E0C" stroke-width="1.2"/>
      <circle cx="300" cy="129" r="10.5" fill="none" stroke="#F3D98A" stroke-width="1.4" stroke-dasharray="0 4.2" stroke-linecap="round"/>
      ${lappets(160, 238, 362, 7, 20, 7.5)}
      <path d="M204,218 C204,188 214,168 232,154 L368,154 C386,168 396,188 396,218 Z" fill="url(#cg)" stroke="#6B4E0C" stroke-width="1.4"/>
      <path d="M300,160 C311,171 313,185 300,198 C287,185 289,171 300,160 Z" fill="url(#gt)" stroke="#F3D98A" stroke-width="2.4"/>
      <path d="M300,160 C311,171 313,185 300,198 C287,185 289,171 300,160 Z" fill="none" stroke="#6B4E0C" stroke-width=".9"/>
      <ellipse cx="256" cy="184" rx="7" ry="9" fill="url(#ge)" stroke="#F3D98A" stroke-width="2"/>
      <ellipse cx="344" cy="184" rx="7" ry="9" fill="url(#ge)" stroke="#F3D98A" stroke-width="2"/>
      ${[230, 278, 322, 370].map((x) => `<circle cx="${x}" cy="186" r="2.4" fill="${C.pearl}" stroke="#8C6A12" stroke-width=".5"/>`).join('')}
      ${band('M204,220 L396,220 L396,203 C360,197 240,197 204,203 Z')}
      ${gemRow(211, 212, 388, 15)}
      ${band('M206,226 C246,214 354,214 394,226 L394,219 C354,208 246,208 206,219 Z')}
      ${beads('M214,231 C252,221 348,221 386,231', { size: 4.2, gap: 1.6, a: '#FFFBF0', b: '#F3E7CC', shadow: 'rgba(110,80,20,.35)' })}
      ${[238, 266, 334, 362].map((x) => `<path d="M${x},234 C${x + 3.5},239 ${x + 3.5},244 ${x},247 C${x - 3.5},244 ${x - 3.5},239 ${x},234 Z" fill="url(#gt)" stroke="#8C6A12" stroke-width=".7"/>`).join('')}`,
      `${gold('cg')}
      <linearGradient id="cgd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C79C2E"/><stop offset="1" stop-color="#8C6A12"/></linearGradient>
      ${jewel('gt', '#5CC9BF', '#0B4F5A')}${jewel('gr', '#E9706A', '#7E1A16')}${jewel('ge', '#5FBF8C', '#0F4A31')}`,
    ),
  );
}

/* ───────────── lotus seat (front-most) ───────────── */
{
  const row = (angles, L, w, fill) =>
    angles
      .map(
        (a) =>
          `<g transform="rotate(${a})"><path d="${petalPath(L, w)}" fill="url(#${fill})" stroke="#B98A3A" stroke-width="1.3" vector-effect="non-scaling-stroke"/><path d="M0,-10 L0,${-L * 0.82}" stroke="rgba(186,118,96,.5)" stroke-width="1" vector-effect="non-scaling-stroke"/></g>`,
      )
      .join('');
  out(
    'lotus',
    svg(
      `<g transform="translate(300 744) scale(1.72 1)">
        ${row([-66, -40, -14, 14, 40, 66], 152, 30, 'pb')}
        ${row([-82, -55, -27, 0, 27, 55, 82], 128, 30, 'pf')}
      </g>
      <ellipse cx="300" cy="716" rx="236" ry="13" fill="url(#lg)" stroke="#8C6A12" stroke-width="1.2"/>
      <ellipse cx="300" cy="712" rx="210" ry="4" fill="none" stroke="#FFF1C2" stroke-width="1.4" stroke-dasharray="0 7" stroke-linecap="round"/>`,
      `<linearGradient id="pb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#F6DCD2"/><stop offset=".6" stop-color="#EDB3AE"/><stop offset="1" stop-color="#D98990"/></linearGradient>
      <linearGradient id="pf" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFF8F2"/><stop offset=".55" stop-color="#F8D9D2"/><stop offset="1" stop-color="#EBA7A6"/></linearGradient>
      ${goldH('lg')}`,
    ),
  );
}

console.log('ganesh layers written to', dir);
