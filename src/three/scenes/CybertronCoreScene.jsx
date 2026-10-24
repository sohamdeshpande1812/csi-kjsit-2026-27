import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import SceneCanvas from '../SceneCanvas';
import CybertronCore from '../components/CybertronCore';
import { palette } from '../palette';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

function ResponsiveCoreCamera({ isMobile }) {
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    camera.position.set(0, 0, isMobile ? 5.65 : 5.15);
    camera.fov = isMobile ? 40 : 38;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, isMobile, invalidate]);

  return null;
}

/**
 * Scene wrapper for the reusable CybertronCore 3D component.
 */
export default function CybertronCoreScene({
  speed = 1,
  intensity = 1,
  particleCount = 48,
  scrollSensitivity = 1,
  scrollProgressRef,
  scale = 1,
  className,
}) {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery('(max-width: 640px)');

  const effectiveParticles = reducedMotion
    ? 18
    : isMobile
      ? Math.min(particleCount, 28)
      : particleCount;

  return (
    <SceneCanvas
      className={className}
      camera={{
        position: [0, 0, isMobile ? 5.65 : 5.15],
        fov: isMobile ? 40 : 38,
        near: 0.1,
        far: 25,
      }}
    >
      <ResponsiveCoreCamera isMobile={isMobile} />

      <ambientLight intensity={0.38} />
      <directionalLight
        position={[3.5, 4.5, 4.0]}
        intensity={2.4 * intensity}
        color={palette.silverLight}
      />
      <directionalLight
        position={[-4.0, -2.5, -2.0]}
        intensity={3.0 * intensity}
        color={palette.orange}
      />
      <directionalLight
        position={[3.2, -2.0, -2.5]}
        intensity={1.6 * intensity}
        color={palette.blue}
      />

      {/* Procedural metallic reflection environment for dark steel & chrome rings */}
      <Environment resolution={isMobile ? 128 : 256} frames={1}>
        <Lightformer
          form="rect"
          intensity={3.4}
          color={palette.silverLight}
          position={[0, 5, -4]}
          scale={[10, 2.5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          color={palette.silver}
          position={[0, 0, 6]}
          scale={[8, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3.4}
          color={palette.orange}
          position={[-5, 1, 1]}
          rotation-y={Math.PI / 2}
          scale={[8, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.4}
          color={palette.amberBright}
          position={[5, -1, 1]}
          rotation-y={-Math.PI / 2}
          scale={[6, 2, 1]}
        />
      </Environment>

      <CybertronCore
        speed={speed}
        intensity={intensity}
        particleCount={effectiveParticles}
        scrollSensitivity={scrollSensitivity}
        scrollProgressRef={scrollProgressRef}
        scale={scale}
        animate={!reducedMotion}
      />
    </SceneCanvas>
  );
}
