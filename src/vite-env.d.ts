/// <reference types="vite/client" />

import type { Camera, Scene, WebGLRenderer } from 'three';

declare global {
  interface Window {
    /** Exposed in dev only, for the Parallax three.js debug tooling. */
    scene?: Scene;
    __THREE_CAMERA__?: Camera;
    __renderer__?: WebGLRenderer;
    webkitAudioContext?: typeof AudioContext;
  }
  interface Navigator {
    deviceMemory?: number;
  }
}
