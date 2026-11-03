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
import { MARIGOLD, type PetalPalette } from '../palettes';
import { petalFragment, petalVertex } from '../shaders/petal';

interface PetalFieldProps {
  /** Petals drawn now (tier budget). */
  count: number;
  /** Petals allocated (max budget). */
  maxCount: number;
  /** Scenes in which this field is visible; it fades in/out as scenes change. */
  scenes: readonly SceneId[];
  palette?: PetalPalette;
  seed?: number;
  /** Base size in world units. */
  size?: number;
}

// A type alias (not an interface) so it satisfies ShaderMaterial's uniform index signature.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PetalUniforms = {
  uTime: IUniform<number>;
  uFall: IUniform<number>;
  uSway: IUniform<number>;
  uScroll: IUniform<number>;
  uOpacity: IUniform<number>;
  uCamZ: IUniform<number>;
  uHalf: IUniform<Vector2>;
  uColorA: IUniform<Color>;
  uColorB: IUniform<Color>;
  uColorC: IUniform<Color>;
};
type PetalMaterial = ShaderMaterial & { uniforms: PetalUniforms };

function buildGeometry(max: number, seed: number, size: number): InstancedBufferGeometry {
  const plane = new PlaneGeometry(1, 1, 4, 4);
  const geo = new InstancedBufferGeometry();
  geo.index = plane.index;
  geo.setAttribute('position', plane.getAttribute('position'));
  geo.setAttribute('uv', plane.getAttribute('uv'));

  const rng = createRng(seed);
  const aSeed = new Float32Array(max * 3);
  const aParams = new Float32Array(max * 4);
  const aAxis = new Float32Array(max * 3);
  const aTint = new Float32Array(max);
  for (let i = 0; i < max; i++) {
    aSeed.set([range(rng, -1, 1), rng(), range(rng, -1, 1)], i * 3);
    aParams.set(
      [
        range(rng, 0.18, 0.42),
        range(rng, 0, 6.28),
        range(rng, 0.7, 1.25) * size,
        range(rng, 0.35, 1.1),
      ],
      i * 4,
    );
    aAxis.set([range(rng, -1, 1), range(rng, -1, 1), range(rng, -0.4, 0.4)], i * 3);
    aTint[i] = rng();
  }
  geo.setAttribute('aSeed', new InstancedBufferAttribute(aSeed, 3));
  geo.setAttribute('aParams', new InstancedBufferAttribute(aParams, 4));
  geo.setAttribute('aAxis', new InstancedBufferAttribute(aAxis, 3));
  geo.setAttribute('aTint', new InstancedBufferAttribute(aTint, 1));
  geo.instanceCount = max;
  return geo;
}

/**
 * Instanced petals falling and tumbling across the viewport. They speed up with scroll
 * velocity, then settle back to a gentle idle loop.
 */
export function PetalField({
  count,
  maxCount,
  scenes,
  palette = MARIGOLD,
  seed = 7,
  size = 0.17,
}: PetalFieldProps) {
  const mesh = useRef<Mesh<InstancedBufferGeometry, PetalMaterial>>(null);
  const motion = useRef({ fall: 0, opacity: 0 });

  const geometry = useMemo(() => buildGeometry(maxCount, seed, size), [maxCount, seed, size]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: petalVertex,
        fragmentShader: petalFragment,
        uniforms: {
          uTime: { value: 0 },
          uFall: { value: 0 },
          uSway: { value: 0 },
          uScroll: { value: 0 },
          uOpacity: { value: 0 },
          uCamZ: { value: CAM_Z },
          uHalf: { value: new Vector2(1, 1) },
          uColorA: { value: new Color(palette.a) },
          uColorB: { value: new Color(palette.b) },
          uColorC: { value: new Color(palette.accent) },
        },
        transparent: true,
        premultipliedAlpha: true,
        depthWrite: false,
        depthTest: false,
        side: DoubleSide,
      }) as PetalMaterial,
    [palette],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(delta, 1 / 20);
    const s = motion.current;
    const target = scenes.includes(useExperience.getState().activeScene) ? 1 : 0;
    s.opacity += (target - s.opacity) * Math.min(1, dt * 1.6);
    m.visible = s.opacity > 0.004;
    if (!m.visible) return;

    const boost = Math.min(Math.abs(scrollState.velocity) / 1400, 2.5);
    s.fall += dt * (1 + boost * 1.6);
    const u = m.material.uniforms;
    u.uTime.value += dt;
    u.uFall.value = s.fall;
    u.uSway.value += (boost - u.uSway.value) * Math.min(1, dt * 3);
    u.uScroll.value = scrollState.y * (state.viewport.height / state.size.height);
    u.uOpacity.value = s.opacity;
    u.uHalf.value.set(state.viewport.width / 2, state.viewport.height / 2);
    m.geometry.instanceCount = Math.min(count, maxCount);
  });

  return <mesh ref={mesh} geometry={geometry} material={material} frustumCulled={false} />;
}
