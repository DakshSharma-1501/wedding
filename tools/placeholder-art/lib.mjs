// Shared helpers for generating the placeholder deity layers.
// Every layer is a full-artboard transparent SVG so layers align by stacking.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export const W = 600;
export const H = 720;

export const f = (n) => Number(n.toFixed(2));

export function svg(body, defs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${
    defs ? `<defs>${defs}</defs>` : ''
  }${body}</svg>\n`;
}

export function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.replace(/\n\s+/g, '\n').replace(/>\s+</g, '><'));
}

/** Mirror a fragment across the vertical centre line. */
export const mirror = (body) => `<g transform="matrix(-1 0 0 1 ${W} 0)">${body}</g>`;

/** Catmull-Rom sampling through control points, carrying a scalar (e.g. width) along. */
export function spline(points, values = [], samples = 14) {
  const out = [];
  const n = points.length;
  const get = (i) => points[Math.max(0, Math.min(n - 1, i))];
  const val = (i) => values[Math.max(0, Math.min(n - 1, i))] ?? 0;
  for (let i = 0; i < n - 1; i++) {
    const p0 = get(i - 1),
      p1 = get(i),
      p2 = get(i + 1),
      p3 = get(i + 2);
    for (let s = 0; s < samples; s++) {
      const t = s / samples,
        t2 = t * t,
        t3 = t2 * t;
      const c = (a, b, c2, d) =>
        0.5 *
        (2 * b +
          (-a + c2) * t +
          (2 * a - 5 * b + 4 * c2 - d) * t2 +
          (-a + 3 * b - 3 * c2 + d) * t3);
      out.push({
        x: c(p0[0], p1[0], p2[0], p3[0]),
        y: c(p0[1], p1[1], p2[1], p3[1]),
        v: val(i) + (val(i + 1) - val(i)) * t,
      });
    }
  }
  const last = points[n - 1];
  out.push({ x: last[0], y: last[1], v: val(n - 1) });
  return out;
}

export function normals(pts) {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)],
      b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b.x - a.x,
      dy = b.y - a.y,
      len = Math.hypot(dx, dy) || 1;
    return { nx: -dy / len, ny: dx / len, tx: dx / len, ty: dy / len };
  });
}

/** Closed outline of a variable-width tube along a centreline, with a round end cap. */
export function tube(points, widths, samples = 14) {
  const pts = spline(points, widths, samples);
  const ns = normals(pts);
  const left = pts.map((p, i) => [p.x + ns[i].nx * p.v * 0.5, p.y + ns[i].ny * p.v * 0.5]);
  const right = pts.map((p, i) => [p.x - ns[i].nx * p.v * 0.5, p.y - ns[i].ny * p.v * 0.5]);
  const end = pts[pts.length - 1];
  const r = f(end.v * 0.5);
  let d = `M${f(left[0][0])},${f(left[0][1])}`;
  for (const [x, y] of left.slice(1)) d += ` L${f(x)},${f(y)}`;
  const [rx, ry] = right[right.length - 1];
  d += ` A${r},${r} 0 0 1 ${f(rx)},${f(ry)}`;
  for (const [x, y] of right.slice(0, -1).reverse()) d += ` L${f(x)},${f(y)}`;
  return { d: `${d} Z`, pts, ns };
}

/** Polyline path through spline samples. */
export function curve(points, samples = 14) {
  const pts = spline(points, [], samples);
  return pts.map((p, i) => `${i ? 'L' : 'M'}${f(p.x)},${f(p.y)}`).join(' ');
}

/**
 * A string of beads along a path using round-capped zero-length dashes:
 * cheap, crisp, and alternates two colours with a highlight.
 */
export function beads(d, { size, gap, a, b, hi = '#fff6dc', shadow = 'rgba(90,50,10,.35)' }) {
  const step = size + gap;
  return `
    <path d="${d}" fill="none" stroke="${shadow}" stroke-width="${size + 1.6}" stroke-linecap="round" stroke-dasharray="0 ${step}" transform="translate(0.8 1.2)"/>
    <path d="${d}" fill="none" stroke="${a}" stroke-width="${size}" stroke-linecap="round" stroke-dasharray="0 ${step * 2}"/>
    <path d="${d}" fill="none" stroke="${b}" stroke-width="${size}" stroke-linecap="round" stroke-dasharray="0 ${step * 2}" stroke-dashoffset="${-step}"/>
    <path d="${d}" fill="none" stroke="${hi}" stroke-opacity=".75" stroke-width="${size * 0.32}" stroke-linecap="round" stroke-dasharray="0 ${step}" transform="translate(${-size * 0.18} ${-size * 0.2})"/>`;
}

/** Repeat a fragment around a centre. */
export function radial(cx, cy, count, fragment, offset = 0) {
  let out = '';
  for (let i = 0; i < count; i++) {
    out += `<g transform="rotate(${f(offset + (360 / count) * i)} ${cx} ${cy})">${fragment}</g>`;
  }
  return out;
}

/** Pointed petal with its base at (0,0) pointing up (-y). */
export function petalPath(length, halfWidth) {
  const L = length,
    w = halfWidth;
  return `M0,0 C${f(w * 1.15)},${f(-L * 0.28)} ${f(w * 0.95)},${f(-L * 0.78)} 0,${f(-L)} C${f(-w * 0.95)},${f(-L * 0.78)} ${f(-w * 1.15)},${f(-L * 0.28)} 0,0 Z`;
}
