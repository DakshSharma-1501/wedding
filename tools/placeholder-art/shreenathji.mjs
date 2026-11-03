// Generates the placeholder Shreenathji layers → src/assets/deities/shreenathji/*.svg
// Run: node tools/placeholder-art/shreenathji.mjs
// Nathdwara pichwai idiom: deep indigo form, large lotus eyes, raised left arm (Govardhan),
// right fist on the hip, peacock-feather crown, chin diamond, vaijayanti mala.
import { fileURLToPath } from 'node:url';
import { beads, f, mirror, petalPath, radial, tube, write } from './lib.mjs';

const W = 600;
const H = 800;
const dir = fileURLToPath(new URL('../../src/assets/deities/shreenathji/', import.meta.url));
const svg = (body, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${
    defs ? `<defs>${defs}</defs>` : ''
  }${body}</svg>\n`;
const out = (name, content) => write(`${dir}${name}.svg`, content);
const mir = (body) => mirror(body); // lib mirror uses W=600, same artboard width

const skin = (id) => `
  <radialGradient id="${id}" cx="292" cy="250" r="460" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#2C3D6E"/><stop offset=".4" stop-color="#1B2650"/><stop offset="1" stop-color="#0E1530"/>
  </radialGradient>`;
const gold = (id) => `
  <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#F8E294"/><stop offset=".45" stop-color="#DDB547"/><stop offset=".8" stop-color="#B08A22"/><stop offset="1" stop-color="#8C6A12"/>
  </linearGradient>`;
const jewel = (id, a, b) =>
  `<radialGradient id="${id}" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
const OUT = '#0B1126';
const HI = '#5468A6'; // soft highlight line on the dark form

/* ───────────── halo: sun-chakra behind head and shoulders ───────────── */
{
  const cx = 300, cy = 250;
  out(
    'halo',
    svg(
      `<circle cx="${cx}" cy="${cy}" r="214" fill="url(#hg)"/>
      ${radial(cx, cy, 48, `<path d="M${cx},${cy - 122} L${cx - 2.6},${cy - 206} L${cx + 2.6},${cy - 206} Z" fill="#F0D27A" fill-opacity=".38"/>`)}
      ${radial(cx, cy, 24, `<g transform="translate(${cx} ${cy - 126})"><path d="${petalPath(34, 10)}" fill="#F6E3A6" fill-opacity=".22" stroke="#E2C25A" stroke-width="1"/></g>`, 7.5)}
      <g fill="none" stroke="#E2C25A">
        <circle cx="${cx}" cy="${cy}" r="120" stroke-width="1.4" stroke-opacity=".8"/>
        <circle cx="${cx}" cy="${cy}" r="164" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="0 8" stroke-opacity=".8"/>
        <circle cx="${cx}" cy="${cy}" r="208" stroke-width="1" stroke-opacity=".55"/>
      </g>`,
      `<radialGradient id="hg" cx="${cx}" cy="${cy}" r="214" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FFE9A8" stop-opacity=".6"/><stop offset=".55" stop-color="#D4AF37" stop-opacity=".22"/><stop offset="1" stop-color="#D4AF37" stop-opacity="0"/>
      </radialGradient>`,
    ),
  );
}

/* ───────────── body: arms, torso, bodice, vagha skirt, sash ───────────── */
{
  const armL = tube([[224, 362], [196, 402], [182, 452], [198, 494], [226, 520]], [42, 37, 33, 30, 28], 12);
  const armR = tube([[378, 362], [408, 322], [432, 270], [444, 216], [446, 176]], [42, 37, 33, 30, 28], 12);
  const band = (x, y, rot, w = 34) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="${-w / 2}" y="-5" width="${w}" height="10" rx="5" fill="url(#gd)" stroke="#6B4E0C" stroke-width="1"/><circle r="3.4" fill="url(#rb)"/></g>`;
  const fingers = [
    [430, 146, 20, -8], [440, 138, 25, -2], [450, 137, 25, 3], [459, 142, 21, 8],
  ]
    .map(([x, y, h, r]) => `<rect x="${x - 5}" y="${y - h}" width="10" height="${h + 8}" rx="5" transform="rotate(${r} ${x} ${y})" fill="url(#sk)" stroke="${HI}" stroke-width="1"/>`)
    .join('');
  out(
    'body',
    svg(
      `<path d="M276,298 C276,320 272,336 264,348 L336,348 C328,336 324,320 324,298 Z" fill="url(#sk)"/>
      <path d="M300,330 C262,330 236,338 218,352 C200,366 196,392 200,430 C204,480 214,520 222,560 L378,560 C386,520 396,480 400,430 C404,392 400,366 382,352 C364,338 338,330 300,330 Z" fill="url(#sk)" stroke="${OUT}" stroke-width="2"/>
      <path d="${armL.d}" fill="url(#sk)" stroke="${OUT}" stroke-width="2"/>
      <path d="${armR.d}" fill="url(#sk)" stroke="${OUT}" stroke-width="2"/>
      ${fingers}
      <path d="M432,176 C426,158 430,140 444,136 C458,134 466,148 462,170 C458,180 440,184 432,176 Z" fill="url(#sk)" stroke="${HI}" stroke-width="1.1"/>
      <path d="M430,168 C420,160 418,150 424,146" fill="none" stroke="${HI}" stroke-width="7" stroke-linecap="round"/>
      <path d="M214,512 C214,498 230,494 244,500 C256,506 256,526 244,536 C232,544 214,532 214,512 Z" fill="url(#sk)" stroke="${HI}" stroke-width="1.2"/>
      <path d="M224,508 C232,504 242,506 246,514 M222,520 C230,518 240,520 244,526" fill="none" stroke="${HI}" stroke-width="1" stroke-opacity=".8"/>
      ${band(205, 404, 62)}${band(414, 316, -57)}
      ${band(218, 506, 30, 30)}${band(446, 186, 4, 30)}${band(446, 196, 4, 30)}
      <path d="M232,388 C258,372 342,372 368,388 L384,560 L216,560 Z" fill="url(#cr)"/>
      <path d="M232,388 C258,372 342,372 368,388" fill="none" stroke="url(#gd)" stroke-width="6"/>
      <path d="M300,380 L300,556" stroke="url(#gd)" stroke-width="5"/>
      <path d="M232,388 C258,372 342,372 368,388" fill="none" stroke="#FFF1C2" stroke-width="1.6" stroke-dasharray="0 6" stroke-linecap="round"/>
      <path d="M222,548 L378,548 C420,620 470,700 500,790 L100,790 C130,700 180,620 222,548 Z" fill="url(#cr)"/>
      <path d="M222,548 L378,548 C420,620 470,700 500,790 L100,790 C130,700 180,620 222,548 Z" fill="url(#buti)"/>
      ${[-150, -100, -50, 0, 50, 100, 150].map((dx) => `<path d="M${300 + dx * 0.32},556 L${300 + dx * 1.3},788" stroke="#5E1216" stroke-opacity=".35" stroke-width="1.4"/>`).join('')}
      <path d="M150,700 C230,684 370,684 450,700" fill="none" stroke="url(#gd)" stroke-width="7"/>
      <path d="M150,700 C230,684 370,684 450,700" fill="none" stroke="#FFF1C2" stroke-width="1.4" stroke-dasharray="0 7" stroke-linecap="round"/>
      <path d="M104,772 C220,756 380,756 496,772 L500,790 L100,790 Z" fill="url(#gd)"/>
      <path d="M110,778 C220,764 380,764 490,778" fill="none" stroke="#7A1A1E" stroke-width="2.4" stroke-dasharray="1 7" stroke-linecap="round"/>
      <path d="M216,544 L384,544 L386,562 L214,562 Z" fill="url(#gd)" stroke="#6B4E0C" stroke-width="1"/>
      ${[236, 268, 300, 332, 364].map((x, i) => `<circle cx="${x}" cy="553" r="3.6" fill="url(${i % 2 ? '#tb' : '#rb'})"/>`).join('')}
      <path d="M286,562 L314,562 L324,708 L300,726 L276,708 Z" fill="url(#gd)" stroke="#6B4E0C" stroke-width="1"/>
      <path d="M290,600 L310,600 M292,640 L312,640 M294,680 L314,680" stroke="#7A1A1E" stroke-width="3"/>`,
      `${skin('sk')}${gold('gd')}${jewel('rb', '#E9706A', '#7E1A16')}${jewel('tb', '#5CC9BF', '#0B4F5A')}
      <linearGradient id="cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8342F"/><stop offset=".6" stop-color="#9A2427"/><stop offset="1" stop-color="#6E1619"/></linearGradient>
      <pattern id="buti" width="26" height="26" patternUnits="userSpaceOnUse">
        <path d="M13,7 C15,10 15,13 13,16 C11,13 11,10 13,7 Z" fill="#E8C766" fill-opacity=".7"/>
        <circle cx="2" cy="2" r="1.2" fill="#E8C766" fill-opacity=".5"/>
      </pattern>`,
    ),
  );
}

/* ───────────── garland: necklaces and the long vaijayanti mala (sways) ───────────── */
out(
  'garland',
  svg(
    `${beads('M232,360 C228,470 262,640 300,700 C338,640 372,470 368,360', { size: 11, gap: 0.8, a: '#FFFDF6', b: '#C2263F', hi: '#FFE3E8' })}
    ${[[250, 470], [350, 470], [272, 600], [328, 600]].map(([x, y]) => `<path d="M${x},${y} C${x + 8},${y - 6} ${x + 12},${y + 4} ${x + 6},${y + 12} C${x},${y + 8} ${x - 2},${y + 2} ${x},${y} Z" fill="#1B6B4A"/>`).join('')}
    ${beads('M248,352 C262,392 338,392 352,352', { size: 6.5, gap: 1.2, a: '#F3D677', b: '#C9A227', shadow: 'rgba(0,0,0,.4)' })}
    ${beads('M240,356 C254,424 346,424 360,356', { size: 5, gap: 1.6, a: '#FFFBF0', b: '#EADFC4', shadow: 'rgba(0,0,0,.35)' })}
    <path d="M300,408 C314,420 316,438 300,452 C284,438 286,420 300,408 Z" fill="url(#em)" stroke="#F3D677" stroke-width="3"/>
    <circle cx="300" cy="460" r="4" fill="#FFF8E8"/>
    ${beads('M236,360 C252,452 348,452 364,360', { size: 4, gap: 2, a: '#F3D677', b: '#B8922A', shadow: 'rgba(0,0,0,.35)' })}`,
    `${jewel('em', '#5FBF8C', '#0F4A31')}`,
  ),
);

/* ───────────── head: face, ears, earrings, tilak, nose pearl, chin diamond ───────────── */
{
  const kundal = (x) => `
    <circle cx="${x}" cy="288" r="12" fill="url(#gd)" stroke="#6B4E0C" stroke-width="1"/>
    <circle cx="${x}" cy="288" r="5" fill="url(#rb)"/>
    ${beads(`M${x},300 L${x},318`, { size: 4.5, gap: 1, a: '#FFFBF0', b: '#EADFC4', shadow: 'rgba(0,0,0,.3)' })}`;
  out(
    'head',
    svg(
      `<ellipse cx="219" cy="258" rx="11" ry="19" fill="url(#sk)" stroke="${OUT}" stroke-width="1.6"/>
      <ellipse cx="381" cy="258" rx="11" ry="19" fill="url(#sk)" stroke="${OUT}" stroke-width="1.6"/>
      <path d="M300,166 C350,166 382,204 382,252 C382,302 346,336 300,336 C254,336 218,302 218,252 C218,204 250,166 300,166 Z" fill="url(#sk)" stroke="${OUT}" stroke-width="2"/>
      <ellipse cx="256" cy="292" rx="22" ry="12" fill="#5468A6" fill-opacity=".18"/>
      <ellipse cx="344" cy="292" rx="22" ry="12" fill="#5468A6" fill-opacity=".18"/>
      <path d="M234,214 C250,203 274,203 290,212" fill="none" stroke="${HI}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M366,214 C350,203 326,203 310,212" fill="none" stroke="${HI}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M292,234 L292,190 M308,234 L308,190" stroke="#F6EBC8" stroke-width="3" stroke-linecap="round"/>
      <path d="M292,234 Q300,244 308,234" fill="none" stroke="#F6EBC8" stroke-width="3" stroke-linecap="round"/>
      <path d="M300,192 L300,236" stroke="#D9472F" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M294,272 Q300,284 306,272" fill="none" stroke="${HI}" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="309" cy="281" r="2.6" fill="none" stroke="#E8C766" stroke-width="1.2"/>
      <circle cx="310" cy="287" r="4.4" fill="#FFF8E8"/>
      <path d="M300,312 L303,319 L300,326 L297,319 Z" fill="#FFFFFF"/>
      <path d="M293,319 L307,319" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity=".8"/>
      ${kundal(212)}${kundal(388)}`,
      `${skin('sk')}${gold('gd')}${jewel('rb', '#E9706A', '#7E1A16')}`,
    ),
  );
}

/* ───────────── eyes: large lotus eyes (meenakshi) ───────────── */
const scleraL = 'M226,248 C238,228 270,222 293,244 C278,263 246,266 226,248 Z';
out(
  'eye-whites',
  svg(
    `<path d="${scleraL}" fill="url(#sc)"/>${mir(`<path d="${scleraL}" fill="url(#sc)"/>`)}`,
    `<linearGradient id="sc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9E3D2"/><stop offset=".45" stop-color="#FFFEF8"/><stop offset="1" stop-color="#F4EEDD"/></linearGradient>`,
  ),
);
const iris = (cx) => `
  <circle cx="${cx}" cy="245" r="13.5" fill="#1B2A55"/>
  <circle cx="${cx}" cy="245" r="10.5" fill="#06070D"/>
  <circle cx="${cx - 4}" cy="240.5" r="3.4" fill="#fff" fill-opacity=".92"/>
  <circle cx="${cx + 4.5}" cy="250" r="1.4" fill="#fff" fill-opacity=".55"/>`;
out('irises', svg(`${iris(261)}${iris(339)}`));
const lidL = `
  <path d="M218,250 C232,226 270,216 300,244 L300,180 L218,180 Z" fill="url(#lid)"/>
  <path d="M223,248 C236,229 270,222 293,244" fill="none" stroke="#020309" stroke-width="3.8" stroke-linecap="round"/>`;
out(
  'eyelids',
  svg(
    `${lidL}${mir(lidL)}`,
    `<linearGradient id="lid" x1="0" y1="180" x2="0" y2="250" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#24335F"/><stop offset="1" stop-color="#1B2650"/></linearGradient>`,
  ),
);
const linesL = `
  <path d="M228,250 C246,264 276,263 291,247" fill="none" stroke="#020309" stroke-width="2.2"/>
  <path d="M225,248 C220,245 216,244 211,244.5" fill="none" stroke="#020309" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M226,250 C244,268 278,268 294,247" fill="none" stroke="#E8C766" stroke-width="1" stroke-opacity=".55"/>`;
