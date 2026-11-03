/* Self-hosted fonts via @fontsource. Each CSS file declares every subset with a
   unicode-range, so browsers only download the glyph ranges a page actually uses. */
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/tiro-devanagari-hindi/400.css';

/** Font faces the loader waits for before the envelope appears. */
export const CRITICAL_FONTS = [
  '500 1em "Cormorant Garamond"',
  'italic 500 1em "Cormorant Garamond"',
  '600 1em "Cormorant Garamond"',
  '300 1em "Poppins"',
  '400 1em "Poppins"',
  '400 1em "Tiro Devanagari Hindi"',
] as const;
