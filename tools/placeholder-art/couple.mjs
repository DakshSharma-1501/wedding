// Generates the placeholder couple illustration → src/assets/couple/illustration.svg
// Run: node tools/placeholder-art/couple.mjs
// Bride (left, facing right) and groom (right, facing left), hands joined, under a floral arch.
// Replace it by dropping hero.webp / hero.jpg into src/assets/couple/ — no code changes.
import { fileURLToPath } from 'node:url';
import { beads, write } from './lib.mjs';

const file = fileURLToPath(new URL('../../src/assets/couple/illustration.svg', import.meta.url));
const W = 480;
const H = 600;

const bride = `
  <path d="M120,560 C116,470 120,400 136,340 L224,340 C240,400 250,470 252,560 Z" fill="url(#lh)"/>
  <path d="M116,548 C160,540 210,540 254,548 L256,566 L114,566 Z" fill="url(#gd)"/>
  <path d="M128,430 C170,424 210,424 246,430" fill="none" stroke="url(#gd)" stroke-width="4"/>
  <path d="M132,486 C172,480 214,480 250,486" fill="none" stroke="url(#gd)" stroke-width="3"/>
  <path d="M146,240 C160,232 202,232 214,240 C222,270 224,310 222,346 L138,346 C136,310 138,270 146,240 Z" fill="#B8202E"/>
  <path d="M206,262 C226,280 238,300 244,318 C246,326 240,330 234,326 C226,312 214,298 200,288 Z" fill="url(#sb)"/>
  ${beads('M156,242 C164,270 196,270 204,242', { size: 4.4, gap: 1, a: '#F3D677', b: '#C9A227', shadow: 'rgba(0,0,0,.25)' })}
  <path d="M168,212 L168,240 L192,240 L192,212 Z" fill="url(#sb)"/>
  <path d="M180,150 C204,150 214,166 214,184 C214,190 220,194 216,198 C212,204 208,208 202,210 C190,214 170,210 162,198 C154,184 158,150 180,150 Z" fill="url(#sb)"/>
  <circle cx="200" cy="178" r="2.6" fill="#2A1A10"/>
  <path d="M195,172 C198,170 202,170 205,172" stroke="#2A1A10" stroke-width="1.4" fill="none"/>
  <circle cx="204" cy="166" r="2" fill="#C2263F"/>
  <circle cx="211" cy="190" r="4" fill="none" stroke="#E8C766" stroke-width="1.6"/>
  <path d="M202,200 C206,202 209,201 211,198" stroke="#B8323E" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M176,154 C176,146 180,146 182,154" stroke="#C2263F" stroke-width="2.2" fill="none"/>
  <circle cx="180" cy="158" r="3" fill="url(#gd)"/>
  <path class="dupatta" d="M152,190 C144,150 166,128 188,130 C206,132 216,142 220,152 C206,142 182,140 172,152 C164,164 162,182 166,206 C160,280 150,360 128,430 C110,360 126,260 152,190 Z" fill="url(#vl)"/>
  <path d="M220,152 C206,142 182,140 172,152 C164,164 162,182 166,206" fill="none" stroke="url(#gd)" stroke-width="3"/>
  <circle cx="168" cy="196" r="4.4" fill="url(#gd)"/>`;

