import { PerformanceMonitor } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useSyncExternalStore } from 'react';
import { useExperience } from '../store/experience';
import { BUDGETS, CAM_Z, MAX_BUDGET, TIERS } from './budget';
import { MARIGOLD, ROSE } from './palettes';
import { EmberField } from './fields/EmberField';
import { FeatherField } from './fields/FeatherField';
import { PetalField } from './fields/PetalField';
import { SparkleField } from './fields/SparkleField';

const subscribeVisibility = (cb: () => void) => {
  document.addEventListener('visibilitychange', cb);
  return () => document.removeEventListener('visibilitychange', cb);
};
const getVisible = () => !document.hidden;

/** Exposes the scene for the Parallax three.js debug tooling (dev builds only). */
function DevExpose() {
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    window.scene = scene;
    window.__THREE_CAMERA__ = camera;
    window.__renderer__ = gl;
  }, [scene, camera, gl]);
  return null;
}

function stepQuality(direction: 1 | -1) {
  const { quality, setQuality } = useExperience.getState();
  const next = TIERS[Math.min(TIERS.length - 1, Math.max(0, TIERS.indexOf(quality) + direction))];
  if (next && next !== quality) setQuality(next);
}

/**
 * The one persistent, fixed WebGL layer behind all DOM sections. Particle fields fade in
 * and out per scene. The render loop stops entirely while the tab is hidden or before the
 * envelope opens. Loaded as a separate chunk so three.js never blocks first paint.
 */
export default function BackgroundCanvas() {
  const quality = useExperience((s) => s.quality);
  const phase = useExperience((s) => s.phase);
  const disableWebGL = useExperience((s) => s.disableWebGL);
  const tabVisible = useSyncExternalStore(subscribeVisibility, getVisible);
  const live = phase === 'entering' || phase === 'revealed';
  const budget = BUDGETS[quality];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[100lvh] transition-opacity duration-[2000ms]"
      style={{ opacity: live ? 1 : 0 }}
    >
      <Canvas
        dpr={[1, budget.dpr]}
        frameloop={live && tabVisible ? 'always' : 'never'}
        gl={{
          antialias: false,
          alpha: true,
          stencil: false,
          depth: false,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, CAM_Z], fov: 40, near: 0.1, far: 40 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            disableWebGL();
          });
        }}
      >
        <PerformanceMonitor
          flipflops={4}
          onIncline={() => stepQuality(1)}
          onDecline={() => stepQuality(-1)}
          onFallback={() => useExperience.getState().setQuality('medium')}
        />
        <DevExpose />
        <SparkleField
          count={budget.sparkles}
          maxCount={MAX_BUDGET.sparkles}
          scenes={['ganesh', 'couple', 'itinerary', 'rsvp']}
        />
        <SparkleField
          count={Math.round(budget.sparkles * 0.7)}
          maxCount={MAX_BUDGET.sparkles}
          scenes={['shreenathji', 'kali', 'shivparvati']}
          color="#F3D677"
          seed={9}
          size={18}
        />
        <FeatherField
          count={budget.feathers}
          maxCount={MAX_BUDGET.feathers}
          scenes={['shreenathji']}
        />
        <EmberField count={budget.embers} maxCount={MAX_BUDGET.embers} scenes={['kali']} />
        <EmberField
          count={Math.round(budget.embers * 0.6)}
          maxCount={MAX_BUDGET.embers}
          scenes={['shivparvati']}
          spread={0.2}
          originY={-0.08}
          size={13}
          seed={33}
        />
        <PetalField
          count={budget.petals}
          maxCount={MAX_BUDGET.petals}
          scenes={['shivparvati']}
          palette={ROSE}
          seed={19}
        />
        <PetalField
          count={budget.petals}
          maxCount={MAX_BUDGET.petals}
          scenes={['ganesh', 'rsvp']}
          palette={MARIGOLD}
        />
      </Canvas>
    </div>
  );
}
