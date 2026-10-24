import { useRef, useState } from 'react';
import {
  hasValidWebsiteUrl,
  sponsorCategoryDefinitions,
  sponsorTiers,
} from '@/data/sponsors';
import { gsap, useGSAP } from '@/animations/gsap';
import { Button, SectionHeading } from '@/components/ui';
import { CybertronBackground } from '@/components/layout';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './Sponsors.module.css';

function SponsorSlotCard({ slot, isTitleTier }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const logoSrc = slot.logo ?? slot.logoUrl ?? null;
  const showLogo = Boolean(logoSrc) && !imgError;
  const hasWebsite = hasValidWebsiteUrl(slot.websiteUrl);

  const innerContent = (
    <>
      <span className={styles.lightSweep} data-sponsor-sweep aria-hidden="true" />
      {showLogo ? (
        <div className={styles.logoFrame}>
          {!imgLoaded && (
            <span className="hud-label" aria-hidden="true">
              Loading Logo…
            </span>
          )}
          <img
            src={logoSrc}
            alt={slot.name || slot.label}
            className={`${styles.logoImage} ${imgLoaded ? styles.logoReady : ''}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
          <span className={styles.confirmedName}>{slot.name || slot.label}</span>
          {hasWebsite && (
            <span className={styles.websiteTag} aria-hidden="true">
              Official Website ↗
            </span>
          )}
        </div>
      ) : (
        <div className={styles.slotPlaceholder}>
          <svg viewBox="0 0 40 40" className={styles.slotIcon} aria-hidden="true">
            <polygon
              points="20,3 35,11.5 35,28.5 20,37 5,28.5 5,11.5"
              fill="rgba(255, 114, 31, 0.08)"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <polygon
              points="20,10 29,15.5 29,24.5 20,30 11,24.5 11,15.5"
              fill="none"
              stroke="#d95b12"
              strokeWidth="1.2"
              strokeDasharray="3 2"
            />
            <circle cx="20" cy="20" r="3" fill="#e06214" />
          </svg>
          <p className={styles.slotTitle}>{slot.name || slot.label}</p>
          <p className={styles.slotSub}>{slot.sublabel}</p>
          {hasWebsite && (
            <span className={styles.websiteTag} aria-hidden="true">
              Official Website ↗
            </span>
          )}
        </div>
      )}
    </>
  );

  const slotClasses = `${styles.logoSlot} ${isTitleTier ? styles.logoSlotTitleTier : ''} ${
    hasWebsite ? styles.logoSlotInteractive : ''
  } chamfer`;

  if (hasWebsite) {
    return (
      <a
        href={slot.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        role="listitem"
        className={slotClasses}
        data-sponsor-slot
        aria-label={`${slot.name || slot.label} — Visit official website`}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <div role="listitem" className={slotClasses} data-sponsor-slot>
      {innerContent}
    </div>
  );
}

export default function Sponsors() {
  const ref = useScrollReveal();
  const hasMountedRef = useRef(false);
  const reducedMotion = usePrefersReducedMotion();
  const [activeCategoryId, setActiveCategoryId] = useState('all');

  const visibleTiers =
    activeCategoryId === 'all'
      ? sponsorTiers
      : sponsorTiers.filter((tier) => tier.id === activeCategoryId);

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return;

      try {
        const tierBlocks = gsap.utils.toArray('[data-sponsor-tier]', ref.current);

        if (hasMountedRef.current) {
          const slots = gsap.utils.toArray('[data-sponsor-slot]', ref.current);
          if (slots.length) {
            gsap.fromTo(
              slots,
              { opacity: 0, y: 14 },
              {
                opacity: 1,
                y: 0,
                duration: 0.42,
                stagger: 0.06,
                ease: 'power3.out',
                clearProps: 'transform,opacity',
              },
            );
          }
          return;
        }

        hasMountedRef.current = true;

        tierBlocks.forEach((tierBlock) => {
          const header = tierBlock.querySelector('[data-sponsor-header]');
          const slots = gsap.utils.toArray('[data-sponsor-slot]', tierBlock);
          const sweeps = gsap.utils.toArray('[data-sponsor-sweep]', tierBlock);

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: tierBlock,
              start: 'top 86%',
              once: true,
            },
          });

          if (header) {
            tl.from(header, {
              opacity: 0,
              y: 16,
              duration: 0.5,
              clearProps: 'transform,opacity',
            });
          }

          if (slots.length) {
            tl.from(
              slots,
              {
                opacity: 0,
                y: 20,
                duration: 0.58,
                stagger: 0.08,
                clearProps: 'transform,opacity',
              },
              '-=0.25',
            );
          }

          if (sweeps.length) {
            tl.fromTo(
              sweeps,
              { xPercent: -130, opacity: 0 },
              {
                xPercent: 230,
                opacity: 1,
                duration: 1.05,
                stagger: 0.09,
                ease: 'power2.inOut',
              },
              '-=0.35',
            );
          }
        });
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn('[Sponsors] GSAP reveal skipped:', err);
        }
      }
    },
    { scope: ref, dependencies: [activeCategoryId, reducedMotion] },
  );

  return (
    <section
      id="sponsors"
      ref={ref}
      className={`section ${styles.sponsors}`}
      aria-labelledby="sponsors-title"
    >
      <CybertronBackground variant="light" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.topRow}>
          <SectionHeading
            index="03"
            tone="light"
            eyebrow="Sponsors & Partners"
            title={<span id="sponsors-title">Sponsors &amp; Institutional Partners.</span>}
            lead="Neutral brushed-metallic showcase preserving original partner logo proportions and brand colours. Slots display transparent placeholders until official 2026 partnerships are confirmed."
          />

          <div
            className={styles.categoryFilter}
            role="tablist"
            aria-label="Filter sponsor categories"
            data-reveal
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeCategoryId === 'all'}
              className={`${styles.filterBtn} ${activeCategoryId === 'all' ? styles.filterActive : ''}`}
              onClick={() => setActiveCategoryId('all')}
            >
              All Tiers
            </button>

            {sponsorCategoryDefinitions.map((cat) => {
              const active = activeCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`${styles.filterBtn} ${active ? styles.filterActive : ''}`}
                  onClick={() => setActiveCategoryId(cat.id)}
                >
                  {cat.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.tiersWrapper}>
          {visibleTiers.map((tier) => (
            <div key={tier.id} className={styles.tierBlock} data-sponsor-tier>
              <div className={styles.tierHeader} data-sponsor-header>
                <span className={styles.tierCode}>{tier.tierCode}</span>
                <h3 className={styles.tierTitle}>{tier.tierName}</h3>
              </div>

              {tier.slots.length === 0 ? (
                <div className={styles.emptyTier}>
                  <p className="hud-label">NO SLOTS CONFIGURED</p>
                  <p className={styles.emptyTierText}>
                    Partner slots for {tier.tierName} will be listed here once announced.
                  </p>
                </div>
              ) : (
                <div
                  className={`${styles.logoGrid} ${styles[tier.columns]}`}
                  role="list"
                  aria-label={tier.tierName}
                >
                  {tier.slots.map((slot) => (
                    <SponsorSlotCard
                      key={slot.id}
                      slot={slot}
                      isTitleTier={tier.id === 'title-tier'}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`${styles.callout} chamfer`} data-reveal>
          <div>
            <p className="hud-label">PARTNERSHIP ENQUIRIES</p>
            <h3 className={styles.calloutTitle}>Partner with CSI KJSIT 2026</h3>
            <p className={styles.calloutText}>
              Sponsorship brochure and official chapter contact channels are listed in the footer below.
            </p>
          </div>
          <Button href="#footer">
            Contact Chapter
          </Button>
        </div>
      </div>
    </section>
  );
}
