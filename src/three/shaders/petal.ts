/**
 * Instanced petals: every petal's fall, sway, tumble and curl is computed in the vertex
 * shader from per-instance seeds, so the CPU only updates a handful of uniforms per frame.
 * The petal silhouette is an analytic shape in the fragment shader — no texture to load.
 */
export const petalVertex = /* glsl */ `
  uniform float uTime;
  uniform float uFall;
  uniform float uSway;
  uniform float uScroll;
  uniform float uOpacity;
  uniform float uCamZ;
  uniform vec2 uHalf;

  attribute vec3 aSeed;    // x [-1,1], y [0,1], z depth [-1,1]
  attribute vec4 aParams;  // fall speed, phase, size, spin
  attribute vec3 aAxis;
  attribute float aTint;

  varying vec2 vUv;
  varying float vTint;
  varying float vShade;
  varying float vAlpha;

  mat3 rotateAxis(vec3 axis, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat3(
      oc * axis.x * axis.x + c,          oc * axis.x * axis.y + axis.z * s, oc * axis.z * axis.x - axis.y * s,
      oc * axis.x * axis.y - axis.z * s, oc * axis.y * axis.y + c,          oc * axis.y * axis.z + axis.x * s,
      oc * axis.z * axis.x + axis.y * s, oc * axis.y * axis.z - axis.x * s, oc * axis.z * axis.z + c
    );
  }

  void main() {
    vUv = uv;
    vTint = aTint;

    float depth = aSeed.z * 2.6;
    float persp = (uCamZ - depth) / uCamZ;
    vec2 ext = uHalf * persp;
    float margin = 0.6;
    float range = ext.y * 2.0 + margin * 2.0;
    float near = aSeed.z * 0.5 + 0.5;

    // Loop vertically forever; scrolling nudges petals up with depth-based parallax.
    float travel = aSeed.y * range + uFall * aParams.x - uScroll * (0.25 + near * 0.45);
    float y = ext.y + margin - mod(travel, range);

    float t = uTime * (0.55 + aParams.x * 0.35) + aParams.y;
    float x = aSeed.x * (ext.x + 0.2)
      + sin(t * 0.8) * (0.32 + uSway * 0.22)
      + sin(t * 0.31 + 1.7) * 0.22;

    vec3 p = position * aParams.z;
    p.z += (sin((position.x + 0.5) * 3.14159) - 0.5) * 0.26 * aParams.z;   // cupped
    p.z += sin(t * 3.0 + position.y * 4.0) * 0.045 * aParams.z;             // flutter

    float angle = t * aParams.w + uFall * aParams.w * 0.5;
    mat3 R = rotateAxis(normalize(aAxis), angle);
    vec3 n = R * vec3(0.0, 0.0, 1.0);
    vShade = 0.62 + 0.38 * abs(dot(n, normalize(vec3(0.25, 0.65, 0.7))));

    vec3 world = vec3(x, y, depth) + R * p;
    vAlpha = uOpacity * (0.55 + near * 0.45);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
  }
`;

export const petalFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying vec2 vUv;
  varying float vTint;
  varying float vShade;
  varying float vAlpha;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    // Obovate petal: narrow at the base, round ruffled tip.
    float w = mix(0.28, 0.95, smoothstep(-1.0, 0.3, p.y));
    float ang = atan(p.x, p.y + 0.3);
    float ruffle = 0.045 * sin(ang * 12.0) * smoothstep(0.1, 0.9, p.y);
    float d = length(vec2(p.x / w, (p.y - 0.04) / 0.94));
    float edge = 0.92 + ruffle;
    float alpha = (1.0 - smoothstep(edge - 0.07, edge, d)) * vAlpha;
    if (alpha < 0.01) discard;

    vec3 base = vTint > 0.86 ? uColorC : mix(uColorA, uColorB, vTint / 0.86);
    vec3 col = mix(base * 0.8, base * 1.06, smoothstep(-1.0, 0.8, p.y));
    col *= 0.94 + 0.06 * sin(p.x * 28.0);
    col *= vShade;

    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
    #include <premultiplied_alpha_fragment>
  }
`;
