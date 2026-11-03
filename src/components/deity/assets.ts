import type { DeityId, DeityRig } from './types';

/**
 * Drop-in art resolver. Every file in src/assets/deities/<deity>/ is picked up at build
 * time. If several formats share a layer name, the best one wins:
 *   avif > webp > png > svg
 * so dropping `body.webp` next to the placeholder `body.svg` replaces it — no code edits.
 */
const files = import.meta.glob<string>('/src/assets/deities/*/*.{avif,webp,png,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const RANK: Record<string, number> = { avif: 4, webp: 3, png: 2, svg: 1 };
const table = new Map<string, { url: string; rank: number }>();

for (const [path, url] of Object.entries(files)) {
  const match = /deities\/([^/]+)\/([^/]+)\.(avif|webp|png|svg)$/.exec(path);
  if (!match) continue;
  const [, deity, layer, ext] = match;
  const key = `${deity}/${layer}`;
  const rank = RANK[ext ?? 'svg'] ?? 0;
  const current = table.get(key);
  if (!current || rank > current.rank) table.set(key, { url, rank });
}

export function layerUrl(deity: DeityId, layer: string): string | undefined {
  return table.get(`${deity}/${layer}`)?.url;
}

/** Every resolved image a rig needs — used by the preloader. */
export function rigImageUrls(rig: DeityRig): string[] {
  const names: string[] = [];
  for (const layer of rig.layers) {
    if (layer === 'eyes') {
      if (rig.eyes) {
        const { sclera, iris, lid, lines } = rig.eyes;
        names.push(sclera, iris, lid, ...(lines ? [lines] : []));
      }
    } else {
      names.push(layer.name);
    }
  }
  return names.map((n) => layerUrl(rig.id, n)).filter((u): u is string => Boolean(u));
}
