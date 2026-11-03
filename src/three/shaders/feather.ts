/**
 * Instanced peacock feathers. Each falls like a real feather: a pendulum swing whose tilt
 * follows the swing, a slow spin about its quill, and extra twirl from scroll velocity
 * (uTwirl). The feather is drawn analytically in the fragment shader — vane, loose barbs
 * at the base, quill, and the iridescent eye — so there is no texture to load.
 */
export const featherVertex = /* glsl */ `
  uniform float uTime;
  uniform float uFall;
  uniform float uTwirl;
  uniform float uScroll;
  uniform float uOpacity;
  uniform float uCamZ;
  uniform vec2 uHalf;

  attribute vec3 aSeed;    // x [-1,1], y [0,1], z depth [-1,1]
  attribute vec4 aParams;  // fall speed, phase, size, swing amplitude

  varying vec2 vUv;
  varying float vShade;
  varying float vAlpha;

  void main() {
    vUv = uv;
    float depth = aSeed.z * 2.4;
    float persp = (uCamZ - depth) / uCamZ;
    vec2 ext = uHalf * persp;
    float margin = 1.3;
    float range = ext.y * 2.0 + margin * 2.0;
    float near = aSeed.z * 0.5 + 0.5;

    float travel = aSeed.y * range + uFall * aParams.x - uScroll * (0.2 + near * 0.4);
    float y = ext.y + margin - mod(travel, range);

    float t = uTime * (0.45 + aParams.x * 0.9) + aParams.y;
    float x = aSeed.x * (ext.x + 0.3) + sin(t) * aParams.w;

    vec3 p = position * aParams.z;
    float along = position.y / 0.8;                       // -1 (base) .. 1 (tip)
    p.z += along * along * 0.28 * aParams.z;              // natural curve
    p.x += sin(position.y * 2.2 + t * 2.0) * 0.035 * aParams.z; // barb flutter

    float tilt = (aParams.y - 3.14) * 0.16 + cos(t) * 0.5;
    float spin = t * 0.3 + uTwirl * (0.5 + aParams.x * 1.5);
    float cs = cos(spin), ss = sin(spin), ct = cos(tilt), st = sin(tilt);
    mat3 Ry = mat3(cs, 0.0, -ss, 0.0, 1.0, 0.0, ss, 0.0, cs);
    mat3 Rz = mat3(ct, st, 0.0, -st, ct, 0.0, 0.0, 0.0, 1.0);
    mat3 R = Rz * Ry;
    vec3 n = R * vec3(0.0, 0.0, 1.0);
    vShade = 0.45 + 0.55 * abs(dot(n, normalize(vec3(0.3, 0.55, 0.78))));

    vec3 world = vec3(x, y, depth) + R * p;
    vAlpha = uOpacity * (0.55 + near * 0.45);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
  }
`;

export const featherFragment = /* glsl */ `
  uniform vec3 uBarbInner;
  uniform vec3 uBarbOuter;
  uniform vec3 uQuill;
  uniform vec3 uBronze;
  uniform vec3 uGreen;
  uniform vec3 uTeal;
  uniform vec3 uBlue;
  uniform vec3 uSheen;

  varying vec2 vUv;
  varying float vShade;
  varying float vAlpha;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;                 // tip at y = +1
    float x = p.x - 0.05 * sin(p.y * 1.8);
    float y = p.y;
    float ax = abs(x);

    float w = mix(0.06, 0.92, smoothstep(-1.0, -0.05, y)) * (1.0 - smoothstep(0.8, 1.0, y) * 0.7);
    float barbCoord = (y - ax * 0.9) * 48.0;
    float barbs = 0.5 + 0.5 * sin(barbCoord);
    float edge = w * (0.9 + 0.1 * sin(barbCoord * 0.5));
    float vane = 1.0 - smoothstep(edge * 0.78, edge, ax);
    float loose = smoothstep(0.05, -0.8, y);
    vane *= mix(1.0, smoothstep(0.3, 0.9, barbs), loose);

    float quill = (1.0 - smoothstep(0.012, 0.03, ax)) * smoothstep(1.0, 0.35, y);

    float e = length(vec2(x / 0.5, (y - 0.5) / 0.36));
    float inEye = 1.0 - smoothstep(0.94, 1.02, e);
    vec3 eyeCol = mix(uBlue, uTeal, smoothstep(0.32, 0.42, e));
    eyeCol = mix(eyeCol, uGreen, smoothstep(0.58, 0.66, e));
    eyeCol = mix(eyeCol, uBronze, smoothstep(0.8, 0.86, e));

    vec3 col = mix(uBarbInner, uBarbOuter, smoothstep(0.0, 1.0, ax / max(w, 0.01)));
    col *= 0.72 + 0.28 * barbs;
    col = mix(col, eyeCol, inEye);
    col = mix(col, uQuill, quill);
    col *= 0.62 + 0.5 * vShade;
    col += uSheen * pow(vShade, 6.0) * 0.35;   // iridescent glint as it turns

    float alpha = max(max(vane, inEye), quill) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
    #include <premultiplied_alpha_fragment>
  }
`;
