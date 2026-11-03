/** Rising embers/sparks: soft glowing points that wobble upward and fade near the top. */
export const emberVertex = /* glsl */ `
  uniform float uTime;
  uniform float uRise;
  uniform float uScroll;
  uniform float uOpacity;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uCamZ;
  uniform vec2 uHalf;
  uniform float uSpread;   // 0..1 horizontal spread (1 = full width)
  uniform float uOriginY;  // -1..1 where embers are born (fraction of half-height)

  attribute vec3 aSeed;    // x [-1,1], y [0,1], z [-1,1]
  attribute vec3 aParams;  // speed, phase, size

  varying float vLife;
  varying float vFlicker;
  varying float vAlpha;

  void main() {
    float depth = aSeed.z * 1.6;
    float persp = (uCamZ - depth) / uCamZ;
    vec2 ext = uHalf * persp;
    float start = uOriginY * ext.y;
    float range = ext.y - start + 0.6;
    float travel = aSeed.y * range + uRise * aParams.x + uScroll * 0.25;
    float life = mod(travel, range) / range;          // 0 born .. 1 gone
    float y = start + life * range;
    float t = uTime * (0.8 + aParams.x) + aParams.y * 6.2831;
    float x = aSeed.x * ext.x * uSpread * (0.35 + life * 0.65) + sin(t * 1.3) * 0.12 * life;

    vec4 mv = modelViewMatrix * vec4(x, y, depth, 1.0);
    vLife = life;
    vFlicker = 0.6 + 0.4 * sin(t * 6.0);
    vAlpha = uOpacity;
    gl_PointSize = uSize * aParams.z * uPixelRatio * (1.0 - life * 0.55) * (uCamZ / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

export const emberFragment = /* glsl */ `
  uniform vec3 uHot;
  uniform vec3 uCool;

  varying float vLife;
  varying float vFlicker;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord * 2.0 - 1.0;
    float d = length(c);
    float core = smoothstep(0.5, 0.0, d);
    float glow = smoothstep(1.0, 0.2, d) * 0.45;
    float fade = smoothstep(0.0, 0.08, vLife) * (1.0 - smoothstep(0.65, 1.0, vLife));
    float a = (core + glow) * fade * vFlicker * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(mix(uHot, uCool, vLife), a);
    #include <colorspace_fragment>
    #include <premultiplied_alpha_fragment>
  }
`;
