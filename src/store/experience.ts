import { create } from 'zustand';
import type { SceneId } from '../data/types';
import { detectWebGL, initialQuality, prefersReducedMotion, type QualityTier } from '../lib/device';

/**
 * loading  → assets preload behind the sealed envelope
 * sealed   → ready; waiting for the guest's tap
 * opening  → seal cracks, flap opens, card slides out
 * entering → card zooms past the camera; Scene 1 begins its entrance
 * revealed → overlay gone, page scrolls
 */
export type Phase = 'loading' | 'sealed' | 'opening' | 'entering' | 'revealed';

const MUTE_KEY = 'invite:muted';

function readMuted(): boolean {
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

interface ExperienceState {
  phase: Phase;
  loadProgress: number;
  muted: boolean;
  quality: QualityTier;
  reducedMotion: boolean;
  webgl: boolean;
  activeScene: SceneId;
  setPhase: (phase: Phase) => void;
  setLoadProgress: (value: number) => void;
  setMuted: (muted: boolean) => void;
  setQuality: (quality: QualityTier) => void;
  setActiveScene: (scene: SceneId) => void;
  disableWebGL: () => void;
}

export const useExperience = create<ExperienceState>()((set) => ({
  phase: 'loading',
  loadProgress: 0,
  muted: readMuted(),
  quality: initialQuality(),
  reducedMotion: prefersReducedMotion(),
  webgl: detectWebGL(),
  activeScene: 'ganesh',
  setPhase: (phase) => set({ phase }),
  setLoadProgress: (loadProgress) => set({ loadProgress }),
  setMuted: (muted) => {
    try {
      window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    } catch {
      /* private mode — ignore */
    }
    set({ muted });
  },
  setQuality: (quality) => set({ quality }),
  setActiveScene: (activeScene) => set({ activeScene }),
  disableWebGL: () => set({ webgl: false }),
}));

// Follow OS-level reduced-motion changes live.
window
  .matchMedia('(prefers-reduced-motion: reduce)')
  .addEventListener('change', (e) => useExperience.setState({ reducedMotion: e.matches }));
