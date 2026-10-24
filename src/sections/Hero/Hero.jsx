import { lazy, Suspense, useRef } from 'react';
import { site } from '@/data/site';
import { gsap, useGSAP } from '@/animations/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { Button, StageSchematicFallback } from '@/components/ui';
import WebGLBoundary from '@/three/WebGLBoundary';
import styles from './Hero.module.css';

// Lazy-load the Three.js / R3F hero scene so the initial UI bundle paints immediately.
const HeroScene = lazy(() => import('@/three/scenes/HeroScene'));

export default function Hero() {
  const heroRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !heroRef.current) return;

      try {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
        });

        tl.fromTo(
          '[data-hero-eyebrow]',
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, clearProps: 'transform,opacity' },
        )
          .fromTo(
            '[data-hero-line]',
            { yPercent: 100, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.72,
              stagger: 0.12,
              clearProps: 'transform,opacity',
            },
            '-=0.3',
          )
          .fromTo(
            '[data-hero-lead]',
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.58, clearProps: 'transform,opacity' },
            '-=0.4',
          )
          .fromTo(
            '[data-hero-cta]',
            { y: 14, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.52,
              stagger: 0.1,
              clearProps: 'transform,opacity',
            },
            '-=0.32',
          )
          .fromTo(
            '[data-hero-meta]',
            { y: 12, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.08,
              clearProps: 'transform,opacity',
            },
            '-=0.34',
          )
          .fromTo(
            '[data-hero-stage]',
            { y: 20, scale: 0.97, opacity: 0 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.85,
              clearProps: 'transform,opacity',
            },
            0.08,
          );

        gsap.to('[data-hero-gantry]', {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        });

        gsap.to('[data-hero-glow]', {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn('[Hero] GSAP entrance/parallax skipped:', err);
        }
      }
    },
    { scope: heroRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      id="home"
      ref={heroRef}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      {/* Cinematic industrial sci-fi environment & warm amber atmospheric lighting */}
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.industrialBeams} data-hero-gantry />
        <div className={styles.glow} data-hero-glow />
        <div className={styles.lightSweep} />
        <div className={styles.horizonLine} />
      </div>

      <div className={`container ${styles.layout}`}>
        <div className={styles.content}>
          <div className={styles.eyebrowPlate} data-hero-eyebrow>
            <img
              src="/csi-logo.png"
              alt=""
              width="26"
              height="26"
              className={styles.eyebrowLogo}
              aria-hidden="true"
              decoding="async"
            />
            <span className="hud-label">
              {site.fullName} · {site.year}
            </span>
          </div>

          <h1 id="hero-title" className={styles.title}>
            <span className={styles.lineMask}>
              <span className={styles.lineInner} data-hero-line>
                <span className="text-metal">MORE THAN MEETS</span>
              </span>
            </span>
            <span className={styles.lineMask}>
              <span className={styles.lineInner} data-hero-line>
                <span className="text-energy">THE CODE.</span>
              </span>
            </span>
          </h1>

          <p className={styles.lead} data-hero-lead>
            {site.heroSupportingText}
          </p>

          <div className={styles.actions}>
            <span className={styles.ctaSlot} data-hero-cta>
              <Button href={site.heroPrimaryCta.href} size="lg">
                {site.heroPrimaryCta.label}
              </Button>
            </span>
            <span className={styles.ctaSlot} data-hero-cta>
              <Button href={site.heroSecondaryCta.href} variant="ghost" size="lg">
                {site.heroSecondaryCta.label}
              </Button>
            </span>
          </div>

          <dl className={styles.metaBar}>
            <div className={styles.metaItem} data-hero-meta>
              <dt>Chapter</dt>
              <dd>CSI — KJSIT</dd>
            </div>
            <div className={styles.metaItem} data-hero-meta>
              <dt>Academic Term</dt>
              <dd>2026 Edition</dd>
            </div>
            <div className={styles.metaItem} data-hero-meta>
              <dt>Divisions</dt>
              <dd>Tech · DCC · Ops · PR</dd>
            </div>
          </dl>
        </div>

        {/* Unboxed, towering 3D Cybertronian Prime Titan environmental stage */}
        <div
          id="hero-robot-stage"
          className={styles.titanStage}
          data-hero-stage
          role="region"
          aria-label="Interactive 3D Cybertronian Titan"
        >
          <div className={styles.titanAtmosphere} aria-hidden="true">
            <div className={styles.amberFlare} />
            <div className={styles.gantryFrame} />
            <div className={styles.pedestalGlow} />
          </div>

          <div className={styles.canvasViewport}>
            <WebGLBoundary
              fallback={
                <StageSchematicFallback
                  id="hero-webgl-fallback"
                  label="3D Environment Standby"
                />
              }
            >
              <Suspense
                fallback={
                  <StageSchematicFallback
                    id="hero-loading-fallback"
                    label="Initializing Cybertronian Titan…"
                  />
                }
              >
                <HeroScene />
              </Suspense>
            </WebGLBoundary>
          </div>
        </div>
      </div>

      <a href="#about" className={styles.scrollCue} aria-label="Scroll to About Us section">
        <span>Scroll</span>
        <span className={styles.scrollLine} aria-hidden="true" />
      </a>
    </section>
  );
}
