/**
 * Shared Framer Motion variants & transitions.
 * Reuse these so motion feels consistent across the interface.
 */

export const easeOut = [0.22, 1, 0.36, 1];

export const transitions = {
  fast: { duration: 0.2, ease: easeOut },
  base: { duration: 0.45, ease: easeOut },
  slow: { duration: 0.8, ease: easeOut },
};

/** Fade + rise. Use with `initial="hidden" animate="visible"`. */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transitions.slow },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.slow },
};

/** Parent container that staggers its children. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});
