/**
 * Central GSAP setup.
 *
 * Always import gsap / ScrollTrigger / useGSAP from this module rather than
 * from the packages directly — it guarantees plugins are registered exactly
 * once and keeps the animation stack swappable in one place.
 *
 * Strict division of responsibility (never animate the same DOM node with both):
 *  - GSAP + ScrollTrigger → Hero entrance timeline, section scroll reveals,
 *                           batch card reveals, background parallax, and
 *                           scroll-linked 3D progress.
 *  - Framer Motion       → Interactive UI state transitions: mobile nav drawer,
 *                           modal open/close, and modal tab content switching.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Prevent mobile address-bar show/hide from triggering layout jumps on touchscreens.
ScrollTrigger.config({
  ignoreMobileResize: true,
});

gsap.defaults({
  ease: 'power3.out',
  duration: 0.72,
});

export { gsap, ScrollTrigger, useGSAP };
