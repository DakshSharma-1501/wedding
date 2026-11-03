import illustration from '../../assets/couple/illustration.svg?url';

/**
 * Couple photos:
 *   - /photos/ (e.g. wed1.jpeg ... wed6.jpeg)
 *   - /src/assets/couple/ (hero.*, gallery-01.*, ...)
 */
const files = import.meta.glob<string>(
  ['/src/assets/couple/*.{avif,webp,jpg,jpeg,png}', '/photos/*.{avif,webp,jpg,jpeg,png}'],
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
);

const entries = Object.entries(files).sort(([a], [b]) =>
  a.localeCompare(b, undefined, { numeric: true }),
);

export const heroPhoto: string | undefined = entries.find(([p]) => /\/hero\.\w+$/.test(p))?.[1];
export const heroIllustration: string = illustration;

export interface GalleryItem {
  /** Real photo URL, or undefined for an illustrated placeholder. */
  src?: string;
  caption: string;
  /** Placeholder palette. */
  tone: string;
  shape: 'polaroid' | 'arch';
}

const PLACEHOLDERS: Omit<GalleryItem, 'src'>[] = [
  { caption: 'Where it all began', tone: 'from-[#F7E3C9] to-[#E8C9A0]', shape: 'arch' },
  { caption: 'Winter in Udaipur', tone: 'from-[#D9EEEA] to-[#9FD1C9]', shape: 'polaroid' },
  { caption: 'The proposal', tone: 'from-[#F9DCE2] to-[#E9A9B5]', shape: 'polaroid' },
  { caption: 'Our families, together', tone: 'from-[#FBEFD0] to-[#EBCB82]', shape: 'arch' },
  { caption: 'Chai & long talks', tone: 'from-[#E4E9F6] to-[#A9B9DF]', shape: 'polaroid' },
  { caption: 'Forever starts now', tone: 'from-[#E1EFE6] to-[#9CC9AE]', shape: 'arch' },
];

const photoFolderEntries = entries.filter(([p]) => p.startsWith('/photos/'));
const coupleFolderEntries = entries.filter(
  ([p]) => p.startsWith('/src/assets/couple/') && /\/gallery-[^/]+$/.test(p),
);

// Prefer the photos folder if populated, otherwise couple gallery assets
const galleryEntries = photoFolderEntries.length > 0 ? photoFolderEntries : coupleFolderEntries;
const photos = galleryEntries.map(([, url]) => url);

export const gallery: GalleryItem[] = photos.length
  ? photos.map((src, i) => ({
      src,
      caption: PLACEHOLDERS[i]?.caption ?? `Moment ${i + 1}`,
      tone: PLACEHOLDERS[i % PLACEHOLDERS.length]?.tone ?? '',
      shape: PLACEHOLDERS[i]?.shape ?? (i % 3 === 0 ? 'arch' : 'polaroid'),
    }))
  : PLACEHOLDERS;
