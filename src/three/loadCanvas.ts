/** Shared dynamic import so React.lazy and the preloader fetch the same three.js chunk. */
export const loadCanvas = () => import('./BackgroundCanvas');
