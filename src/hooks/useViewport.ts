import { useSyncExternalStore } from 'react';

const subscribe = (cb: () => void) => {
  window.addEventListener('resize', cb);
  window.addEventListener('orientationchange', cb);
  return () => {
    window.removeEventListener('resize', cb);
    window.removeEventListener('orientationchange', cb);
  };
};
const getWidth = () => window.innerWidth;
const getHeight = () => window.innerHeight;

/** Live innerWidth/innerHeight. */
export function useViewport(): { width: number; height: number } {
  const width = useSyncExternalStore(subscribe, getWidth);
  const height = useSyncExternalStore(subscribe, getHeight);
  return { width, height };
}