const groom = `
  <path d="M262,560 L262,340 L352,340 L352,560 Z" fill="#E9DFCC"/>
  <path d="M258,566 L356,566 L356,548 L258,548 Z" fill="#C9B89A"/>
  <path d="M252,236 C266,228 346,228 360,236 C372,300 372,380 366,470 L248,470 C242,380 242,300 252,236 Z" fill="url(#sh)"/>
  ${[260, 284, 308, 332, 356, 380, 404, 428].map((y) => `<circle cx="306" cy="${y}" r="3" fill="url(#gd)"/>`).join('')}
  <path d="M306,236 L306,470" stroke="#C9A227" stroke-width="1.4" stroke-opacity=".7"/>
  <path d="M252,236 C268,226 290,224 306,234 L306,250 C288,240 270,244 256,252 Z" fill="url(#gd)" opacity=".85"/>
  <path d="M356,236 C346,300 340,380 344,470 L366,470 C372,380 372,300 360,236 Z" fill="#8A1A24"/>
  <path d="M248,270 C230,286 220,304 214,318 C212,326 218,330 224,326 C232,312 244,298 258,288 Z" fill="url(#sk)"/>
  <path d="M248,270 C238,280 232,288 228,296" stroke="url(#sh)" stroke-width="16" stroke-linecap="round"/>
  ${beads('M268,240 C276,300 336,300 344,240', { size: 6.5, gap: 1, a: '#FFFDF6', b: '#F4EBD6', shadow: 'rgba(0,0,0,.2)' })}
  <path d="M292,212 L292,238 L318,238 L318,212 Z" fill="url(#sk)"/>
  <path d="M302,150 C278,150 268,166 268,184 C268,190 262,194 266,198 C270,204 274,208 280,210 C292,214 312,210 320,198 C328,184 324,150 302,150 Z" fill="url(#sk)"/>
  <circle cx="282" cy="178" r="2.6" fill="#2A1A10"/>
  <path d="M277,171 C280,169 284,169 287,171" stroke="#2A1A10" stroke-width="1.6" fill="none"/>
  <path d="M276,198 C280,200 284,200 286,197" stroke="#7E3A24" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M284,192 C288,195 296,195 300,192" stroke="#3A2414" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M266,166 C262,134 280,112 306,112 C330,112 342,130 338,160 C326,150 290,146 266,166 Z" fill="url(#sf)"/>
  <path d="M268,160 C290,140 320,138 338,152 M272,146 C292,128 322,126 336,138" fill="none" stroke="#F3D677" stroke-width="2.4" stroke-opacity=".8"/>
  <path d="M336,150 C356,166 360,200 352,240" fill="none" stroke="#8A1A24" stroke-width="12" stroke-linecap="round"/>
  <path d="M296,118 C294,100 300,86 312,76" fill="none" stroke="#F3D677" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="312" cy="80" rx="6" ry="10" transform="rotate(30 312 80)" fill="#FFFDF6"/>
  <circle cx="296" cy="128" r="6" fill="url(#rb)" stroke="#F3D677" stroke-width="2"/>`;

const arch = `
  <path d="M60,560 L60,250 C60,140 150,60 240,60 C330,60 420,140 420,250 L420,560" fill="none" stroke="url(#gd)" stroke-width="3"/>
  <path d="M74,560 L74,252 C74,150 156,76 240,76 C324,76 406,150 406,252 L406,560" fill="none" stroke="#E8D5A3" stroke-width="1.4" stroke-dasharray="0 8" stroke-linecap="round"/>
  ${Array.from({ length: 15 }, (_, i) => {
    const a = Math.PI * (i / 14);
    const x = 240 - Math.cos(a) * 172;
    const y = 250 - Math.sin(a) * 178;
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="${i % 2 ? 7 : 9}" fill="${i % 3 === 0 ? '#F4B6C2' : i % 3 === 1 ? '#F59E0B' : '#FFFDF6'}" stroke="#C9A227" stroke-width=".6"/><ellipse cx="10" cy="4" rx="7" ry="3" transform="rotate(${(i * 23) % 360})" fill="#2F8A5B"/></g>`;
  }).join('')}`;

write(
  file,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8E294"/><stop offset=".5" stop-color="#D9B04A"/><stop offset="1" stop-color="#9C7A16"/></linearGradient>
    <radialGradient id="rb" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#5CC9BF"/><stop offset="1" stop-color="#0B4F5A"/></radialGradient>
    <linearGradient id="sb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6D4B0"/><stop offset="1" stop-color="#DDA87E"/></linearGradient>
    <linearGradient id="sk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9BE92"/><stop offset="1" stop-color="#C98E62"/></linearGradient>
    <linearGradient id="lh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C2263F"/><stop offset="1" stop-color="#7E1020"/></linearGradient>
    <linearGradient id="vl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E05A6A" stop-opacity=".92"/><stop offset="1" stop-color="#A31F30" stop-opacity=".88"/></linearGradient>
    <linearGradient id="sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF5E8"/><stop offset="1" stop-color="#E6D9BF"/></linearGradient>
    <linearGradient id="sf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B8202E"/><stop offset="1" stop-color="#7E1020"/></linearGradient>
    <radialGradient id="glow" cx="240" cy="300" r="240" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFF6DC"/><stop offset="1" stop-color="#FFF6DC" stop-opacity="0"/></radialGradient>
  </defs>
  <circle cx="240" cy="300" r="240" fill="url(#glow)"/>
  ${arch}
  <ellipse cx="240" cy="568" rx="170" ry="10" fill="#7A5C2E" fill-opacity=".15"/>
  ${bride}
  ${groom}
  <circle cx="232" cy="322" r="9" fill="url(#sb)"/>
  <path d="M226,316 C232,326 238,326 242,318" fill="none" stroke="#C2263F" stroke-width="1.6"/>
</svg>
`,
);
console.log('couple illustration written to', file);
