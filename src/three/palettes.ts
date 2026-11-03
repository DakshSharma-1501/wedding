export interface PetalPalette {
  /** Two main tones blended per petal, plus an accent used for ~14% of petals. */
  a: string;
  b: string;
  accent: string;
}

export const MARIGOLD: PetalPalette = { a: '#F7A81B', b: '#E8650C', accent: '#C2263F' };
export const ROSE: PetalPalette = { a: '#E46A7E', b: '#B5223A', accent: '#F4B6C2' };
