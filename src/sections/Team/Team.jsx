import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { allTeamMembers, teamTiers, hasValidSocialUrl } from '@/data/team';
import { SectionHeading } from '@/components/ui';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './Team.module.css';

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v7.6h2.8v-7.6h-2.8M7.86 6.55a1.63 1.63 0 0 0-1.63 1.63c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324Zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
    </svg>
  );
}

function getTierStyleClass(tier) {
  if (tier === 'subcore') return styles.cardTierSubcore;
  if (tier === 'members') return styles.cardTierMembers;
  return styles.cardTierCore;
}

export default function Team() {
  const ref = useScrollReveal();
  const reducedMotion = usePrefersReducedMotion();
  const [selectedTier, setSelectedTier] = useState('all');

  const filteredMembers = useMemo(() => {
    if (selectedTier === 'all') return allTeamMembers;
    return allTeamMembers.filter((m) => m.tier === selectedTier);
  }, [selectedTier]);

  return (
    <section id="team" ref={ref} className={`section ${styles.team}`} aria-labelledby="team-title">
      <div className="container">
        <SectionHeading
          index="04"
          eyebrow="Our Team"
          title={<span id="team-title">Chapter Team 2026–27</span>}
          lead="Meet the Core, Subcore, and Member teams of the CSI KJSIT Student Chapter."
        />

        {/* Tier Tabs: All, Core, Subcore, Members */}
        <div className={styles.tierNavWrapper}>
          <div className={styles.tierTabs} role="tablist" aria-label="Team Categories">
            {teamTiers.map((tier) => (
              <button
                key={tier.id}
                type="button"
                role="tab"
                aria-selected={selectedTier === tier.id}
                className={`${styles.tierBtn} ${selectedTier === tier.id ? styles.tierBtnActive : ''}`}
                onClick={() => setSelectedTier(tier.id)}
              >
                <span>{tier.label}</span>
                <span className={styles.tierBadge}>{tier.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Members Grid: Photo, Position, Name, Social Links */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTier}
            className={styles.cardsGrid}
            role="list"
            aria-label="Team Roster"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {filteredMembers.map((member) => {
              const tierClass = getTierStyleClass(member.tier);
              const hasLinkedin = hasValidSocialUrl(member.socials?.linkedin);
              const hasGithub = hasValidSocialUrl(member.socials?.github);
              const hasInstagram = hasValidSocialUrl(member.socials?.instagram);

              return (
                <article
                  key={member.id}
                  role="listitem"
                  className={`${styles.card} ${tierClass}`}
                >
                  {/* Photo */}
                  <div className={styles.photoWrapper}>
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={`${member.name} — ${member.role}`}
                        className={styles.photo}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.photoPlaceholder}>
                        <svg viewBox="0 0 24 24" className={styles.placeholderIcon} fill="none" stroke="currentColor">
                          <circle cx="12" cy="8" r="4" strokeWidth="1.6" />
                          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                        <span className={styles.placeholderText}>PHOTO TBA</span>
                      </div>
                    )}
                  </div>

                  {/* Position & Name */}
                  <div className={styles.info}>
                    <h3 className={styles.role}>{member.role}</h3>
                    <p className={styles.name}>{member.name}</p>
                  </div>

                  {/* Social Links */}
                  <div className={styles.socials}>
                    <a
                      href={hasLinkedin ? member.socials.linkedin : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.socialBtn} ${!hasLinkedin ? styles.socialBtnDisabled : ''}`}
                      aria-label={`${member.role} LinkedIn`}
                      title={hasLinkedin ? 'LinkedIn' : 'LinkedIn TBA'}
                    >
                      <LinkedInIcon />
                    </a>

                    <a
                      href={hasGithub ? member.socials.github : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.socialBtn} ${!hasGithub ? styles.socialBtnDisabled : ''}`}
                      aria-label={`${member.role} GitHub`}
                      title={hasGithub ? 'GitHub' : 'GitHub TBA'}
                    >
                      <GitHubIcon />
                    </a>

                    <a
                      href={hasInstagram ? member.socials.instagram : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.socialBtn} ${!hasInstagram ? styles.socialBtnDisabled : ''}`}
                      aria-label={`${member.role} Instagram`}
                      title={hasInstagram ? 'Instagram' : 'Instagram TBA'}
                    >
                      <InstagramIcon />
                    </a>
                  </div>
                </article>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