out('eye-lines', svg(`${linesL}${mir(linesL)}`));

/* ───────────── lips: gentle smile (widens on a loop) ───────────── */
out(
  'lips',
  svg(
    `<path d="M284,298 C291,293 296,295 300,296.5 C304,295 309,293 316,298 C309,301.5 291,301.5 284,298 Z" fill="#B8323E"/>
    <path d="M285.5,299 C293,309 307,309 314.5,299 C307,302.5 293,302.5 285.5,299 Z" fill="#C9414B"/>
    <path d="M294,304 C298,306 302,306 306,304" fill="none" stroke="#F08C95" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M281,296.5 C283,297.5 284,298 285,298.6 M319,296.5 C317,297.5 316,298 315,298.6" stroke="#7E1A24" stroke-width="1.2" stroke-linecap="round"/>`,
  ),
);

/* ───────────── crown: jewelled pagh with sarpech and peacock feather ───────────── */
{
  // Small peacock feather rising from the crown, tilted to the viewer's left.
  let barbs = '';
  for (let i = 0; i < 26; i++) {
    const t = i / 25;
    const x = 298 - t * 46, y = 100 - t * 86;
    const reach = 6 + Math.sin(t * Math.PI) * 18;
    barbs += `<path d="M${f(x)},${f(y)} l${f(-reach * 0.9)},${f(-reach * 0.5)} M${f(x)},${f(y)} l${f(reach * 0.5)},${f(-reach * 0.95)}" stroke="#2F8A5B" stroke-opacity=".75" stroke-width="1"/>`;
  }
  out(
    'crown',
    svg(
      `${barbs}
      <path d="M298,104 C288,80 270,48 252,14" fill="none" stroke="#B08A22" stroke-width="2.2" stroke-linecap="round"/>
      <g transform="translate(258 26) rotate(-28)">
        <ellipse rx="15" ry="19" fill="#B8922A"/><ellipse rx="12" ry="15.5" cy="1" fill="#2F8A5B"/>
        <ellipse rx="9" ry="12" cy="2" fill="#0E7C7B"/>
        <path d="M0,-5 C5,-7 7,-1 5,4 C4,8 2,10 0,11 C-2,10 -4,8 -5,4 C-7,-1 -5,-7 0,-5 Z" fill="#0B3C5D"/>
      </g>
      <path d="M212,196 C206,146 240,96 300,92 C360,96 394,146 388,196 C356,182 244,182 212,196 Z" fill="url(#gd)" stroke="#6B4E0C" stroke-width="1.6"/>
      <path d="M222,160 C262,128 330,116 376,150 M216,180 C262,150 340,140 384,172 M236,128 C270,108 322,104 356,120" fill="none" stroke="#9A2427" stroke-width="7" stroke-linecap="round" stroke-opacity=".85"/>
      <path d="M222,160 C262,128 330,116 376,150 M216,180 C262,150 340,140 384,172" fill="none" stroke="#FFF1C2" stroke-width="1.3" stroke-dasharray="0 6" stroke-linecap="round"/>
      <path d="M210,198 C246,184 354,184 390,198 L390,180 C354,168 246,168 210,180 Z" fill="url(#gdd)" stroke="#6B4E0C" stroke-width="1.2"/>
      ${[222, 246, 272, 300, 328, 354, 378].map((x, i) => `<circle cx="${x}" cy="${i === 3 ? 182 : 186 - Math.abs(3 - i) * 0.6}" r="${i === 3 ? 5 : 3.4}" fill="url(${i % 2 ? '#tb' : '#rb'})" stroke="#6B4E0C" stroke-width=".6"/>`).join('')}
      <path d="M300,116 C312,128 314,146 300,160 C286,146 288,128 300,116 Z" fill="url(#rb)" stroke="#F3D677" stroke-width="3"/>
      ${beads('M288,162 C292,170 308,170 312,162', { size: 3.6, gap: 1.4, a: '#FFFBF0', b: '#EADFC4', shadow: 'rgba(0,0,0,.3)' })}
      <path d="M300,116 C296,106 298,98 304,92" fill="none" stroke="#F3D677" stroke-width="2.4" stroke-linecap="round"/>
      ${beads('M214,198 C212,212 214,226 218,238', { size: 4.2, gap: 1.2, a: '#FFFBF0', b: '#EADFC4', shadow: 'rgba(0,0,0,.3)' })}
      ${beads('M386,198 C388,212 386,226 382,238', { size: 4.2, gap: 1.2, a: '#FFFBF0', b: '#EADFC4', shadow: 'rgba(0,0,0,.3)' })}`,
      `${gold('gd')}${jewel('rb', '#E9706A', '#7E1A16')}${jewel('tb', '#5CC9BF', '#0B4F5A')}
      <linearGradient id="gdd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C79C2E"/><stop offset="1" stop-color="#8C6A12"/></linearGradient>`,
    ),
  );
}

console.log('shreenathji layers written to', dir);
