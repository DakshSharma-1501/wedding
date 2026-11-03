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
import { sparkleFragment, sparkleVertex } from '../shaders/sparkle';

interface SparkleFieldProps {
  count: number;
  maxCount: number;
  scenes: readonly SceneId[];
  color?: string;
  seed?: number;
  /** Base point size in CSS px. */
  size?: number;
}

// A type alias (not an interface) so it satisfies ShaderMaterial's uniform index signature.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type SparkleUniforms = {
  uTime: IUniform<number>;
  uScroll: IUniform<number>;
  uOpacity: IUniform<number>;
  uPixelRatio: IUniform<number>;
  uSize: IUniform<number>;
  uCamZ: IUniform<number>;
  uHalf: IUniform<Vector2>;
  uColor: IUniform<Color>;
  uCore: IUniform<Color>;
};
type SparkleMaterial = ShaderMaterial & { uniforms: SparkleUniforms };

function buildGeometry(max: number, seed: number): BufferGeometry {
  const rng = createRng(seed);
  const position = new Float32Array(max * 3);
  const aSeed = new Float32Array(max * 3);
  const aParams = new Float32Array(max * 3);
  for (let i = 0; i < max; i++) {
    aSeed.set([range(rng, -1, 1), rng(), range(rng, -1, 1)], i * 3);
    aParams.set([range(rng, 0.4, 1.4), rng(), range(rng, 0.5, 1.4)], i * 3);
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(position, 3));
  geo.setAttribute('aSeed', new BufferAttribute(aSeed, 3));
  geo.setAttribute('aParams', new BufferAttribute(aParams, 3));
  return geo;
}

/** Gold dust glinting in the air — reads as divine light on cream without any bloom pass. */
export function SparkleField({
  count,
  maxCount,
  scenes,
  color = '#B8901E',
  seed = 3,
  size = 22,
}: SparkleFieldProps) {
  const points = useRef<Points<BufferGeometry, SparkleMaterial>>(null);
  const fade = useRef(0);

  const geometry = useMemo(() => buildGeometry(maxCount, seed), [maxCount, seed]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: sparkleVertex,
        fragmentShader: sparkleFragment,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uOpacity: { value: 0 },
          uPixelRatio: { value: 1 },
          uSize: { value: size },
          uCamZ: { value: CAM_Z },
          uHalf: { value: new Vector2(1, 1) },
          uColor: { value: new Color(color) },
          uCore: { value: new Color('#FFF3C4') },
        },
        transparent: true,
        premultipliedAlpha: true,
        depthWrite: false,
        depthTest: false,
      }) as SparkleMaterial,
    [color, size],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    const p = points.current;
    if (!p) return;
    const dt = Math.min(delta, 1 / 20);
    const target = scenes.includes(useExperience.getState().activeScene) ? 1 : 0;
    fade.current += (target - fade.current) * Math.min(1, dt * 1.6);
    p.visible = fade.current > 0.004;
    if (!p.visible) return;
    const u = p.material.uniforms;
    u.uTime.value += dt;
    u.uScroll.value = scrollState.y * (state.viewport.height / state.size.height);
    u.uOpacity.value = fade.current;
    u.uPixelRatio.value = state.viewport.dpr;
    u.uHalf.value.set(state.viewport.width / 2, state.viewport.height / 2);
    p.geometry.setDrawRange(0, Math.min(count, maxCount));
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
