import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import SceneCanvas from '../SceneCanvas';
import HeroRobot from '../models/HeroRobot';
import { palette } from '../palette';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

function ResponsiveHeroCamera({ isMobile }) {
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    camera.position.set(0, isMobile ? 0.02 : 0.04, isMobile ? 4.55 : 4.25);
    camera.fov = isMobile ? 34 : 32;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, isMobile, invalidate]);

  return null;
}

/**
 * Industrial Cybertronian Hangar Gantry, Turbine Bay Ring & Rising Molten Embers.
 */
function IndustrialHangarBay({ animate = true, isMobile = false }) {
  const turbineRingRef = useRef(null);
  const outerBayRef = useRef(null);
  const sparksRef = useRef(null);
  const sweepLightRef = useRef(null);

  const emberCount = isMobile ? 28 : 54;

  const { emberGeo, emberSpeeds } = useMemo(() => {
    const positions = new Float32Array(emberCount * 3);
    const speeds = new Float32Array(emberCount);
    for (let i = 0; i < emberCount; i += 1) {
      const seed = (i + 1) * 19.73;
      const angle = (seed * 2.39996) % (Math.PI * 2);
      const radius = 0.35 + ((seed * 0.41) % 1.15);
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = -1.25 + ((seed * 0.67) % 2.55);
      positions[i * 3 + 2] = -0.75 + Math.sin(angle) * 0.55;
      speeds[i] = 0.16 + ((seed * 0.13) % 0.26);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { emberGeo: geo, emberSpeeds: speeds };
  }, [emberCount]);

  useEffect(() => {
    return () => {
      emberGeo.dispose();
    };
  }, [emberGeo]);

  useFrame((state, delta) => {
    if (!animate) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    if (turbineRingRef.current) {
      turbineRingRef.current.rotation.z = t * 0.14;
    }
    if (outerBayRef.current) {
      outerBayRef.current.rotation.z = -t * 0.07;
    }
    if (sweepLightRef.current) {
      sweepLightRef.current.position.x = Math.sin(t * 0.55) * 2.0;
    }

    if (sparksRef.current) {
      const posAttr = sparksRef.current.geometry?.attributes?.position;
      if (posAttr && posAttr.array) {
        const arr = posAttr.array;
        for (let i = 0; i < emberCount; i += 1) {
          arr[i * 3 + 1] += emberSpeeds[i] * dt;
          arr[i * 3] += Math.sin(t * 1.4 + i) * 0.001;
          if (arr[i * 3 + 1] > 1.35) {
            arr[i * 3 + 1] = -1.25;
          }
        }
        posAttr.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* Sweeping warm industrial spotlight */}
      <pointLight
        ref={sweepLightRef}
        position={[0, 1.3, 1.4]}
        intensity={1.8}
        distance={5.5}
        color={palette.amberBright}
      />

      {/* Rotating Cybertronian Turbine Halo behind the Guardian */}
      <group position={[0, 0.2, -0.68]}>
        <mesh ref={outerBayRef}>
          <ringGeometry args={[0.88, 0.91, 8]} />
          <meshBasicMaterial
            color="#6f8099"
            transparent
            opacity={0.34}
          />
        </mesh>
        <mesh ref={turbineRingRef}>
          <ringGeometry args={[0.7, 0.715, 6]} />
          <meshBasicMaterial
            color={palette.amber}
            transparent
            opacity={0.42}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[0.54, 0.546, 48]} />
          <meshBasicMaterial
            color={palette.blue}
            transparent
            opacity={0.28}
          />
        </mesh>
      </group>

      {/* Industrial Floor Platform & Molten Reactor Grate Under-Glow */}
      <group position={[0, -1.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[0.44, 0.82, 8]} />
          <meshStandardMaterial
            color="#202734"
            metalness={0.9}
            roughness={0.32}
          />
        </mesh>
        <mesh position={[0, 0, 0.005]}>
          <ringGeometry args={[0.3, 0.43, 6]} />
          <meshBasicMaterial
            color={palette.orange}
            transparent
            opacity={0.62}
          />
        </mesh>
        <mesh position={[0, 0, 0.008]}>
          <ringGeometry args={[0.83, 0.85, 32]} />
          <meshBasicMaterial
            color={palette.amberBright}
            transparent
            opacity={0.38}
          />
        </mesh>
      </group>

      {/* Rising Molten-Amber Ember Sparks */}
      <points ref={sparksRef} geometry={emberGeo}>
        <pointsMaterial
          color={palette.amberBright}
          size={0.022}
          transparent
          opacity={0.82}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/**
 * Cinematic 3D Hero Scene featuring Autobot Guardian Bumblebee in an industrial Cybertronian bay.
 */
export default function HeroScene({ className }) {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <SceneCanvas
      className={className}
      camera={{
        position: [0, isMobile ? 0.02 : 0.04, isMobile ? 4.55 : 4.25],
        fov: isMobile ? 34 : 32,
        near: 0.1,
        far: 30,
      }}
    >
      <ResponsiveHeroCamera isMobile={isMobile} />

      {/* Balanced studio hemisphere + ambient illumination */}
      <ambientLight intensity={0.48} />
      <hemisphereLight args={['#c9daef', '#17131a', 1.25]} />

      {/* Key light — crisp studio highlights across front/right armor plates */}
      <directionalLight
        position={[3.6, 5.2, 4.8]}
        intensity={2.4}
        color="#fff0e0"
      />

      {/* Dramatic molten-orange rim light from back-left */}
      <directionalLight
        position={[-4.5, 3.2, -2.6]}
        intensity={3.6}
        color={palette.orange}
      />

      {/* Warm amber edge kicker from front-left */}
      <directionalLight
        position={[-3.4, 1.6, 3.0]}
        intensity={1.6}
        color={palette.amberBright}
      />

      {/* Restrained electric-blue optical rim light from back-right */}
      <directionalLight
        position={[4.2, 2.8, -2.8]}
        intensity={2.6}
        color={palette.blue}
      />

      {/* Molten under-bay forge uplight beneath the Titan */}
      <pointLight
        position={[0, -1.12, 1.2]}
        intensity={2.4}
        distance={3.8}
        color={palette.orange}
      />

      {/* Procedural metallic reflection environment */}
      <Environment resolution={isMobile ? 128 : 256} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.2}
          color={palette.silverLight}
          position={[0, 5, -4]}
          scale={[10, 2.5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          color={palette.silver}
          position={[2, 1.5, 6]}
          scale={[8, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.6}
          color={palette.orange}
          position={[-6, 1.2, -2]}
          rotation-y={Math.PI / 2}
          scale={[8, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.8}
          color={palette.amberBright}
          position={[-4, -2, 2]}
          rotation-y={Math.PI / 3}
          scale={[6, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.8}
          color={palette.blue}
          position={[6, 0.5, -1]}
          rotation-y={-Math.PI / 2}
          scale={[6, 2.5, 1]}
        />
      </Environment>

      <IndustrialHangarBay animate={!reducedMotion} isMobile={isMobile} />
      <HeroRobot animate={!reducedMotion} isMobile={isMobile} />
    </SceneCanvas>
  );
}
