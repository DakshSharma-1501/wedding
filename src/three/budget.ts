import type { QualityTier } from '../lib/device';

/**
 * Particle and resolution budgets per quality tier. Allocation always uses `high`, and the
 * draw count is lowered at runtime — so PerformanceMonitor can step tiers without
 * reallocating GPU buffers.
 */
export interface Budget {
  petals: number;
  sparkles: number;
  feathers: number;
  embers: number;
  dpr: number;
}

export const BUDGETS: Record<QualityTier, Budget> = {
  low: { petals: 14, sparkles: 26, feathers: 8, embers: 30, dpr: 1 },
  medium: { petals: 26, sparkles: 48, feathers: 14, embers: 60, dpr: 1.5 },
  high: { petals: 46, sparkles: 90, feathers: 26, embers: 110, dpr: 1.5 },
};

export const MAX_BUDGET = BUDGETS.high;

/** Camera distance shared by the shaders' perspective maths. */
export const CAM_Z = 8;

export const TIERS: readonly QualityTier[] = ['low', 'medium', 'high'];
