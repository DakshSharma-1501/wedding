export type DeityId = 'ganesh' | 'shreenathji' | 'kali' | 'shivparvati';

/** [x, y] as fractions of the artboard (0–1), used as CSS transform-origin. */
export type Pivot = readonly [number, number];

export interface LayerSpec {
  /** File name without extension inside src/assets/deities/<deity>/. */
  name: string;
  pivot?: Pivot;
  /**
   * CSS idle-loop class from src/styles/index.css (e.g. 'idle-ear-l', 'idle-trunk',
   * 'idle-spin'). Runs on the compositor while the scene is on-screen.
   */
  idle?: string;
  /** Missing optional layers render nothing instead of warning. */
  optional?: boolean;
}

export interface EyeRig {
  /** Eye-white shape. Also used as the clipping mask for irises and lids. */
  sclera: string;
  iris: string;
  /** Lid drawn in its OPEN position, sitting just above the eye; it slides down to blink. */
  lid: string;
  /** Static lines drawn above everything (lower lash line, kajal wing). */
  lines?: string;
  /** How far the lid travels to close, as a fraction of artboard height. */
  blinkTravel: number;
  /** Random seconds between blinks. */
  blinkEvery: readonly [number, number];
  /** Optional side-to-side glance of the irises. */
  dart?: {
    /** Max horizontal travel as a fraction of artboard width. */
    range: number;
    /** Random seconds to hold each gaze. */
    hold: readonly [number, number];
  };
}

export interface DeityRig {
  id: DeityId;
  /** Accessible description of the artwork. */
  label: string;
  artboard: { width: number; height: number };
  /** Back-to-front. The string 'eyes' marks where the eye stack is inserted. */
  layers: readonly (LayerSpec | 'eyes')[];
  eyes?: EyeRig;
}
