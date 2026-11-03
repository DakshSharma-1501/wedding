// Generates the placeholder Maa Kali layers → src/assets/deities/kali/*.svg
// Run: node tools/placeholder-art/kali.mjs
// Reverent, motherly form: serene three-eyed face, flowing hair, ring of golden flame,
// a hibiscus garland (her sacred flower) instead of skulls, abhaya + varada mudras,
// trishul and lotus in the upper hands.
import { fileURLToPath } from 'node:url';
import { beads, f, mirror, petalPath, radial, tube, write } from './lib.mjs';

const W = 600;
const H = 760;
const dir = fileURLToPath(new URL('../../src/assets/deities/kali/', import.meta.url));
const svg = (body, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${
    defs ? `<defs>${defs}</defs>` : ''
  }${body}</svg>\n`;
const out = (name, content) => write(`${dir}${name}.svg`, content);

const skin = (id) => `
  <radialGradient id="${id}" cx="296" cy="240" r="440" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#34488C"/><stop offset=".42" stop-color="#1F2C66"/><stop offset="1" stop-color="#111A42"/>
  </radialGradient>`;
const gold = (id) => `
  <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#F8E294"/><stop offset=".45" stop-color="#DDB547"/><stop offset=".8" stop-color="#B08A22"/><stop offset="1" stop-color="#8C6A12"/>
  </linearGradient>`;
const jewel = (id, a, b) =>
  `<radialGradient id="${id}" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
const OUT = '#0A1030';
const HI = '#5B70B8';

/** Five-petal hibiscus centred on (0,0). */
const hibiscus = (s = 1) => `
  <g transform="scale(${s})">
    ${[0, 72, 144, 216, 288].map((a) => `<path d="M0,0 C-7,-4 -9,-14 -4,-18 C-1,-20 1,-20 4,-18 C9,-14 7,-4 0,0 Z" transform="rotate(${a})" fill="url(#hb)" stroke="#7E1020" stroke-width=".6"/>`).join('')}
    <circle r="2.6" fill="#F3D677"/><path d="M0,0 L0,-12" stroke="#F3D677" stroke-width="1"/>
  </g>`;
const hibDefs = `<radialGradient id="hb" cx=".5" cy=".9" r="1"><stop offset="0" stop-color="#7E1020"/><stop offset=".5" stop-color="#C2263F"/><stop offset="1" stop-color="#E8505E"/></radialGradient>`;

/* ───────────── fire ring: golden flames around a halo (turns slowly) ───────────── */
{
  const cx = 300, cy = 290;
  const flame = (r, h, w) => `M${cx},${cy - r} C${cx + w},${cy - r - h * 0.35} ${cx + w * 0.4},${cy - r - h * 0.75} ${cx},${cy - r - h} C${cx - w * 0.2},${cy - r - h * 0.7} ${cx - w},${cy - r - h * 0.4} ${cx},${cy - r} Z`;
  out(
    'fire-ring',
    svg(
      `<circle cx="${cx}" cy="${cy}" r="250" fill="url(#rg)"/>
      ${radial(cx, cy, 30, `<path d="${flame(226, 44, 14)}" fill="url(#fl)" fill-opacity=".9"/>`)}
      ${radial(cx, cy, 30, `<path d="${flame(222, 28, 9)}" fill="#FFE7A0" fill-opacity=".8"/>`, 6)}
      <circle cx="${cx}" cy="${cy}" r="222" fill="none" stroke="url(#gd)" stroke-width="7"/>
      <circle cx="${cx}" cy="${cy}" r="222" fill="none" stroke="#FFF1C2" stroke-width="1.6" stroke-dasharray="0 9" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="206" fill="none" stroke="#E2C25A" stroke-width="1" stroke-opacity=".7"/>
      ${radial(cx, cy, 24, `<g transform="translate(${cx} ${cy - 196})"><path d="${petalPath(26, 8)}" fill="#F6E3A6" fill-opacity=".18" stroke="#E2C25A" stroke-opacity=".6" stroke-width=".9"/></g>`, 7.5)}`,
      `${gold('gd')}
      <radialGradient id="rg" cx="${cx}" cy="${cy}" r="250" gradientUnits="userSpaceOnUse">
        <stop offset=".55" stop-color="#FFD27A" stop-opacity=".22"/><stop offset=".85" stop-color="#F59E0B" stop-opacity=".12"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E8650C"/><stop offset=".6" stop-color="#F7A81B"/><stop offset="1" stop-color="#FFE19A"/></linearGradient>`,
    ),
  );
}

/* ───────────── hair: two flowing masses (sway from the crown) ───────────── */
const hairLeft = `
  <path d="M300,128 C232,120 176,170 162,240 C148,320 120,380 104,460 C92,520 106,580 132,630 C120,560 140,510 160,470 C150,540 168,600 200,640 C192,570 206,520 226,480 L250,330 C262,250 280,170 300,128 Z" fill="url(#hr)"/>
  <path d="M286,150 C238,170 196,240 186,320 C178,380 150,450 140,520" fill="none" stroke="${HI}" stroke-opacity=".35" stroke-width="2"/>
  <path d="M270,170 C228,210 206,290 200,370 C196,430 178,480 176,560" fill="none" stroke="${HI}" stroke-opacity=".25" stroke-width="1.6"/>`;
out('hair-left', svg(hairLeft, `<linearGradient id="hr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A1F45"/><stop offset="1" stop-color="#090C22"/></linearGradient>`));
out('hair-right', svg(mirror(hairLeft), `<linearGradient id="hr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A1F45"/><stop offset="1" stop-color="#090C22"/></linearGradient>`));

/* ───────────── back arms: trishul (viewer's left) and lotus (viewer's right) ───────────── */
{
  const armL = tube([[226, 352], [182, 330], [146, 300], [128, 262], [124, 236]], [36, 32, 29, 27, 25], 12);
  const armR = tube([[374, 352], [418, 330], [454, 300], [472, 262], [476, 236]], [36, 32, 29, 27, 25], 12);
  const fist = (x, y) => `<path d="M${x - 16},${y + 4} C${x - 18},${y - 14} ${x - 8},${y - 22} ${x + 4},${y - 20} C${x + 16},${y - 18} ${x + 18},${y - 2} ${x + 12},${y + 8} C${x + 4},${y + 14} ${x - 10},${y + 14} ${x - 16},${y + 4} Z" fill="url(#sk)" stroke="${HI}" stroke-width="1.2"/>`;
  out(
    'arms-back',
    svg(
      `<path d="M120,540 L120,74" stroke="#3A2A08" stroke-width="9" stroke-linecap="round" stroke-opacity=".5"/><path d="M120,540 L120,74" stroke="url(#gdh)" stroke-width="7" stroke-linecap="round"/>
      <path d="M100,96 C100,70 110,54 120,40 C130,54 140,70 140,96 M120,40 L120,96 M96,100 L144,100" fill="none" stroke="url(#gd)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M104,96 C96,76 92,66 86,58 M136,96 C144,76 148,66 154,58" fill="none" stroke="url(#gd)" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="120" cy="112" r="6" fill="url(#rb)" stroke="#F3D677" stroke-width="1.5"/>
      <path d="${armL.d}" fill="url(#sk)" stroke="${OUT}" stroke-width="1.8"/>
      <path d="${armR.d}" fill="url(#sk)" stroke="${OUT}" stroke-width="1.8"/>
      ${fist(122, 236)}${fist(478, 236)}
      <rect x="132" y="296" width="30" height="9" rx="4.5" transform="rotate(-50 147 300)" fill="url(#gd)"/>
      <rect x="438" y="296" width="30" height="9" rx="4.5" transform="rotate(50 453 300)" fill="url(#gd)"/>
      <g transform="translate(482 196)">
        ${[-50, -25, 0, 25, 50].map((a) => `<g transform="rotate(${a})"><path d="${petalPath(34, 10)}" fill="url(#lt)" stroke="#B98A3A" stroke-width="1"/></g>`).join('')}
        <circle r="5" fill="#F3D677"/>
      </g>`,
      `${skin('sk')}${gold('gd')}${jewel('rb', '#E9706A', '#7E1A16')}
      <linearGradient id="gdh" x1="116" y1="0" x2="124" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#B08A22"/><stop offset=".5" stop-color="#FFF1C2"/><stop offset="1" stop-color="#B08A22"/></linearGradient>
      <linearGradient id="lt" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFF5EF"/><stop offset=".6" stop-color="#F5C6C0"/><stop offset="1" stop-color="#E39A9A"/></linearGradient>`,
    ),
  );
}

/* ───────────── body: torso, front arms (abhaya + varada), saree ───────────── */
{
  const armL = tube([[216, 352], [186, 400], [172, 452], [180, 420], [190, 380]], [40, 35, 32, 30, 28], 10);
  const armL2 = tube([[176, 456], [182, 418], [190, 378]], [32, 30, 28], 12);
  const armR = tube([[384, 352], [414, 400], [424, 456], [414, 500], [404, 540]], [40, 35, 32, 30, 28], 12);
  // Abhaya mudra: open palm facing the viewer, fingers up.
  const fingers = [[176, 330, 26, -7], [186, 324, 30, -2], [196, 324, 30, 3], [206, 330, 25, 8]]
    .map(([x, y, h, r]) => `<rect x="${x - 5}" y="${y - h}" width="10" height="${h + 10}" rx="5" transform="rotate(${r} ${x} ${y})" fill="url(#sk)" stroke="${HI}" stroke-width="1"/>`)
    .join('');
  out(
    'body',
    svg(
      `<path d="M276,296 C276,318 272,334 264,346 L336,346 C328,334 324,318 324,296 Z" fill="url(#sk)"/>
      <path d="M300,330 C262,330 230,338 212,354 C196,370 194,400 200,440 C206,476 214,500 222,524 L378,524 C386,500 394,476 400,440 C406,400 404,370 388,354 C370,338 338,330 300,330 Z" fill="url(#sk)" stroke="${OUT}" stroke-width="2"/>
      <path d="M226,392 C252,376 348,376 374,392 L380,520 L220,520 Z" fill="url(#cr)"/>
      <path d="M226,392 C252,376 348,376 374,392" fill="none" stroke="url(#gd)" stroke-width="5"/>
      <path d="M214,360 C270,420 330,470 386,520 L360,526 C306,478 256,436 206,384 Z" fill="url(#cr2)" stroke="url(#gd)" stroke-width="3"/>
      <path d="M210,372 C266,430 324,478 380,524" fill="none" stroke="#FFF1C2" stroke-width="1.4" stroke-dasharray="0 6" stroke-linecap="round"/>
      <path d="M218,512 L382,512 C420,580 460,670 486,760 L114,760 C140,670 180,580 218,512 Z" fill="url(#cr)"/>
      <path d="M218,512 L382,512 C420,580 460,670 486,760 L114,760 C140,670 180,580 218,512 Z" fill="url(#buti)"/>
      <path d="M118,742 C220,728 380,728 482,742 L486,760 L114,760 Z" fill="url(#gd)"/>
      <path d="M300,524 L300,760" stroke="#5E1216" stroke-opacity=".35" stroke-width="1.4"/>
      <path d="M216,508 L384,508 L386,524 L214,524 Z" fill="url(#gd)" stroke="#6B4E0C" stroke-width="1"/>
      ${[240, 270, 300, 330, 360].map((x, i) => `<circle cx="${x}" cy="516" r="3.4" fill="url(${i % 2 ? '#tb' : '#rb'})"/>`).join('')}
      <path d="${armL.d}" fill="url(#sk)" stroke="${OUT}" stroke-width="2"/>
      <path d="${armL2.d}" fill="url(#sk)" stroke="${OUT}" stroke-width="2"/>
      ${fingers}
      <path d="M170,372 C166,352 172,334 192,332 C210,332 216,350 212,372 C206,388 178,390 170,372 Z" fill="url(#sk)" stroke="${HI}" stroke-width="1.2"/>
      <path d="M168,356 C160,350 156,340 160,334" fill="none" stroke="${HI}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="191" cy="356" r="5" fill="#C2263F" fill-opacity=".85"/>
      <path d="${armR.d}" fill="url(#sk)" stroke="${OUT}" stroke-width="2"/>
      <path d="M390,546 C388,530 398,522 412,524 C426,528 430,546 424,562 C418,576 396,576 390,560 Z" fill="url(#sk)" stroke="${HI}" stroke-width="1.2"/>
      <g transform="translate(410 578)">${hibiscus(1.15)}</g>
      ${[[181, 396, 75], [190, 386, 80], [410, 520, 70], [412, 530, 70]].map(([x, y, r]) => `<rect x="${x - 16}" y="${y - 4.5}" width="32" height="9" rx="4.5" transform="rotate(${r} ${x} ${y})" fill="url(#gd)"/>`).join('')}
      <rect x="194" y="398" width="34" height="10" rx="5" transform="rotate(64 211 403)" fill="url(#gd)"/>
      <rect x="372" y="398" width="34" height="10" rx="5" transform="rotate(-64 389 403)" fill="url(#gd)"/>`,
      `${skin('sk')}${gold('gd')}${jewel('rb', '#E9706A', '#7E1A16')}${jewel('tb', '#5CC9BF', '#0B4F5A')}${hibDefs}
      <linearGradient id="cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8342F"/><stop offset=".6" stop-color="#9A2427"/><stop offset="1" stop-color="#6E1619"/></linearGradient>
      <linearGradient id="cr2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C2263F"/><stop offset="1" stop-color="#8A1A24"/></linearGradient>
      <pattern id="buti" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1.8" fill="#E8C766" fill-opacity=".7"/><circle cx="0" cy="0" r="1.1" fill="#E8C766" fill-opacity=".5"/></pattern>`,
    ),
  );
}

/* ───────────── hibiscus garland (sways) ───────────── */
{
  const pts = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const x = 226 + (374 - 226) * t;
    const y = 356 + Math.sin(t * Math.PI) * 210;
    pts.push([x, y]);
  }
  out(
    'garland',
    svg(
      `<path d="M226,356 C232,470 270,566 300,566 C330,566 368,470 374,356" fill="none" stroke="#1B6B4A" stroke-width="3"/>
      ${pts.map(([x, y], i) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${i * 23})">${i % 2 ? `<path d="M0,0 C6,-3 10,0 12,5 C6,6 2,4 0,0 Z" fill="#2F8A5B"/>` : hibiscus(0.82)}</g>`).join('')}`,
      hibDefs,
    ),
  );
}

/* ───────────── head: face, third eye, nath, earrings, sindoor ───────────── */
out(
  'head',
  svg(
    `<path d="M300,152 C344,152 368,190 368,232 C368,280 338,312 300,312 C262,312 232,280 232,232 C232,190 256,152 300,152 Z" fill="url(#sk)" stroke="${OUT}" stroke-width="2"/>
    <path d="M300,160 L300,176" stroke="#D9472F" stroke-width="4" stroke-linecap="round"/>
    <path d="M300,178 C305,186 305,196 300,204 C295,196 295,186 300,178 Z" fill="#FFFCF3" stroke="#E8C766" stroke-width="1.6"/>
    <circle cx="300" cy="191" r="3.2" fill="#06070D"/>
    <path d="M250,212 C262,203 280,203 290,210" fill="none" stroke="${HI}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M350,212 C338,203 320,203 310,210" fill="none" stroke="${HI}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M295,248 Q300,258 305,248" fill="none" stroke="${HI}" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="317" cy="258" r="13" fill="none" stroke="url(#gd)" stroke-width="2.4"/>
    <circle cx="317" cy="245.5" r="2.6" fill="#FFF8E8"/><circle cx="328" cy="264" r="2.4" fill="url(#rb)"/>
    <path d="M296,288 C298,295 302,295 304,288" fill="#E8505E"/>
    <ellipse cx="262" cy="262" rx="18" ry="10" fill="${HI}" fill-opacity=".16"/>
    <ellipse cx="338" cy="262" rx="18" ry="10" fill="${HI}" fill-opacity=".16"/>
    <g transform="translate(234 252)"><circle r="10" fill="url(#gd)"/><circle r="4" fill="url(#rb)"/>${beads('M0,10 L0,28', { size: 4, gap: 1, a: '#FFFBF0', b: '#EADFC4' })}</g>
    <g transform="translate(366 252)"><circle r="10" fill="url(#gd)"/><circle r="4" fill="url(#rb)"/>${beads('M0,10 L0,28', { size: 4, gap: 1, a: '#FFFBF0', b: '#EADFC4' })}</g>`,
    `${skin('sk')}${gold('gd')}${jewel('rb', '#E9706A', '#7E1A16')}`,
  ),
);

/* ───────────── eyes & lips ───────────── */
const scleraL = 'M252,230 C262,218 282,216 293,228 C282,240 262,242 252,230 Z';
out('eye-whites', svg(`<path d="${scleraL}" fill="#FFFCF3"/>${mirror(`<path d="${scleraL}" fill="#FFFCF3"/>`)}`));
const iris = (cx) => `<circle cx="${cx}" cy="229" r="8" fill="#1B1430"/><circle cx="${cx}" cy="229" r="5.6" fill="#05050A"/><circle cx="${cx - 2.6}" cy="226" r="2" fill="#fff" fill-opacity=".9"/>`;
out('irises', svg(`${iris(272)}${iris(328)}`));
const lidL = `<path d="M246,232 C258,212 282,208 298,228 L298,180 L246,180 Z" fill="url(#lid)"/><path d="M250,230 C262,217 282,214 294,228" fill="none" stroke="#020309" stroke-width="3" stroke-linecap="round"/>`;
out('eyelids', svg(`${lidL}${mirror(lidL)}`, `<linearGradient id="lid" x1="0" y1="180" x2="0" y2="232" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2A3B7A"/><stop offset="1" stop-color="#22306A"/></linearGradient>`));
const linesL = `<path d="M253,231 C264,242 282,241 292,230" fill="none" stroke="#020309" stroke-width="1.6"/><path d="M251,230 C244,226 238,225 232,226" fill="none" stroke="#020309" stroke-width="2.6" stroke-linecap="round"/>`;
out('eye-lines', svg(`${linesL}${mirror(linesL)}`));
out(
  'lips',
  svg(
    `<path d="M288,276 C294,272 297,274 300,275 C303,274 306,272 312,276 C306,279 294,279 288,276 Z" fill="#B8323E"/>
    <path d="M289.5,277 C295,284 305,284 310.5,277 C305,280 295,280 289.5,277 Z" fill="#C9414B"/>`,
  ),
);

/* ───────────── crown with crescent moon ───────────── */
out(
  'crown',
  svg(
    `<path d="M238,174 C236,140 256,110 274,98 L300,70 L326,98 C344,110 364,140 362,174 C334,162 266,162 238,174 Z" fill="url(#gd)" stroke="#6B4E0C" stroke-width="1.4"/>
    <path d="M300,70 L300,40" stroke="url(#gd)" stroke-width="3"/>
    <path d="M282,40 A20,20 0 1 0 318,40 A16,16 0 1 1 282,40 Z" fill="#FFF3C4" stroke="#B08A22" stroke-width="1"/>
    ${[256, 278, 300, 322, 344].map((x, i) => `<g transform="translate(${x} ${i === 2 ? 104 : 120 + Math.abs(2 - i) * 6})"><path d="${petalPath(i === 2 ? 26 : 18, 6)}" fill="url(#gd)" stroke="#6B4E0C" stroke-width=".9"/></g>`).join('')}
    <path d="M300,122 C310,132 312,146 300,158 C288,146 290,132 300,122 Z" fill="url(#rb)" stroke="#F3D677" stroke-width="2.4"/>
    <path d="M236,176 C266,162 334,162 364,176 L364,162 C334,150 266,150 236,162 Z" fill="url(#gd)" stroke="#6B4E0C" stroke-width="1.1"/>
    ${[248, 270, 300, 330, 352].map((x, i) => `<circle cx="${x}" cy="${163 + (i === 2 ? -2 : 0)}" r="${i === 2 ? 4.2 : 3}" fill="url(${i % 2 ? '#tb' : '#rb'})"/>`).join('')}
    ${beads('M244,178 C270,170 330,170 356,178', { size: 3.6, gap: 1.4, a: '#FFFBF0', b: '#EADFC4' })}`,
    `${gold('gd')}${jewel('rb', '#E9706A', '#7E1A16')}${jewel('tb', '#5CC9BF', '#0B4F5A')}`,
  ),
);

console.log('kali layers written to', dir);
