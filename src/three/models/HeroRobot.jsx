import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { palette } from '../palette';
import bumblebeePose from './bumblebeePose.json';

const MODEL_PATH = '/models/bumblebee_guardian.glb';
const TARGET_HEIGHT = 2.32;
const BASE_Y = -1.16;
const BASE_ROTATION_Y = -0.16;

/**
 * HeroRobot — Authentic 293-part Autobot Guardian Bumblebee 3D centerpiece.
 * Loads the Draco-compressed Bumblebee GLB model, assembles all 293 segmented
 * components into standing Robot Mode with illuminated Cybertronian blue optics,
 * normalizes scale/bounds onto the hangar bay pedestal, and drives articulated
 * head-tracking + smooth pointer rotation.
 */
export default function HeroRobot({
  animate = true,
  isMobile = false,
}) {
  const gltf = useGLTF(MODEL_PATH, '/draco/');
  const invalidate = useThree((state) => state.invalidate);

  const outerGroupRef = useRef(null);
  const chestLightRef = useRef(null);
  const opticsLightRef = useRef(null);
  const revealProgressRef = useRef(animate ? 0 : 1);
  const targetPointerRef = useRef({ x: 0, y: 0 });
  const smoothedPointerRef = useRef({ x: 0, y: 0 });
  const headPivotRef = useRef(null);
  const headRestQuatRef = useRef(new THREE.Quaternion());
  const headEulerRef = useRef(new THREE.Euler());
  const headDeltaQuatRef = useRef(new THREE.Quaternion());

  // Track pointer across the entire browser viewport so Bumblebee responds everywhere on screen
  useEffect(() => {
    if (typeof window === 'undefined' || !animate) return undefined;

    const handlePointerMove = (e) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      targetPointerRef.current.x = THREE.MathUtils.clamp((e.clientX / w) * 2 - 1, -1, 1);
      targetPointerRef.current.y = THREE.MathUtils.clamp(-((e.clientY / h) * 2 - 1), -1, 1);
      invalidate();
    };

    const handlePointerLeave = () => {
      targetPointerRef.current.x = 0;
      targetPointerRef.current.y = 0;
      invalidate();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('blur', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
    };
  }, [animate, invalidate]);

  // Clone scene safely, assemble Bumblebee's 293-part Robot Mode pose, normalize bounds, and tune PBR materials
  const { clonedScene, normScale, normOffset, clonedMaterials, headMesh, headRestQuat } =
    useMemo(() => {
      const root = cloneSkeleton(gltf.scene);
      const materials = [];
      let detectedHead = null;
      const restQuat = new THREE.Quaternion();

      // 1. Apply standing Robot Mode transforms for all 293 segmented parts of Bumblebee
      root.traverse((child) => {
        if (!child.isMesh) return;

        if (child.name && bumblebeePose[child.name]) {
          const frame = bumblebeePose[child.name];
          child.position.set(frame[0], frame[1], frame[2]);
          child.quaternion.set(frame[3], frame[4], frame[5], frame[6]);
          child.visible = Boolean(frame[7]);
        }

        if (child.name === 'Original_robot_3') {
          detectedHead = child;
        }
      });

      root.updateMatrixWorld(true);

      // 2. Add glowing Cybertronian blue optics to Bumblebee's head mesh ('Original_robot_3')
      if (detectedHead) {
        const eyeGeo = new THREE.SphereGeometry(0.019, 14, 10);
        const eyeMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color('#47c4ff'),
          toneMapped: false,
        });
        materials.push(eyeMat);
        for (const x of [-0.074, 0.074]) {
          const eyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
          const localPos = detectedHead.worldToLocal(new THREE.Vector3(x, 3.31, 0.32));
          eyeMesh.position.copy(localPos);
          eyeMesh.scale.set(1, 0.8, 0.5);
          detectedHead.add(eyeMesh);
        }
        restQuat.copy(detectedHead.quaternion);
      }

      // 3. Compute bounding box of visible meshes
      const visibleBox = new THREE.Box3();
      const partBox = new THREE.Box3();
      root.traverse((child) => {
        if (!child.isMesh || !child.visible || !child.geometry) return;
        if (!child.geometry.boundingBox) {
          child.geometry.computeBoundingBox();
        }
        partBox.copy(child.geometry.boundingBox).applyMatrix4(child.matrixWorld);
        visibleBox.union(partBox);
      });

      // 4. Enhance PBR materials
      root.traverse((child) => {
        if (!child.isMesh || !child.visible) return;
        child.castShadow = false;
        child.receiveShadow = false;
        child.frustumCulled = false;

        if (child.material && child.material.type !== 'MeshBasicMaterial') {
          const mat = child.material.clone();
          if (mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
          }
          if ('metalness' in mat) {
            mat.metalness = Math.min(Math.max(mat.metalness ?? 0.48, 0.45), 0.68);
          }
          if ('roughness' in mat) {
            mat.roughness = Math.min(Math.max(mat.roughness ?? 0.5, 0.34), 0.56);
          }
          mat.envMapIntensity = 1.18;
          mat.needsUpdate = true;
          child.material = mat;
          materials.push(mat);
        }
      });

      const size = visibleBox.getSize(new THREE.Vector3());
      const center = visibleBox.getCenter(new THREE.Vector3());

      const safeHeight = size.y > 0.001 ? size.y : 1;
      const scale = TARGET_HEIGHT / safeHeight;
      const offset = new THREE.Vector3(
        -center.x * scale,
        -visibleBox.min.y * scale,
        -center.z * scale,
      );

      return {
        clonedScene: root,
        normScale: scale,
        normOffset: offset,
        clonedMaterials: materials,
        headMesh: detectedHead,
        headRestQuat: restQuat,
      };
    }, [gltf.scene]);

  useEffect(() => {
    headPivotRef.current = headMesh;
    headRestQuatRef.current.copy(headRestQuat);

    return () => {
      clonedMaterials.forEach((mat) => mat.dispose());
    };
  }, [clonedMaterials, headMesh, headRestQuat]);

  useEffect(() => {
    revealProgressRef.current = animate ? 0 : 1;
    invalidate();
  }, [animate, invalidate]);

  useFrame((state, delta) => {
    if (!outerGroupRef.current) return;

    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const baseScale = isMobile ? 0.92 : 1.0;

    // 1. Entrance reveal
    if (revealProgressRef.current < 1) {
      revealProgressRef.current = Math.min(1, revealProgressRef.current + dt * 1.4);
      invalidate();
    }
    const easeOut = 1 - Math.pow(1 - revealProgressRef.current, 3);

    if (!animate) {
      outerGroupRef.current.position.set(0, BASE_Y, 0);
      outerGroupRef.current.rotation.set(0, BASE_ROTATION_Y, 0);
      outerGroupRef.current.scale.setScalar(baseScale);
      return;
    }

    // 2. Smooth full-viewport pointer tracking
    const ptr = smoothedPointerRef.current;
    const target = targetPointerRef.current;
    const damp = 1 - Math.exp(-6.5 * dt);
    ptr.x += (target.x - ptr.x) * damp;
    ptr.y += (target.y - ptr.y) * damp;

    // 3. Heroic breathing & expanded cursor-reactive rotational range
    const breathY = Math.sin(t * 1.45) * 0.02;
    const idleYaw = Math.sin(t * 0.42) * 0.045;

    outerGroupRef.current.position.y =
      BASE_Y - (1 - easeOut) * 0.22 + breathY;
    outerGroupRef.current.position.x = ptr.x * 0.08;
    outerGroupRef.current.rotation.y =
      BASE_ROTATION_Y + idleYaw + ptr.x * 0.48;
    outerGroupRef.current.rotation.x = -ptr.y * 0.11;
    outerGroupRef.current.rotation.z = -ptr.x * 0.035;
    outerGroupRef.current.scale.setScalar(baseScale * (0.9 + 0.1 * easeOut));

    // 4. Articulated head tracking (Bumblebee turns his head noticeably toward cursor across viewport)
    if (headPivotRef.current) {
      const yaw = ptr.x * 0.42 + Math.sin(t * 0.65) * 0.04;
      const pitch = -ptr.y * 0.24 + Math.sin(t * 1.05) * 0.025;
      headEulerRef.current.set(pitch, yaw, 0, 'YXZ');
      headDeltaQuatRef.current.setFromEuler(headEulerRef.current);
      headPivotRef.current.quaternion
        .copy(headRestQuatRef.current)
        .multiply(headDeltaQuatRef.current);
    }

    // 5. Dynamic optics & chest lighting pulse
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
    if (chestLightRef.current) {
      chestLightRef.current.intensity = 1.6 + pulse * 0.8;
    }
    if (opticsLightRef.current) {
      opticsLightRef.current.intensity = 1.8 + pulse * 0.7;
    }
  });

  return (
    <group
      ref={outerGroupRef}
      position={[0, BASE_Y, 0]}
      rotation={[0, BASE_ROTATION_Y, 0]}
    >
      {/* Normalized Bumblebee GLB Model */}
      <group
        position={[normOffset.x, normOffset.y, normOffset.z]}
        scale={[normScale, normScale, normScale]}
      >
        <primitive object={clonedScene} />
      </group>

      {/* Subtle Hero Accent Lights */}
      <pointLight
        ref={opticsLightRef}
        position={[0.12, 2.15, 0.65]}
        intensity={2.0}
        distance={2.5}
        color={palette.blueBright}
      />
      <pointLight
        ref={chestLightRef}
        position={[0, 1.35, 0.75]}
        intensity={1.8}
        distance={3.2}
        color={palette.amberBright}
      />
    </group>
  );
}

useGLTF.preload(MODEL_PATH, '/draco/');
