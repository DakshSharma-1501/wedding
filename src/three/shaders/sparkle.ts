/** Twinkling four-point gold glints drifting slowly upward (GL points — the cheapest primitive). */
export const sparkleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform float uOpacity;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uCamZ;
  uniform vec2 uHalf;

  attribute vec3 aSeed;    // x [-1,1], y [0,1], z [-1,1]
  attribute vec3 aParams;  // twinkle speed, phase, size

  varying float vTwinkle;
  varying float vAlpha;

  void main() {
    float depth = aSeed.z * 2.0;
    float persp = (uCamZ - depth) / uCamZ;
    vec2 ext = uHalf * persp;
    float range = ext.y * 2.0 + 0.4;
    float near = aSeed.z * 0.5 + 0.5;
    float travel = aSeed.y * range + uTime * 0.05 * (0.5 + aParams.x * 0.5) + uScroll * (0.15 + near * 0.3);
    float y = -ext.y - 0.2 + mod(travel, range);
    float x = aSeed.x * ext.x + sin(uTime * 0.3 + aParams.y) * 0.12;

    vec4 mv = modelViewMatrix * vec4(x, y, depth, 1.0);
    float tw = 0.5 + 0.5 * sin(uTime * aParams.x * 2.2 + aParams.y * 6.2831);
    vTwinkle = tw * tw * tw;
    vAlpha = uOpacity;
    gl_PointSize = uSize * aParams.z * uPixelRatio * (0.55 + vTwinkle * 0.8) * (uCamZ / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

export const sparkleFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uCore;

  varying float vTwinkle;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord * 2.0 - 1.0;
    float d = length(c);
    float star = max(0.0, 1.0 - (abs(c.x) * abs(c.y) * 28.0 + d * 1.2));
    float core = smoothstep(0.35, 0.0, d);
    float a = clamp(star * 0.9 + core, 0.0, 1.0) * (0.2 + vTwinkle * 0.8) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(mix(uColor, uCore, core), a);
    #include <colorspace_fragment>
    #include <premultiplied_alpha_fragment>
  }
`;
