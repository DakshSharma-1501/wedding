import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  Color,
  DoubleSide,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  PlaneGeometry,
  ShaderMaterial,
  Vector2,
  type IUniform,
  type Mesh,
} from 'three';
import type { SceneId } from '../../data/types';
import { createRng, range } from '../../lib/random';
import { scrollState } from '../../lib/scroll';
import { useExperience } from '../../store/experience';
import { CAM_Z } from '../budget';
import { featherFragment, featherVertex } from '../shaders/feather';

// A type alias (not an interface) so it satisfies ShaderMaterial's uniform index signature.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type FeatherUniforms = {
  uTime: IUniform<number>;
  uFall: IUniform<number>;
  uTwirl: IUniform<number>;
  uScroll: IUniform<number>;
  uOpacity: IUniform<number>;
  uCamZ: IUniform<number>;
  uHalf: IUniform<Vector2>;
  uBarbInner: IUniform<Color>;
  uBarbOuter: IUniform<Color>;
  uQuill: IUniform<Color>;
  uBronze: IUniform<Color>;
  uGreen: IUniform<Color>;
  uTeal: IUniform<Color>;
  uBlue: IUniform<Color>;
  uSheen: IUniform<Color>;
};
type FeatherMaterial = ShaderMaterial & { uniforms: FeatherUniforms };

interface FeatherFieldProps {
  count: number;
  maxCount: number;
  scenes: readonly SceneId[];
  seed?: number;
  /** Base scale; feathers are ~1.6 world units long at 1.0. */
  size?: number;
}

function buildGeometry(max: number, seed: number, size: number): InstancedBufferGeometry {
  const plane = new PlaneGeometry(0.34, 1.6, 2, 10);
  const geo = new InstancedBufferGeometry();
  geo.index = plane.index;
  geo.setAttribute('position', plane.getAttribute('position'));
  geo.setAttribute('uv', plane.getAttribute('uv'));
  const rng = createRng(seed);
  const aSeed = new Float32Array(max * 3);
  const aParams = new Float32Array(max * 4);
  for (let i = 0; i < max; i++) {
    aSeed.set([range(rng, -1, 1), rng(), range(rng, -1, 1)], i * 3);
    aParams.set(
      [
        range(rng, 0.12, 0.3),
        range(rng, 0, 6.28),
        range(rng, 0.7, 1.15) * size,
        range(rng, 0.25, 0.6),
      ],
      i * 4,
    );
  }
  geo.setAttribute('aSeed', new InstancedBufferAttribute(aSeed, 3));
  geo.setAttribute('aParams', new InstancedBufferAttribute(aParams, 4));
  geo.instanceCount = max;
  return geo;
}

/**
 * Falling peacock feathers for the Shreenathji scene. Idle: a slow, swaying loop.
 * Scrolling: they fall faster and twirl, then settle back.
 */
export function FeatherField({
  count,
  maxCount,
  scenes,
  seed = 11,
  size = 0.72,
}: FeatherFieldProps) {
  const mesh = useRef<Mesh<InstancedBufferGeometry, FeatherMaterial>>(null);
  const motion = useRef({ fall: 0, twirl: 0, opacity: 0 });

  const geometry = useMemo(() => buildGeometry(maxCount, seed, size), [maxCount, seed, size]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: featherVertex,
        fragmentShader: featherFragment,
        uniforms: {
          uTime: { value: 0 },
          uFall: { value: 0 },
          uTwirl: { value: 0 },
          uScroll: { value: 0 },
          uOpacity: { value: 0 },
          uCamZ: { value: CAM_Z },
          uHalf: { value: new Vector2(1, 1) },
          uBarbInner: { value: new Color('#9A8F2E') },
          uBarbOuter: { value: new Color('#1E7A55') },
          uQuill: { value: new Color('#C9A227') },
          uBronze: { value: new Color('#C9A227') },
          uGreen: { value: new Color('#2F8A5B') },
          uTeal: { value: new Color('#12A3A0') },
          uBlue: { value: new Color('#0B3C5D') },
          uSheen: { value: new Color('#9EF0E2') },
        },
        transparent: true,
        premultipliedAlpha: true,
        depthWrite: false,
        depthTest: false,
        side: DoubleSide,
      }) as FeatherMaterial,
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(delta, 1 / 20);
    const s = motion.current;
    const target = scenes.includes(useExperience.getState().activeScene) ? 1 : 0;
    s.opacity += (target - s.opacity) * Math.min(1, dt * 1.4);
    m.visible = s.opacity > 0.004;
    if (!m.visible) return;
    const speed = Math.abs(scrollState.velocity);
    s.fall += dt * (1 + Math.min(speed / 1200, 2.5) * 2.2);
    s.twirl += dt * Math.min(speed / 500, 5);
    const u = m.material.uniforms;
    u.uTime.value += dt;
    u.uFall.value = s.fall;
    u.uTwirl.value = s.twirl;
    u.uScroll.value = scrollState.y * (state.viewport.height / state.size.height);
    u.uOpacity.value = s.opacity;
    u.uHalf.value.set(state.viewport.width / 2, state.viewport.height / 2);
    m.geometry.instanceCount = Math.min(count, maxCount);
  });

  return <mesh ref={mesh} geometry={geometry} material={material} frustumCulled={false} />;
}
