// Generates the placeholder Shiv–Parvati phere sprites → src/assets/deities/shivparvati/
// Run: node tools/placeholder-art/shivparvati.mjs
// Sprites (not full-artboard stacks): shiv.svg & parvati.svg (120×220, facing right),
// nandi.svg (220×150, facing left), garland.svg (80×80 varmala ring).
import { fileURLToPath } from 'node:url';
import { beads, f, write } from './lib.mjs';

const dir = fileURLToPath(new URL('../../src/assets/deities/shivparvati/', import.meta.url));
const svg = (w, h, body, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${
    defs ? `<defs>${defs}</defs>` : ''
  }${body}</svg>\n`;
const out = (name, content) => write(`${dir}${name}.svg`, content);
const gold = `<linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8E294"/><stop offset=".5" stop-color="#D9B04A"/><stop offset="1" stop-color="#9C7A16"/></linearGradient>`;

/* ───────────── Shiv (facing right) ───────────── */
{
  let stripes = '';
  for (let i = 0; i < 9; i++) {
    const y = 128 + i * 8.4;
    stripes += `<path d="M${36 + (i % 2) * 6},${f(y)} q6,-3 10,1 M${60 + (i % 3) * 4},${f(y + 3)} q6,-3 10,1" stroke="#3A2410" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  }
  out(
    'shiv',
    svg(
      120,
      220,
      `<path d="M50,200 L46,216 L58,216 L60,200 Z M66,200 L70,216 L82,215 L76,200 Z" fill="url(#sk)"/>
      <path d="M38,64 C46,58 74,58 82,64 C90,80 90,104 86,124 L34,124 C30,104 30,80 38,64 Z" fill="url(#sk)"/>
      <path d="M32,122 L88,122 C94,150 92,180 86,204 L34,204 C28,180 26,150 32,122 Z" fill="#E8901C"/>
      ${stripes}
      <path d="M32,122 L88,122 L88,130 L32,130 Z" fill="url(#gd)"/>
      <path d="M78,70 C92,84 96,104 92,120 C90,128 84,128 82,120 C84,106 82,92 74,80 Z" fill="url(#sk)"/>
      <rect x="80" y="86" width="12" height="5" rx="2.5" fill="url(#gd)" transform="rotate(70 86 88)"/>
      ${beads('M44,66 C48,92 72,92 78,66', { size: 4.2, gap: 1, a: '#7A3E1A', b: '#5A2A10', hi: '#C08050', shadow: 'rgba(0,0,0,.3)' })}
      <path d="M46,62 C52,74 70,74 76,62" fill="none" stroke="#2F8A5B" stroke-width="4" stroke-linecap="round"/>
      <circle cx="76" cy="62" r="3.2" fill="#2F8A5B"/>
      <path d="M52,52 L52,62 L68,62 L68,52 Z" fill="url(#sk)"/>
      <path d="M60,26 C74,26 80,36 80,46 C80,50 84,52 82,55 C80,58 78,60 74,62 C66,64 54,62 48,54 C42,46 46,26 60,26 Z" fill="url(#sk)"/>
      <circle cx="73" cy="42" r="1.8" fill="#0B0F20"/>
      <path d="M64,36 L76,36 M64,39.5 L77,39.5 M64,43 L76,43" stroke="#F6F1E4" stroke-width="1.4" stroke-linecap="round"/>
      <circle cx="70" cy="33.5" r="1.4" fill="#D9472F"/>
      <path d="M74,55 C77,56 79,55 80,53" fill="none" stroke="#2C3E70" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M44,40 C38,22 50,8 64,10 C74,12 78,20 74,28 C68,22 56,22 50,30 C46,36 46,40 44,40 Z" fill="#3A2A1E"/>
      <path d="M50,16 C54,6 64,2 72,6 C66,8 60,12 58,18 Z" fill="#4A3624"/>
      <path d="M44,40 C38,52 36,62 40,72" fill="none" stroke="#3A2A1E" stroke-width="5" stroke-linecap="round"/>
      <path d="M70,4 A7,7 0 1 0 78,13 A5.5,5.5 0 1 1 70,4 Z" fill="#FFF3C4"/>
      <path d="M58,8 C52,2 46,4 42,-2 C40,-6 36,-6 32,-4" fill="none" stroke="#8FD3E8" stroke-width="2.4" stroke-linecap="round"/>`,
      `${gold}<linearGradient id="sk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8AA8DD"/><stop offset="1" stop-color="#4E6FB0"/></linearGradient>`,
    ),
  );
}

/* ───────────── Parvati (facing right) ───────────── */
out(
  'parvati',
  svg(
    120,
    220,
    `<path d="M40,66 C48,60 72,60 80,66 C86,80 86,100 84,118 L36,118 C34,100 34,80 40,66 Z" fill="#B8202E"/>
    <path d="M34,116 L86,116 C98,150 102,184 104,214 L18,214 C20,184 24,150 34,116 Z" fill="url(#sr)"/>
    <path d="M18,206 C46,200 76,200 104,206 L104,214 L18,214 Z" fill="url(#gd)"/>
    <path d="M30,150 C52,146 72,146 94,150" fill="none" stroke="url(#gd)" stroke-width="3"/>
    <path d="M80,70 C90,84 92,98 88,108 C86,114 80,114 80,108 C82,100 80,90 74,82 Z" fill="url(#sk)"/>
    <rect x="80" y="100" width="10" height="4" rx="2" fill="url(#gd)" transform="rotate(60 85 102)"/>
    ${beads('M48,66 C52,86 68,86 72,66', { size: 3.4, gap: 1.2, a: '#F3D677', b: '#C9A227', shadow: 'rgba(0,0,0,.25)' })}
    <path d="M53,52 L53,62 L67,62 L67,52 Z" fill="url(#sk)"/>
    <path d="M60,28 C72,28 78,36 78,46 C78,50 81,52 79,55 C77,58 75,60 72,61 C65,63 54,61 49,54 C44,46 47,28 60,28 Z" fill="url(#sk)"/>
    <circle cx="71" cy="42" r="1.7" fill="#2A1A10"/>
    <path d="M68,38.5 C70,37.5 73,37.5 75,38.5" stroke="#2A1A10" stroke-width="1" fill="none"/>
    <circle cx="74.5" cy="34.5" r="1.4" fill="#C2263F"/>
    <circle cx="77" cy="49" r="2.4" fill="none" stroke="#E8C766" stroke-width="1"/>
    <path d="M71,55.5 C73.5,56.5 75.5,56 77,54.5" fill="none" stroke="#B8323E" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M58,30 C58,24 60,24 62,30" stroke="#C2263F" stroke-width="1.6" fill="none"/>
    <circle cx="60" cy="33" r="2" fill="url(#gd)"/>
    <path d="M42,52 C36,30 50,16 64,18 C74,20 80,26 82,32 C74,26 58,24 52,32 C48,38 46,46 48,56 C46,90 42,120 30,150 C26,120 30,80 42,52 Z" fill="url(#vl)"/>
    <path d="M82,32 C74,26 58,24 52,32 C48,38 46,46 48,56" fill="none" stroke="url(#gd)" stroke-width="2.4"/>
    <circle cx="55" cy="52" r="3" fill="url(#gd)"/>`,
    `${gold}
    <linearGradient id="sk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6D4B0"/><stop offset="1" stop-color="#DDA87E"/></linearGradient>
    <linearGradient id="sr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C2263F"/><stop offset="1" stop-color="#8A1A24"/></linearGradient>
    <linearGradient id="vl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D93A4A" stop-opacity=".95"/><stop offset="1" stop-color="#9A1A2A" stop-opacity=".9"/></linearGradient>`,
  ),
);

/* ───────────── Nandi (seated, facing left toward the fire) ───────────── */
out(
  'nandi',
  svg(
    220,
    150,
    `<ellipse cx="116" cy="140" rx="92" ry="8" fill="#000" fill-opacity=".2"/>
    <path d="M60,128 C50,96 70,66 110,62 C150,58 190,70 200,100 C206,120 200,136 186,138 L76,138 C68,138 62,134 60,128 Z" fill="url(#bd)"/>
    <path d="M96,66 C100,48 116,44 126,54 C130,60 128,66 122,68 Z" fill="url(#bd)"/>
    <path d="M100,72 C130,70 160,76 176,92 C160,108 120,110 96,100 Z" fill="#B8202E"/>
    <path d="M100,72 C130,70 160,76 176,92 C160,108 120,110 96,100" fill="none" stroke="url(#gd)" stroke-width="3"/>
    <path d="M110,84 C130,84 148,88 160,94" fill="none" stroke="#F3D677" stroke-width="1.4" stroke-dasharray="0 5" stroke-linecap="round"/>
    <path d="M70,70 C56,62 40,64 30,76 C22,86 22,100 30,108 C38,114 50,112 58,104 L72,92 Z" fill="url(#bd)"/>
    <path d="M30,100 C28,108 32,114 38,114 C44,114 46,108 44,102 Z" fill="#E7C9B5"/>
    <circle cx="44" cy="84" r="2.6" fill="#1E1B16"/>
    <path d="M52,70 C50,58 54,48 62,44 M64,72 C66,60 72,52 80,50" fill="none" stroke="#D9C9A8" stroke-width="5" stroke-linecap="round"/>
    <path d="M52,70 C50,58 54,48 62,44 M64,72 C66,60 72,52 80,50" fill="none" stroke="url(#gd)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 5"/>
    <path d="M72,74 C68,62 60,58 54,60 C60,64 64,70 66,78 Z" fill="#E9DFCC"/>
    ${beads('M58,104 C66,116 82,118 92,108', { size: 5.5, gap: .8, a: '#F59E0B', b: '#E46F0A', hi: '#FFE3A1' })}
    <path d="M74,112 C74,120 80,124 84,122 C86,118 84,112 80,110 Z" fill="url(#gd)"/>
    <path d="M196,104 C210,110 214,124 206,134" fill="none" stroke="#E9DFCC" stroke-width="4" stroke-linecap="round"/>
    <path d="M82,136 C90,130 104,130 110,136 M150,136 C158,130 172,130 178,136" fill="none" stroke="#C9B89A" stroke-width="2"/>`,
    `${gold}<linearGradient id="bd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF7EF"/><stop offset="1" stop-color="#DCCFB8"/></linearGradient>`,
  ),
);

/* ───────────── varmala (garland ring) ───────────── */
out(
  'garland',
  svg(
    80,
    80,
    `${beads('M40,10 C60,10 70,28 70,40 C70,58 54,70 40,70 C26,70 10,58 10,40 C10,28 20,10 40,10 Z', { size: 8.5, gap: .8, a: '#F59E0B', b: '#FFFDF6', hi: '#FFE3A1' })}
    <circle cx="40" cy="70" r="5" fill="#C2263F"/>`,
  ),
);

console.log('shivparvati sprites written to', dir);
