import { useMediaQuery } from './useMediaQuery';

/**
 * True when the user has asked the OS to minimise motion.
 * Every animation (GSAP, Framer Motion, R3F) should respect this.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
