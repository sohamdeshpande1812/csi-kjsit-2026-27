import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Shared <Canvas> wrapper for every 3D scene on the site.
 * Centralises renderer defaults (adaptive DPR caps, tone mapping, transparency),
 * handles WebGL context loss/restoration gracefully, and automatically pauses
 * the render loop when the canvas is scrolled off-screen or when the user
 * prefers reduced motion.
 *
 * @param {{
 *   children: React.ReactNode,
 *   camera?: object,
 *   className?: string,
 *   fallback?: React.ReactNode,
 * }} props
 */
export default function SceneCanvas({
  children,
  camera = { position: [0, 0, 6], fov: 40 },
  className,
  fallback = null,
}) {
  const reducedMotion = usePrefersReducedMotion();
  const isCompactViewport = useMediaQuery('(max-width: 768px)');
  const hostRef = useRef(null);
  const cleanupContextListenersRef = useRef(null);
  const [inView, setInView] = useState(true);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin: '120px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (cleanupContextListenersRef.current) {
        cleanupContextListenersRef.current();
      }
    };
  }, []);

  const isLowPowerDevice =
    typeof navigator !== 'undefined' &&
    typeof navigator.hardwareConcurrency === 'number' &&
    navigator.hardwareConcurrency <= 4;

  const maxDpr = isCompactViewport || isLowPowerDevice ? 1.35 : 1.75;

  let frameloop = 'always';
  if (!inView || contextLost) {
    frameloop = 'never';
  } else if (reducedMotion) {
    frameloop = 'demand';
  }

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
      aria-hidden="true"
    >
      <Canvas
        camera={camera}
        dpr={[1, maxDpr]}
        eventSource={typeof document !== 'undefined' ? document.documentElement : undefined}
        eventPrefix="client"
        gl={{
          antialias: !isLowPowerDevice,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        frameloop={frameloop}
        onCreated={({ gl }) => {
          const domElement = gl.domElement;
          const handleContextLost = (event) => {
            event.preventDefault();
            setContextLost(true);
          };
          const handleContextRestored = () => {
            setContextLost(false);
          };
          domElement.addEventListener('webglcontextlost', handleContextLost, false);
          domElement.addEventListener('webglcontextrestored', handleContextRestored, false);
          cleanupContextListenersRef.current = () => {
            domElement.removeEventListener('webglcontextlost', handleContextLost, false);
            domElement.removeEventListener('webglcontextrestored', handleContextRestored, false);
          };
        }}
      >
        <Suspense fallback={fallback}>{children}</Suspense>
        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  );
}
