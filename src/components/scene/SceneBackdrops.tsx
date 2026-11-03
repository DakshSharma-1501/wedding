import { BACKDROPS } from './backdrops';

/**
 * Full-screen colour washes for the "divine night" scenes, as silk curtains.
 * Each is 150lvh tall with feathered top/bottom edges (25lvh each) and rises from below
 * as its scene arrives, then lifts away as the scene ends — a transform-only "silk wipe".
 * They sit *beneath* the WebGL canvas so feathers and embers stay visible over them.
 * Scenes drive them with `useBackdrop`.
 */
export function SceneBackdrops() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[100lvh] overflow-hidden"
    >
      {Object.entries(BACKDROPS).map(([id, background]) => (
        <div
          key={id}
          data-backdrop={id}
          className="absolute inset-x-0 top-0 h-[150lvh]"
          style={{
            background,
            transform: 'translateY(150lvh)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, #000 16.67%, #000 83.33%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, #000 16.67%, #000 83.33%, transparent 100%)',
          }}
        />
      ))}
    </div>
  );
}
