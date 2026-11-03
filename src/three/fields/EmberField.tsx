import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  ShaderMaterial,
  Vector2,
  type IUniform,
  type Points,
} from 'three';
import type { SceneId } from '../../data/types';
import { createRng, range } from '../../lib/random';
import { scrollState } from '../../lib/scroll';
import { useExperience } from '../../store/experience';
import { CAM_Z } from '../budget';
import { emberFragment, emberVertex } from '../shaders/ember';

// A type alias (not an interface) so it satisfies ShaderMaterial's uniform index signature.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type EmberUniforms = {
  uTime: IUniform<number>;
  uRise: IUniform<number>;
  uScroll: IUniform<number>;
  uOpacity: IUniform<number>;
  uPixelRatio: IUniform<number>;
  uSize: IUniform<number>;
  uCamZ: IUniform<number>;
  uHalf: IUniform<Vector2>;
  uSpread: IUniform<number>;
  uOriginY: IUniform<number>;
  uHot: IUniform<Color>;
  uCool: IUniform<Color>;
};
type EmberMaterial = ShaderMaterial & { uniforms: EmberUniforms };

interface EmberFieldProps {
  count: number;
  maxCount: number;
  scenes: readonly SceneId[];
  seed?: number;
  /** Point size in CSS px. */
  size?: number;
  /** Horizontal spread, 0–1 of the viewport width. */
  spread?: number;
  /** Birth height, -1 (bottom edge) … 1 (top). */
  originY?: number;
  hot?: string;
  cool?: string;
}

function buildGeometry(max: number, seed: number): BufferGeometry {
  const rng = createRng(seed);
  const aSeed = new Float32Array(max * 3);
  const aParams = new Float32Array(max * 3);
  for (let i = 0; i < max; i++) {
    aSeed.set([range(rng, -1, 1), rng(), range(rng, -1, 1)], i * 3);
    aParams.set([range(rng, 0.25, 0.7), rng(), range(rng, 0.5, 1.3)], i * 3);
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(new Float32Array(max * 3), 3));
  geo.setAttribute('aSeed', new BufferAttribute(aSeed, 3));
  geo.setAttribute('aParams', new BufferAttribute(aParams, 3));
  return geo;
}

/** Gold embers and sparks rising and flickering — Maa Kali's aura and the sacred agni. */
export function EmberField({
  count,
  maxCount,
  scenes,
  seed = 21,
  size = 16,
  spread = 1,
  originY = -1,
  hot = '#FFE19A',
  cool = '#D9541E',
}: EmberFieldProps) {
  const points = useRef<Points<BufferGeometry, EmberMaterial>>(null);
  const motion = useRef({ rise: 0, opacity: 0 });

  const geometry = useMemo(() => buildGeometry(maxCount, seed), [maxCount, seed]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: emberVertex,
        fragmentShader: emberFragment,
        uniforms: {
          uTime: { value: 0 },
          uRise: { value: 0 },
          uScroll: { value: 0 },
          uOpacity: { value: 0 },
          uPixelRatio: { value: 1 },
          uSize: { value: size },
          uCamZ: { value: CAM_Z },
          uHalf: { value: new Vector2(1, 1) },
          uSpread: { value: spread },
          uOriginY: { value: originY },
          uHot: { value: new Color(hot) },
          uCool: { value: new Color(cool) },
        },
        transparent: true,
        premultipliedAlpha: true,
        depthWrite: false,
        depthTest: false,
      }) as EmberMaterial,
    [size, spread, originY, hot, cool],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    const p = points.current;
    if (!p) return;
    const dt = Math.min(delta, 1 / 20);
    const s = motion.current;
    const target = scenes.includes(useExperience.getState().activeScene) ? 1 : 0;
    s.opacity += (target - s.opacity) * Math.min(1, dt * 1.4);
    p.visible = s.opacity > 0.004;
    if (!p.visible) return;
    s.rise += dt * (1 + Math.min(Math.abs(scrollState.velocity) / 1500, 2));
    const u = p.material.uniforms;
    u.uTime.value += dt;
    u.uRise.value = s.rise;
    u.uScroll.value = scrollState.y * (state.viewport.height / state.size.height);
    u.uOpacity.value = s.opacity;
    u.uPixelRatio.value = state.viewport.dpr;
    u.uHalf.value.set(state.viewport.width / 2, state.viewport.height / 2);
    p.geometry.setDrawRange(0, Math.min(count, maxCount));
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
