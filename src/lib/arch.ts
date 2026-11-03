const f = (n: number) => Number(n.toFixed(2));

export interface ArchOptions {
  /** Inset from every edge of the w×h box. */
  inset?: number;
  /** 0 = round arch, ~0.35 = classic pointed jharokha arch. */
  pointiness?: number;
  /** Cusped (foliated) lobes per side. 0 = smooth arch. */
  lobes?: number;
}

/**
 * SVG path for a pointed (optionally multifoil/cusped) Mughal-Rajput arch filling w×h.
 * Two circular arcs meet at the apex; cusped arches replace each arc segment with a lobe.
 */
export function archPath(w: number, h: number, opts: ArchOptions = {}): string {
  const inset = opts.inset ?? 0;
  const lobes = opts.lobes ?? 0;
  const left = inset;
  const right = w - inset;
  const top = inset;
  const bottom = h - inset;
  const a = (right - left) / 2;
  const cx = left + a;
  const e = a * (opts.pointiness ?? 0.35);
  const R = a + e;
  const archH = Math.sqrt(a * a + 2 * a * e);
  const springY = top + archH;
  const alpha = Math.atan2(archH, e);

  let d = `M${f(left)},${f(bottom)} L${f(left)},${f(springY)}`;
  if (lobes === 0) {
    d += ` A${f(R)},${f(R)} 0 0 1 ${f(cx)},${f(top)}`;
    d += ` A${f(R)},${f(R)} 0 0 1 ${f(right)},${f(springY)}`;
  } else {
    const point = (i: number): [number, number] => {
      const t = alpha * (i / lobes);
      return [cx + e - R * Math.cos(t), springY - R * Math.sin(t)];
    };
    const lobe = (p: [number, number], q: [number, number]) => {
      const r = Math.hypot(q[0] - p[0], q[1] - p[1]) * 0.6;
      return ` A${f(r)},${f(r)} 0 0 1 ${f(q[0])},${f(q[1])}`;
    };
    const mirror = (p: [number, number]): [number, number] => [2 * cx - p[0], p[1]];
    for (let i = 1; i <= lobes; i++) d += lobe(point(i - 1), point(i));
    for (let i = lobes; i > 0; i--) d += lobe(mirror(point(i)), mirror(point(i - 1)));
  }
  d += ` L${f(right)},${f(bottom)} Z`;
  return d;
}
