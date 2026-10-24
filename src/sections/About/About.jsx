import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { aboutContent } from '@/data/about';
import { gsap, ScrollTrigger, useGSAP } from '@/animations/gsap';
import { Button, SectionHeading, StageSchematicFallback } from '@/components/ui';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import WebGLBoundary from '@/three/WebGLBoundary';
import styles from './About.module.css';

const CybertronCoreScene = lazy(() => import('@/three/scenes/CybertronCoreScene'));

function PillarEmblem({ id }) {
  if (id === 'innovation') {
    return (
      <svg viewBox="0 0 48 48" className={styles.emblem} aria-hidden="true">
        <polygon
          points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
          fill="rgba(26, 32, 44, 0.85)"
          stroke="#c8d2e2"
          strokeWidth="1.6"
        />
        <polygon
          points="24,9 36,16.5 36,31.5 24,39 12,31.5 12,16.5"
          fill="none"
          stroke="rgba(255, 154, 46, 0.55)"
          strokeWidth="1.2"
        />
        <polygon
          points="24,14 32,24 24,34 16,24"
          fill="rgba(255, 114, 31, 0.25)"
          stroke="#ffb03a"
          strokeWidth="1.5"
        />
        <circle cx="24" cy="24" r="3.2" fill="#ffc145" />
      </svg>
    );
  }

  if (id === 'collaboration') {
    return (
      <svg viewBox="0 0 48 48" className={styles.emblem} aria-hidden="true">
        <polygon
          points="24,4 43,15 43,33 24,44 5,33 5,15"
          fill="rgba(26, 32, 44, 0.85)"
          stroke="#c8d2e2"
          strokeWidth="1.6"
        />
        <circle cx="18" cy="20" r="7.5" fill="none" stroke="#dfe6f2" strokeWidth="1.5" />
        <circle cx="30" cy="20" r="7.5" fill="none" stroke="#dfe6f2" strokeWidth="1.5" />
        <circle
          cx="24"
          cy="29.5"
          r="7.5"
          fill="rgba(255, 114, 31, 0.22)"
          stroke="#ff9a2e"
          strokeWidth="1.6"
        />
        <circle cx="24" cy="23" r="2.6" fill="#68b5ff" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" className={styles.emblem} aria-hidden="true">
      <polygon
        points="24,3 44,24 24,45 4,24"
        fill="rgba(26, 32, 44, 0.85)"
        stroke="#c8d2e2"
        strokeWidth="1.6"
      />
      <polygon
        points="24,10 37,24 24,38 11,24"
        fill="rgba(255, 114, 31, 0.2)"
        stroke="#ff9a2e"
        strokeWidth="1.4"
      />
      <path
        d="M18.5 24l4 4 7.5-8"
        fill="none"
        stroke="#ffc145"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * About Us section featuring the interactive 3D CybertronCore.
 */
export default function About({
  coreSpeed = aboutContent.coreStage.config.speed,
  coreIntensity = aboutContent.coreStage.config.intensity,
}) {
  const ref = useScrollReveal();
  const coreStageHostRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();
  const [shouldMountCore, setShouldMountCore] = useState(false);

  useEffect(() => {
    const el = ref.current || coreStageHostRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldMountCore(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMountCore(true);
          observer.disconnect();
        }
      },
      { rootMargin: '480px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return;

      try {
        const panels = gsap.utils.toArray('[data-about-panel]', ref.current);
        if (panels.length) {
          gsap.from(panels, {
            y: 28,
            opacity: 0,
            duration: 0.78,
            stagger: 0.14,
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: '[data-about-overview]',
              start: 'top 82%',
              once: true,
            },
          });
        }

        ScrollTrigger.create({
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress;
          },
        });

        gsap.fromTo(
          '[data-about-core-stage]',
          { y: 12 },
          {
            y: -12,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-about-overview]',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          },
        );

        const pillars = gsap.utils.toArray('[data-about-pillar]', ref.current);
        if (pillars.length) {
          gsap.from(pillars, {
            y: 30,
            opacity: 0,
            duration: 0.72,
            stagger: 0.14,
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: '[data-about-pillars]',
              start: 'top 85%',
              once: true,
            },
          });
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn('[About] GSAP scroll animation skipped:', err);
        }
      }
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <section
      id="about"
      ref={ref}
      className={`section ${styles.about}`}
      aria-labelledby="about-title"
    >
      <div className="container">
        <SectionHeading
          index="01"
          eyebrow={aboutContent.eyebrow}
          title={<span id="about-title">{aboutContent.title}</span>}
          lead={aboutContent.lead}
        />

        <div className={styles.overviewGrid} data-about-overview>
          <div className={`${styles.narrativeCard} chamfer`} data-about-panel>
            <div className={styles.cardHeader}>
              <span className="hud-label">CHAPTER MANDATE · KJSIT</span>
              <span className={styles.establishedTag}>EST. STUDENT CHAPTER</span>
            </div>

            <div className={styles.paragraphs}>
              {aboutContent.paragraphs.map((text, index) => (
                <p key={index}>{text}</p>
              ))}
            </div>

            <div className={styles.narrativeActions}>
              <Button href="#events">Explore Events</Button>
              <Button href="#team" variant="ghost">
                Meet the Divisions
              </Button>
            </div>
          </div>

          <div
            id="about-cybertron-core"
            ref={coreStageHostRef}
            className={styles.coreChamber}
            data-about-panel
            data-about-core-stage
            role="region"
            aria-label={aboutContent.coreStage.title}
          >
            <div className={styles.coreBackdropGlow} aria-hidden="true" />

            <div className={styles.coreViewport}>
              {shouldMountCore ? (
                <WebGLBoundary
                  fallback={
                    <StageSchematicFallback
                      id="core-webgl-fallback"
                      label="3D Core Standby"
                    />
                  }
                >
                  <Suspense
                    fallback={
                      <StageSchematicFallback
                        id="core-loading-fallback"
                        label="Initializing Cybertron Core…"
                      />
                    }
                  >
                    <CybertronCoreScene
                      speed={coreSpeed}
                      intensity={coreIntensity}
                      particleCount={aboutContent.coreStage.config.particleCount}
                      scrollSensitivity={aboutContent.coreStage.config.scrollSensitivity}
                      scrollProgressRef={scrollProgressRef}
                    />
                  </Suspense>
                </WebGLBoundary>
              ) : (
                <StageSchematicFallback
                  id="core-standby-fallback"
                  label="Standby · 3D Core Ready"
                />
              )}
            </div>
          </div>
        </div>

        <div
          className={styles.pillarsGrid}
          role="list"
          aria-label="CSI KJSIT core pillars"
          data-about-pillars
        >
          {aboutContent.pillars.map((pillar) => (
            <article
              key={pillar.id}
              role="listitem"
              className={`${styles.pillarCard} chamfer`}
              data-about-pillar
            >
              <div className={styles.pillarTop}>
                <PillarEmblem id={pillar.id} />
                <span className={styles.pillarIndex}>{pillar.index}</span>
              </div>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarDescription}>{pillar.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
