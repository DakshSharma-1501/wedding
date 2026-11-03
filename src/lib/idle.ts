export type IdleHandle = number;

/** requestIdleCallback with a Safari fallback. */
export const requestIdle = (cb: () => void, timeout = 500): IdleHandle =>
  'requestIdleCallback' in window ? window.requestIdleCallback(cb, { timeout }) : setTimeout(cb, 32);

export const cancelIdle = (id: IdleHandle): void => {
  if ('cancelIdleCallback' in window) window.cancelIdleCallback(id);
  else clearTimeout(id);
};

/**
 * Run a scene's GSAP/ScrollTrigger setup in the next idle slot instead of inside React's
 * commit. Setup reads layout (ScrollTrigger positions, computed transforms); doing it in
 * the same task that inserted the DOM forces the whole first style+layout synchronously
 * and doubles the task length. Created tweens/triggers are recorded in `context`, so
 * useGSAP's cleanup still reverts them; a function returned by `setup` runs on revert.
 *
 * Use from a useGSAP callback: `useGSAP((context) => deferSetup(context, () => { … }))`.
 */
export function deferSetup(context: gsap.Context, setup: () => unknown): () => void {
  const id = requestIdle(() => {
    context.add(setup);
  });
  return () => cancelIdle(id);
}
