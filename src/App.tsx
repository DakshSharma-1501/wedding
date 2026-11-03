import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion';
import { lazy, Suspense, useEffect, useState } from 'react';
import { EnvelopeIntro } from './components/intro/EnvelopeIntro';
import { AudioToggle } from './components/ui/AudioToggle';
import { ChunkErrorBoundary } from './components/scene/ChunkErrorBoundary';
import { SceneBackdrops } from './components/scene/SceneBackdrops';
import { CalmBackdrop } from './components/ui/CalmBackdrop';
import { GoldCursor } from './components/ui/GoldCursor';
import { ScrollCue } from './components/ui/ScrollCue';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { usePreloader } from './hooks/usePreloader';
import { startScrollEngine } from './lib/scroll';
import { GaneshScene } from './scenes/ganesh/GaneshScene';
import { useExperience } from './store/experience';
import { CanvasErrorBoundary } from './three/CanvasErrorBoundary';
import { loadCanvas } from './three/loadCanvas';

const BackgroundCanvas = lazy(loadCanvas);
const LaterScenes = lazy(() => import('./scenes/LaterScenes'));

export default function App() {
  const webgl = useExperience((s) => s.webgl);
  const reduced = useExperience((s) => s.reducedMotion);
  const phase = useExperience((s) => s.phase);
  const useGL = webgl && !reduced;
  // Mount (and therefore fetch/evaluate) three.js only once the seal is broken.
  const mountGL = useGL && phase !== 'loading' && phase !== 'sealed';

  // Paint the envelope first, then mount the (hidden) scenes in a separate task, so the
  // first frame isn't one long main-thread block on mid-range phones.
  const [scenesMounted, setScenesMounted] = useState(false);
  useEffect(() => {
    let timer = 0;
    const frame = requestAnimationFrame(() => {
      timer = window.setTimeout(() => setScenesMounted(true), 0);
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, []);

  usePreloader();
  useEffect(() => startScrollEngine({ smooth: !reduced }), [reduced]);

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <SceneBackdrops />
        {useGL ? (
          mountGL && (
            <CanvasErrorBoundary>
              <Suspense fallback={null}>
                <BackgroundCanvas />
              </Suspense>
            </CanvasErrorBoundary>
          )
        ) : (
          <CalmBackdrop />
        )}

        <ScrollProgress />
        <AudioToggle />
        <GoldCursor />

        <main id="main" className="relative z-10">
          {scenesMounted && (
            <>
              <GaneshScene />
              <ChunkErrorBoundary>
                <Suspense fallback={null}>
                  <LaterScenes />
                </Suspense>
              </ChunkErrorBoundary>
            </>
          )}
        </main>

        <ScrollCue />
        <EnvelopeIntro />
        <div className="grain" aria-hidden="true" />
      </LazyMotion>
    </MotionConfig>
  );
}
