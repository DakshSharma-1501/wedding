import type { DeityRig } from '../../components/deity/types';

/**
 * Ganesh Ji layer stack (back → front). Every file is a 600×720 transparent artboard in
 * src/assets/deities/ganesh/. Pivots are fractions of that artboard.
 * "left"/"right" are from the viewer's point of view.
 */
export const ganeshRig: DeityRig = {
  id: 'ganesh',
  label:
    'Shri Ganesh Ji wearing a jewelled golden crown, seated on a pink lotus before a golden halo',
  artboard: { width: 600, height: 720 },
  layers: [
    { name: 'halo', pivot: [0.5, 0.347], idle: 'idle-spin' },
    { name: 'body' },
    { name: 'ear-left', pivot: [0.352, 0.444], idle: 'idle-ear-l' },
    { name: 'ear-right', pivot: [0.648, 0.444], idle: 'idle-ear-r' },
    { name: 'head' },
    'eyes',
    { name: 'trunk', pivot: [0.5, 0.42], idle: 'idle-trunk' },
    { name: 'crown' },
    { name: 'lotus' },
  ],
  eyes: {
    sclera: 'eye-whites',
    iris: 'irises',
    lid: 'eyelids',
    lines: 'eye-lines',
    blinkTravel: 0.036,
    blinkEvery: [3.2, 6.5],
  },
};

/** Crown jewel positions (artboard fractions) for DOM glints. */
export const ganeshGlints: readonly { x: number; y: number; size: number; delay: number }[] = [
  { x: 0.5, y: 0.04, size: 14, delay: 0 },
  { x: 0.5, y: 0.248, size: 18, delay: 1.1 },
  { x: 0.427, y: 0.256, size: 11, delay: 2.2 },
  { x: 0.573, y: 0.256, size: 11, delay: 0.6 },
  { x: 0.5, y: 0.179, size: 10, delay: 1.7 },
];
