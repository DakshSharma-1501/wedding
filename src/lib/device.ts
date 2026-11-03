export type QualityTier = 'low' | 'medium' | 'high';

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isFinePointer(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/** True when a WebGL context can actually be created (not just when the API exists). */
export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** First guess at a particle/DPR tier; drei's PerformanceMonitor refines it at runtime. */
export function initialQuality(): QualityTier {
  const memory = navigator.deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency || 4;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (memory <= 2 || cores <= 2) return 'low';
  if (coarse || window.innerWidth < 768) return 'medium';
  return 'high';
}
