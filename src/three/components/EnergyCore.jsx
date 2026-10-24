import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { palette } from '../palette';

/**
 * Splits an icosahedron into individual triangular "armour plates".
 * Each plate is centred on its own origin so it can later be animated
 * independently (e.g. a GSAP-driven assemble / transform sequence).
 */
function useArmourPlates(radius = 1.15, inset = 0.88) {
  const plates = useMemo(() => {
    const source = new THREE.IcosahedronGeometry(radius, 0); // non-indexed
    const pos = source.getAttribute('position');
    const plates = [];

    for (let i = 0; i < pos.count; i += 3) {
      const a = new THREE.Vector3().fromBufferAttribute(pos, i);
      const b = new THREE.Vector3().fromBufferAttribute(pos, i + 1);
      const c = new THREE.Vector3().fromBufferAttribute(pos, i + 2);
      const centroid = a.clone().add(b).add(c).divideScalar(3);

      // Shrink toward the centroid to leave seams the core glows through.
      const local = [a, b, c].map((v) => v.sub(centroid).multiplyScalar(inset));
      const geometry = new THREE.BufferGeometry().setFromPoints(local);
      geometry.computeVertexNormals();

      plates.push({ geometry, centroid, direction: centroid.clone().normalize() });
    }

    source.dispose();
    return plates;
  }, [radius, inset]);

  // Geometries passed via props are not auto-disposed by R3F.
  useEffect(() => () => plates.forEach((p) => p.geometry.dispose()), [plates]);

  return plates;
}

/**
 * Placeholder hero object — an abstract "energy core":
 * segmented metallic armour plates around a glowing blue core, wrapped in
 * a restrained cyan wireframe cage and an orbit ring.
 *
 * Stand-in until a custom GLTF model (see /public/models) is produced.
 *
 * @param {{ animate?: boolean, spread?: number }} props
 *   spread — how far plates sit from the core (0 = sealed). Future
 *            scroll animations will drive this value.
 */
export default function EnergyCore({ animate = true, spread = 0.08 }) {
  const group = useRef(null);
  const cage = useRef(null);
  const ring = useRef(null);
  const plates = useArmourPlates();

  useFrame((state, delta) => {
    if (!animate || !group.current) return;

    // Slow idle rotation.
    cage.current.rotation.y += delta * 0.12;
    cage.current.rotation.x += delta * 0.05;
    ring.current.rotation.z -= delta * 0.25;

    // Subtle pointer parallax — damped so it never feels twitchy.
    const { x, y } = state.pointer;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, x * 0.35, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -y * 0.2, 3, delta);
  });

  return (
    <Float enabled={animate} speed={1.2} rotationIntensity={0.25} floatIntensity={0.6}>
      <group ref={group} rotation={[0.35, 0.6, 0]}>
        {/* Segmented metallic armour */}
        {plates.map(({ geometry, centroid, direction }, i) => (
          <mesh
            key={i}
            geometry={geometry}
            position={centroid.clone().addScaledVector(direction, spread)}
          >
            <meshStandardMaterial
              color={palette.silver}
              metalness={0.9}
              roughness={0.32}
              side={THREE.DoubleSide}
              flatShading
            />
          </mesh>
        ))}

        {/* Inner energy core */}
        <mesh scale={0.82}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color={palette.blue}
            emissive={palette.blue}
            emissiveIntensity={2.4}
            toneMapped={false}
          />
        </mesh>

        {/* Wireframe cage */}
        <mesh ref={cage} scale={1.7}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color={palette.cyan} wireframe transparent opacity={0.14} />
        </mesh>

        {/* Orbit ring (the orange "satellite" is parented so it orbits with it) */}
        <mesh ref={ring} rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[2.1, 0.007, 8, 160]} />
          <meshBasicMaterial color={palette.blue} transparent opacity={0.55} />

          {/* Single rare orange accent */}
          <mesh position={[2.1, 0, 0]} scale={0.045}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color={palette.orange} toneMapped={false} />
          </mesh>
        </mesh>
      </group>
    </Float>
  );
}
