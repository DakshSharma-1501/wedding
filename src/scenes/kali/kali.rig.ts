import type { DeityRig } from '../../components/deity/types';

/** Maa Kali layer stack (back → front), 600×760 artboard in src/assets/deities/kali/. */
export const kaliRig: DeityRig = {
  id: 'kali',
  label:
    'Maa Kali, serene and benevolent, within a ring of golden flame — right hand raised in blessing, wearing a garland of red hibiscus',
  artboard: { width: 600, height: 760 },
  layers: [
    { name: 'fire-ring', pivot: [0.5, 0.3816], idle: 'idle-spin' },
    { name: 'hair-left', pivot: [0.5, 0.18], idle: 'idle-hair-l' },
    { name: 'hair-right', pivot: [0.5, 0.18], idle: 'idle-hair-r' },
    { name: 'arms-back' },
    { name: 'body' },
    { name: 'garland', pivot: [0.5, 0.47], idle: 'idle-garland' },
    { name: 'head' },
    'eyes',
    { name: 'lips' },
    { name: 'crown' },
  ],
  eyes: {
    sclera: 'eye-whites',
    iris: 'irises',
    lid: 'eyelids',
    lines: 'eye-lines',
    blinkTravel: 0.04,
    blinkEvery: [3, 6.5],
  },
};

/** Abhaya-mudra palm centre, as artboard fractions — where the blessing rays emanate. */
export const kaliPalm = { x: 0.318, y: 0.468 } as const;

export const kaliGlints: readonly { x: number; y: number; size: number; delay: number }[] = [
  { x: 0.5, y: 0.183, size: 13, delay: 0.4 }, // crown jewel
  { x: 0.5, y: 0.052, size: 12, delay: 1.6 }, // crescent
  { x: 0.528, y: 0.34, size: 9, delay: 2.4 }, // nath
];
