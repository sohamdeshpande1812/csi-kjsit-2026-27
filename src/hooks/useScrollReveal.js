import { useRef } from 'react';
import { gsap, useGSAP } from '@/animations/gsap';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Cohesive GSAP + ScrollTrigger section reveal and transition hook.
 *
 * - Reveals `[data-reveal]` elements (such as section headings) as they
 *   enter the viewport.
 * - Animates `[data-section-line]` boundary indicators cleanly.
 * - Clears inline transforms on completion so CSS hover states never conflict.
 * - Automatically reverts all tweens and kills ScrollTriggers on unmount.
 *
 * @param {string} [selector='[data-reveal]']
 * @param {{ y?: number, stagger?: number, start?: string }} [options]
 */
export function useScrollReveal(selector = '[data-reveal]', options = {}) {
  const { y = 26, stagger = 0.1, start = 'top 84%' } = options;
  const scope = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !scope.current) return;

      try {
        const targets = gsap.utils.toArray(selector, scope.current);
        if (targets.length) {
          gsap.from(targets, {
            opacity: 0,
            y,
            duration: 0.7,
            stagger,
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: scope.current,
              start,
              once: true,
            },
          });
        }

        const divider = scope.current.querySelector('[data-section-line]');
        if (divider) {
          gsap.fromTo(
            divider,
            { scaleX: 0, opacity: 0.2 },
            {
              scaleX: 1,
              opacity: 1,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: scope.current,
                start: 'top 90%',
                once: true,
              },
            },
          );
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn('[useScrollReveal] Animation skipped:', err);
        }
      }
    },
    { scope, dependencies: [reducedMotion, selector, y, stagger, start] },
  );

  return scope;
}
