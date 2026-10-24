import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { palette } from '../palette';

/**
 * Reusable interactive 3D CybertronCore component.
 *
 * Redesigned with a blazing molten-amber & solar-orange central energy core,
 * heavy forged-gunmetal and brushed-chrome concentric mechanical rings,
 * warm ember particles, and restrained electric-blue optical telemetry nodes.
 */
export default function CybertronCore({
  speed = 1,
  intensity = 1,
  particleCount = 48,
  scrollSensitivity = 1,
  scrollProgressRef,
  scale = 1,
  animate = true,
}) {
  const rootRef = useRef(null);
  const scrollGroupRef = useRef(null);
  const sphereRef = useRef(null);
  const latticeRef = useRef(null);
  const shutterGroupRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);
  const satellitesGroupRef = useRef(null);
  const satelliteMeshRefs = useRef([]);
  const particlesRef = useRef(null);
  const coreLightRef = useRef(null);

  const pointerSmoothed = useRef({ x: 0, y: 0 });
  const scrollSmoothed = useRef(0);

  // Shared PBR materials — forged gunmetal, brushed chrome, molten amber core & restrained blue optics.
  const materials = useMemo(() => {
    const darkMetal = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#191f2a'),
      metalness: 0.92,
      roughness: 0.32,
      envMapIntensity: 1.45,
    });

    const gunmetal = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#4f5c70'),
      metalness: 0.9,
      roughness: 0.26,
      envMapIntensity: 1.5,
    });

    const silverHighlight = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e2e8f2'),
      metalness: 0.96,
      roughness: 0.16,
      envMapIntensity: 1.75,
    });

    const coreSphereMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.orange),
      emissive: new THREE.Color(palette.orange),
      emissiveIntensity: 2.6 * intensity,
      roughness: 0.16,
      toneMapped: false,
    });

    const coreAmberMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.amberBright),
      emissive: new THREE.Color(palette.amber),
      emissiveIntensity: 3.4 * intensity,
      roughness: 0.1,
      toneMapped: false,
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(palette.amberBright),
      wireframe: true,
      transparent: true,
      opacity: 0.38,
    });

    const opticBlueNodeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(palette.cyan),
      toneMapped: false,
    });

    return {
      darkMetal,
      gunmetal,
      silverHighlight,
      coreSphereMat,
      coreAmberMat,
      wireMat,
      opticBlueNodeMat,
    };
  }, [intensity]);

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [materials]);

  // Shared geometries across all repeated rings, shutters, clamps, teeth, and satellites.
  const geometries = useMemo(() => {
    return {
      innerHeart: new THREE.IcosahedronGeometry(0.36, 2),
      outerSphere: new THREE.SphereGeometry(0.54, 28, 28),
      wireShell: new THREE.IcosahedronGeometry(0.66, 1),
      shutterBody: new THREE.BoxGeometry(0.12, 0.38, 0.22),
      shutterBevel: new THREE.BoxGeometry(0.035, 0.3, 0.15),
      shutterEmitter: new THREE.BoxGeometry(0.025, 0.24, 0.065),
      ring1Torus: new THREE.TorusGeometry(1.06, 0.048, 14, 64),
      ring1Conduit: new THREE.TorusGeometry(1.0, 0.015, 10, 64),
      ring1Clamp: new THREE.BoxGeometry(0.15, 0.13, 0.12),
      ring2Torus: new THREE.TorusGeometry(1.36, 0.036, 14, 72),
      ring2Tooth: new THREE.BoxGeometry(0.13, 0.09, 0.11),
      ring2Emitter: new THREE.BoxGeometry(0.03, 0.055, 0.055),
      ring3Torus: new THREE.TorusGeometry(1.66, 0.032, 12, 64),
      ring3Stabilizer: new THREE.BoxGeometry(0.18, 0.24, 0.13),
      ring3Cap: new THREE.BoxGeometry(0.055, 0.18, 0.09),
      opticNode: new THREE.SphereGeometry(0.034, 10, 10),
      satOcta: new THREE.OctahedronGeometry(0.08, 0),
      satBar: new THREE.BoxGeometry(0.17, 0.045, 0.045),
      satDot: new THREE.SphereGeometry(0.02, 8, 8),
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((g) => g.dispose());
    };
  }, [geometries]);

  const { shutterAngles, ring1Clamps, ring2Teeth, satellites, particleGeo } = useMemo(() => {
    const shutters = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);
    const clamps1 = Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2);
    const teeth2 = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);

    const sats = Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2 + 0.3;
      const radius = 1.5 + (i % 2) * 0.22;
      const yOffset = ((i % 3) - 1) * 0.42;
      return {
        position: [
          Math.cos(angle) * radius,
          yOffset,
          Math.sin(angle) * radius,
        ],
        spinSpeed: [0.6 + i * 0.15, 0.8 - i * 0.1, 0.4 + (i % 2) * 0.3],
      };
    });

    const count = Math.max(0, Math.min(particleCount, 120));
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const u = (i + 0.5) / Math.max(count, 1);
      const phi = Math.acos(1 - 2 * u);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.32 + ((i * 7) % 11) * 0.075;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    return {
      shutterAngles: shutters,
      ring1Clamps: clamps1,
      ring2Teeth: teeth2,
      satellites: sats,
      particleGeo: pGeo,
    };
  }, [particleCount]);

  useEffect(() => {
    return () => {
      particleGeo.dispose();
    };
  }, [particleGeo]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = speed;
    const t = state.clock.elapsedTime * s;

    const targetX = animate ? state.pointer.x : 0;
    const targetY = animate ? state.pointer.y : 0;
    pointerSmoothed.current.x = THREE.MathUtils.damp(pointerSmoothed.current.x, targetX, 3.8, dt);
    pointerSmoothed.current.y = THREE.MathUtils.damp(pointerSmoothed.current.y, targetY, 3.8, dt);

    if (rootRef.current) {
      rootRef.current.rotation.y = pointerSmoothed.current.x * 0.42;
      rootRef.current.rotation.x = -pointerSmoothed.current.y * 0.28;
    }

    const rawScroll =
      scrollProgressRef && typeof scrollProgressRef.current === 'number'
        ? scrollProgressRef.current * 2.4 * scrollSensitivity
        : typeof window !== 'undefined'
          ? (window.scrollY / Math.max(window.innerHeight, 1)) * scrollSensitivity
          : 0;
    scrollSmoothed.current = THREE.MathUtils.damp(scrollSmoothed.current, rawScroll, 4.2, dt);

    if (scrollGroupRef.current) {
      scrollGroupRef.current.rotation.y = scrollSmoothed.current * 0.95;
      scrollGroupRef.current.rotation.z = scrollSmoothed.current * 0.32;
      scrollGroupRef.current.rotation.x = Math.sin(scrollSmoothed.current * 0.8) * 0.18;
    }

    if (!animate) return;

    const pulse = Math.sin(t * 2.2);
    if (sphereRef.current) {
      const coreScale = 1 + pulse * 0.05 * Math.min(intensity, 1.5);
      sphereRef.current.scale.setScalar(coreScale);
    }
    materials.coreSphereMat.emissiveIntensity = (2.5 + pulse * 0.55) * intensity;
    materials.coreAmberMat.emissiveIntensity = (3.3 + pulse * 0.65) * intensity;

    if (coreLightRef.current) {
      coreLightRef.current.intensity = (6.2 + pulse * 1.8) * intensity;
    }

    if (latticeRef.current) {
      latticeRef.current.rotation.y -= dt * 0.35 * s;
      latticeRef.current.rotation.x += dt * 0.22 * s;
    }

    if (shutterGroupRef.current) {
      shutterGroupRef.current.rotation.y += dt * 0.28 * s;
      shutterGroupRef.current.rotation.z = Math.sin(t * 0.7) * 0.15;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += dt * 0.48 * s;
      ring1Ref.current.rotation.x = 0.35 + Math.sin(t * 0.5) * 0.12;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= dt * 0.34 * s;
      ring2Ref.current.rotation.x += dt * 0.18 * s;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z -= dt * 0.2 * s;
      ring3Ref.current.rotation.y += dt * 0.14 * s;
    }

    if (satellitesGroupRef.current) {
      satellitesGroupRef.current.rotation.y += dt * 0.16 * s;
    }
    satelliteMeshRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const cfg = satellites[idx];
      if (!cfg) return;
      mesh.rotation.x += dt * cfg.spinSpeed[0] * s;
      mesh.rotation.y += dt * cfg.spinSpeed[1] * s;
      mesh.rotation.z += dt * cfg.spinSpeed[2] * s;
    });

    if (particlesRef.current) {
      particlesRef.current.rotation.y -= dt * 0.09 * s;
      particlesRef.current.rotation.x = Math.sin(t * 0.35) * 0.12;
      particlesRef.current.position.y = Math.sin(t * 0.8) * 0.05;
    }
  });

  return (
    <Float
      enabled={animate}
      speed={1.1 * speed}
      rotationIntensity={0.18}
      floatIntensity={0.35}
    >
      <group ref={rootRef} scale={scale}>
        <group ref={scrollGroupRef}>
          {/* Dynamic warm molten-amber core point light */}
          <pointLight
            ref={coreLightRef}
            color={palette.amber}
            intensity={6.2 * intensity}
            distance={6.0}
            decay={1.5}
          />

          {/* 1. GLOWING MOLTEN-AMBER CENTRAL ENERGY SPHERE & INNER LATTICE */}
          <group ref={sphereRef}>
            <mesh geometry={geometries.innerHeart} material={materials.coreAmberMat} />
            <mesh geometry={geometries.outerSphere} material={materials.coreSphereMat} />
          </group>

          <mesh
            ref={latticeRef}
            geometry={geometries.wireShell}
            material={materials.wireMat}
          />

          {/* 2. ANGULAR MECHANICAL SHUTTER SEGMENTS AROUND THE SPHERE */}
          <group ref={shutterGroupRef} rotation={[0.25, 0, 0.18]}>
            {shutterAngles.map((angle, i) => {
              const r = 0.8;
              const x = Math.cos(angle) * r;
              const z = Math.sin(angle) * r;
              return (
                <group key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
                  <mesh geometry={geometries.shutterBody} material={materials.darkMetal} />
                  <mesh
                    position={[0.045, 0, 0]}
                    geometry={geometries.shutterBevel}
                    material={materials.silverHighlight}
                  />
                  <mesh
                    position={[-0.05, 0, 0]}
                    geometry={geometries.shutterEmitter}
                    material={materials.coreAmberMat}
                  />
                </group>
              );
            })}
          </group>

          {/* 3. RING 1 — PRIMARY INNER FORGED-STEEL GIMBAL RING */}
          <group ref={ring1Ref} rotation={[0.35, 0.2, 0]}>
            <mesh geometry={geometries.ring1Torus} material={materials.gunmetal} />
            <mesh geometry={geometries.ring1Conduit} material={materials.coreSphereMat} />

            {ring1Clamps.map((angle, i) => (
              <mesh
                key={i}
                position={[Math.cos(angle) * 1.06, Math.sin(angle) * 1.06, 0]}
                rotation={[0, 0, angle]}
                geometry={geometries.ring1Clamp}
                material={materials.silverHighlight}
              />
            ))}
          </group>

          {/* 4. RING 2 — SECONDARY INCLINED BRUSHED-CHROME GYRO RING */}
          <group ref={ring2Ref} rotation={[-0.62, 0.45, 0.3]}>
            <mesh geometry={geometries.ring2Torus} material={materials.silverHighlight} />

            {ring2Teeth.map((angle, i) => (
              <group
                key={i}
                position={[Math.cos(angle) * 1.36, Math.sin(angle) * 1.36, 0]}
                rotation={[0, 0, angle]}
              >
                <mesh geometry={geometries.ring2Tooth} material={materials.darkMetal} />
                {i % 2 === 0 && (
                  <mesh
                    position={[0.065, 0, 0]}
                    geometry={geometries.ring2Emitter}
                    material={materials.coreAmberMat}
                  />
                )}
              </group>
            ))}
          </group>

          {/* 5. RING 3 — OUTER DARK-GUNMETAL CONTAINMENT RING WITH BLUE OPTIC NODES */}
          <group ref={ring3Ref} rotation={[0.88, -0.35, 0.15]}>
            <mesh geometry={geometries.ring3Torus} material={materials.darkMetal} />

            {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, i) => (
              <group
                key={i}
                position={[Math.cos(angle) * 1.66, Math.sin(angle) * 1.66, 0]}
                rotation={[0, 0, angle]}
              >
                <mesh geometry={geometries.ring3Stabilizer} material={materials.gunmetal} />
                <mesh
                  position={[0.06, 0, 0]}
                  geometry={geometries.ring3Cap}
                  material={materials.silverHighlight}
                />
              </group>
            ))}

            <mesh
              position={[1.66, 0, 0.08]}
              geometry={geometries.opticNode}
              material={materials.opticBlueNodeMat}
            />
            <mesh
              position={[-1.66, 0, 0.08]}
              geometry={geometries.opticNode}
              material={materials.opticBlueNodeMat}
            />
          </group>

          {/* 6. SMALL FLOATING MECHANICAL COMPONENTS */}
          <group ref={satellitesGroupRef}>
            {satellites.map((sat, i) => (
              <group
                key={i}
                position={sat.position}
                ref={(el) => {
                  satelliteMeshRefs.current[i] = el;
                }}
              >
                <mesh
                  geometry={geometries.satOcta}
                  material={i % 2 === 0 ? materials.silverHighlight : materials.gunmetal}
                />
                <mesh geometry={geometries.satBar} material={materials.darkMetal} />
                <mesh
                  position={[0, 0.065, 0]}
                  geometry={geometries.satDot}
                  material={i % 3 === 0 ? materials.opticBlueNodeMat : materials.coreAmberMat}
                />
              </group>
            ))}
          </group>

          {/* 7. WARM MOLTEN-AMBER DRIFTING SPARKS */}
          {particleCount > 0 && (
            <points ref={particlesRef} geometry={particleGeo}>
              <pointsMaterial
                color={palette.amberBright}
                size={0.036}
                transparent
                opacity={0.72 * Math.min(intensity, 1.4)}
                sizeAttenuation
                depthWrite={false}
              />
            </points>
          )}
        </group>
      </group>
    </Float>
  );
}
