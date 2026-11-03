import type { DeityRig } from '../../components/deity/types';

/**
 * Shreenathji layer stack (back → front), 600×800 artboard in
 * src/assets/deities/shreenathji/. "left/right" are the viewer's.
 */
export const shreenathjiRig: DeityRig = {
  id: 'shreenathji',
  label:
    'Shreenathji in the Nathdwara pichwai style — left arm raised holding Govardhan, large lotus eyes, peacock-feather crown and a long garland',
  artboard: { width: 600, height: 800 },
  layers: [
    { name: 'halo', pivot: [0.5, 0.3125], idle: 'idle-spin' },
    { name: 'body' },
    { name: 'garland', pivot: [0.5, 0.44], idle: 'idle-garland' },
    { name: 'head' },
    'eyes',
    { name: 'lips', pivot: [0.5, 0.374], idle: 'idle-smile' },
    { name: 'crown' },
  ],
  eyes: {
    sclera: 'eye-whites',
    iris: 'irises',
    lid: 'eyelids',
    lines: 'eye-lines',
    blinkTravel: 0.056,
    blinkEvery: [2, 5],
    // Eased glance left/right with 1–3 s pauses.
    dart: { range: 0.014, hold: [1, 3] },
  },
};

export const shreenathjiGlints: readonly { x: number; y: number; size: number; delay: number }[] = [
  { x: 0.5, y: 0.4, size: 16, delay: 0.3 }, // chin diamond
  { x: 0.5, y: 0.172, size: 14, delay: 1.4 }, // sarpech
  { x: 0.517, y: 0.359, size: 9, delay: 2.1 }, // nose pearl
  { x: 0.43, y: 0.033, size: 12, delay: 0.9 }, // feather eye
];
