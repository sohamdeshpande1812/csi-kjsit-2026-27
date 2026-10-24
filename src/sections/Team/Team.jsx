import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { hasValidSocialUrl, teamDivisions } from '@/data/team';
import { gsap, useGSAP } from '@/animations/gsap';
import { transitions } from '@/animations/motion';
import { Button, Modal, SectionHeading } from '@/components/ui';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './Team.module.css';

function DivisionEmblem({ type, className }) {
  const cls = className || styles.emblem;
  switch (type) {
    case 'tech':
      return (
        <svg viewBox="0 0 56 56" className={cls} aria-hidden="true">
          <polygon
            className={styles.emblemFrame}
            points="28,3 50,15.5 50,40.5 28,53 6,40.5 6,15.5"
            fill="rgba(24, 30, 42, 0.9)"
            stroke="#d8e1ef"
            strokeWidth="1.75"
          />
          <polygon
            className={styles.emblemInner}
            points="28,10 43,19 43,37 28,46 13,37 13,19"
            fill="rgba(255, 114, 31, 0.14)"
            stroke="#ff9a2e"
            strokeWidth="1.35"
          />
          <path
            className={styles.emblemGlyph}
            d="M22 22l-6 6 6 6M34 22l6 6-6 6M30 19l-4 18"
            fill="none"
            stroke="#ffc145"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="28" cy="10" r="2.2" fill="#68b5ff" />
          <circle cx="28" cy="46" r="2.2" fill="#68b5ff" />
        </svg>
      );
    case 'dcc':
      return (
        <svg viewBox="0 0 56 56" className={cls} aria-hidden="true">
          <polygon
            className={styles.emblemFrame}
            points="28,3 53,28 28,53 3,28"
            fill="rgba(24, 30, 42, 0.9)"
            stroke="#d8e1ef"
            strokeWidth="1.75"
          />
          <polygon
            className={styles.emblemInner}
            points="28,12 44,28 28,44 12,28"
            fill="rgba(255, 114, 31, 0.18)"
            stroke="#ff9a2e"
            strokeWidth="1.5"
          />
          <polygon
            points="28,19 37,28 28,37 19,28"
            fill="rgba(59, 130, 246, 0.22)"
            stroke="#68b5ff"
            strokeWidth="1.4"
          />
          <circle className={styles.emblemNode} cx="28" cy="28" r="3.8" fill="#ffc145" />
        </svg>
      );
    case 'operations':
      return (
        <svg viewBox="0 0 56 56" className={cls} aria-hidden="true">
          <circle
            className={styles.emblemOrbit}
            cx="28"
            cy="28"
            r="22"
            fill="rgba(24, 30, 42, 0.9)"
            stroke="#c8d3e3"
            strokeWidth="1.75"
            strokeDasharray="8 4"
          />
          <polygon
            className={styles.emblemInner}
            points="28,12 42,20 42,36 28,44 14,36 14,20"
            fill="rgba(255, 114, 31, 0.16)"
            stroke="#ff9a2e"
            strokeWidth="1.6"
          />
          <circle cx="28" cy="28" r="8" fill="none" stroke="#dfe6f2" strokeWidth="1.5" />
          <circle className={styles.emblemNode} cx="28" cy="28" r="3.8" fill="#ff7315" />
        </svg>
      );
    case 'pr':
    default:
      return (
        <svg viewBox="0 0 56 56" className={cls} aria-hidden="true">
          <polygon
            className={styles.emblemFrame}
            points="28,4 49,16 49,40 28,52 7,40 7,16"
            fill="rgba(24, 30, 42, 0.9)"
            stroke="#d8e1ef"
            strokeWidth="1.75"
          />
          <circle
            cx="28"
            cy="28"
            r="14"
            fill="rgba(255, 114, 31, 0.12)"
            stroke="rgba(255, 154, 46, 0.5)"
            strokeWidth="1.2"
          />
          <line x1="28" y1="23" x2="28" y2="15" stroke="#ff9a2e" strokeWidth="1.8" />
          <line x1="23.5" y1="30.5" x2="17" y2="34.5" stroke="#ff9a2e" strokeWidth="1.8" />
          <line x1="32.5" y1="30.5" x2="39" y2="34.5" stroke="#ff9a2e" strokeWidth="1.8" />
          <circle className={styles.emblemNode} cx="28" cy="28" r="4.5" fill="#ffc145" />
          <circle cx="28" cy="14" r="3" fill="#68b5ff" />
          <circle cx="16" cy="35" r="3" fill="#dfe6f2" />
          <circle cx="40" cy="35" r="3" fill="#dfe6f2" />
        </svg>
      );
  }
}

function MemberAvatar({ photoUrl, name }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(photoUrl) && !failed;

  return (
    <div className={styles.avatar} aria-hidden="true">
      {showPhoto ? (
        <>
          {!loaded && <span className={styles.avatarSkeleton} />}
          <img
            src={photoUrl}
            alt={name}
            className={`${styles.avatarImg} ${loaded ? styles.avatarImgReady : ''}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        </>
      ) : (
        <div className={styles.avatarPlaceholder}>
          <svg viewBox="0 0 24 24" className={styles.avatarIcon}>
            <circle cx="12" cy="8.5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M5 19.5c1.5-3.2 4.1-4.8 7-4.8s5.5 1.6 7 4.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <span>PHOTO TBA</span>
        </div>
      )}
    </div>
  );
}

function getMemberSocialLinks(member) {
  const links = [];
  if (hasValidSocialUrl(member.socialUrl)) {
    links.push({ key: 'profile', label: 'Profile ↗', url: member.socialUrl });
  }
  if (member.socials && typeof member.socials === 'object') {
    if (hasValidSocialUrl(member.socials.linkedin)) {
      links.push({ key: 'linkedin', label: 'LinkedIn ↗', url: member.socials.linkedin });
    }
    if (hasValidSocialUrl(member.socials.github)) {
      links.push({ key: 'github', label: 'GitHub ↗', url: member.socials.github });
    }
    if (hasValidSocialUrl(member.socials.website)) {
      links.push({ key: 'website', label: 'Portfolio ↗', url: member.socials.website });
    }
  }
  return links;
}

const ROLE_FILTERS = [
  { id: 'all', label: 'All Members' },
  { id: 'lead', label: 'Division Heads' },
  { id: 'core', label: 'Core Team' },
];

export default function Team() {
  const ref = useScrollReveal();
  const reducedMotion = usePrefersReducedMotion();
  const [activeDivision, setActiveDivision] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return;

      try {
        const cards = gsap.utils.toArray('[data-team-card]', ref.current);
        if (cards.length) {
          gsap.from(cards, {
            y: 30,
            opacity: 0,
            duration: 0.72,
            stagger: 0.13,
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: '[data-team-grid]',
              start: 'top 85%',
              once: true,
            },
          });
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn('[Team] GSAP division reveal skipped:', err);
        }
      }
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  const handleSelectDivision = (division) => {
    setActiveDivision(division);
    setRoleFilter('all');
    setSearchQuery('');
    if (!reducedMotion) {
      setIsLoadingRoster(true);
    }
  };

  useEffect(() => {
    if (!isLoadingRoster) return undefined;
    const timer = window.setTimeout(() => {
      setIsLoadingRoster(false);
    }, 150);
    return () => window.clearTimeout(timer);
  }, [isLoadingRoster]);

  const rawMembers = activeDivision?.members || [];
  const filteredMembers = rawMembers.filter((member) => {
    const matchesRole = roleFilter === 'all' || member.tier === roleFilter;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesRole;
    const hay = `${member.name} ${member.designation || member.role} ${member.year}`.toLowerCase();
    return matchesRole && hay.includes(q);
  });

  return (
    <section id="team" ref={ref} className={`section ${styles.team}`} aria-labelledby="team-title">
      <div className="container">
        <SectionHeading
          index="04"
          eyebrow="Chapter Divisions"
          title={<span id="team-title">Four Core Divisions. One Chapter.</span>}
          lead="Select any division monolith below to open its interactive member directory. Placeholder profiles are displayed until official 2026 photographs, designations, and social links are confirmed."
        />

        <div className={styles.grid} role="list" data-team-grid>
          {teamDivisions.map((division) => (
            <article
              key={division.id}
              role="listitem"
              tabIndex={0}
              aria-label={`${division.title} — ${division.fullName}. Click to open member directory.`}
              className={`${styles.card} chamfer`}
              data-team-card
              onClick={() => handleSelectDivision(division)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleSelectDivision(division);
                }
              }}
            >
              <div className={styles.cardTop}>
                <DivisionEmblem type={division.emblemType} />
                <span className={styles.divisionCode}>{division.code}</span>
              </div>

              <div className={styles.cardMain}>
                <h3 className={styles.title}>{division.title}</h3>
                <p className={styles.fullName}>{division.fullName}</p>
                <p className={styles.description}>{division.description}</p>
              </div>

              <ul className={styles.focusList}>
                {division.focusAreas.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>

              <div className={styles.cardFooter}>
                <span className={styles.rosterCount}>
                  {division.members.length} Directory Slots
                </span>
                <Button
                  variant="ghost"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleSelectDivision(division);
                  }}
                  aria-haspopup="dialog"
                >
                  Open Roster
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Modal
        open={Boolean(activeDivision)}
        onClose={() => setActiveDivision(null)}
        titleId="team-division-modal-title"
        size="lg"
        eyebrow={activeDivision ? `${activeDivision.code} · MEMBER DIRECTORY` : ''}
        title={activeDivision ? `${activeDivision.title} — ${activeDivision.fullName}` : ''}
        headerAccessory={
          activeDivision ? (
            <DivisionEmblem
              type={activeDivision.emblemType}
              className={styles.modalHeaderEmblem}
            />
          ) : null
        }
      >
        {activeDivision && (
          <div className={styles.modalContent}>
            <div className={styles.controlsBar}>
              <div className={styles.divisionTabs} role="tablist" aria-label="Switch division">
                {teamDivisions.map((div) => (
                  <button
                    key={div.id}
                    type="button"
                    role="tab"
                    aria-selected={div.id === activeDivision.id}
                    className={`${styles.tabBtn} ${div.id === activeDivision.id ? styles.tabActive : ''}`}
                    onClick={() => handleSelectDivision(div)}
                  >
                    {div.title}
                  </button>
                ))}
              </div>

              <div className={styles.filterGroup}>
                <div className={styles.roleFilterBar} role="group" aria-label="Filter by role">
                  {ROLE_FILTERS.map((rf) => (
                    <button
                      key={rf.id}
                      type="button"
                      className={`${styles.roleBtn} ${roleFilter === rf.id ? styles.roleBtnActive : ''}`}
                      onClick={() => setRoleFilter(rf.id)}
                    >
                      {rf.label}
                    </button>
                  ))}
                </div>

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search role or name…"
                  aria-label="Search division members"
                  className={styles.searchInput}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeDivision.id}
                className={styles.rosterPane}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={transitions.fast}
              >
                <p className={styles.modalLead}>{activeDivision.description}</p>

                {isLoadingRoster ? (
                  <div
                    className={styles.memberGrid}
                    role="status"
                    aria-live="polite"
                    aria-label="Loading division directory"
                  >
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className={styles.skeletonCard}>
                        <div className={styles.skeletonAvatar} />
                        <div className={styles.skeletonLines}>
                          <span className={styles.skeletonLineShort} />
                          <span className={styles.skeletonLineLong} />
                          <span className={styles.skeletonLineMed} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredMembers.length === 0 ? (
                  <div className={styles.emptyRoster} role="status">
                    <p className="hud-label">NO DIRECTORY MATCHES</p>
                    <p className={styles.emptyRosterText}>
                      {rawMembers.length === 0
                        ? `No member slots have been populated for ${activeDivision.fullName} yet.`
                        : 'No members match the active role filter or search query.'}
                    </p>
                    {rawMembers.length > 0 && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setRoleFilter('all');
                          setSearchQuery('');
                        }}
                      >
                        Reset Directory Filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <div
                    className={styles.memberGrid}
                    role="list"
                    aria-label={`${activeDivision.title} members`}
                  >
                    {filteredMembers.map((member, index) => {
                      const socialLinks = getMemberSocialLinks(member);
                      const designation = member.designation || member.role;

                      return (
                        <motion.div
                          key={member.id}
                          role="listitem"
                          className={styles.memberCard}
                          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.28,
                            delay: reducedMotion ? 0 : index * 0.045,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <MemberAvatar photoUrl={member.photoUrl} name={member.name} />

                          <div className={styles.memberInfo}>
                            <p className={styles.memberRole}>{designation}</p>
                            <p className={styles.memberName}>{member.name}</p>
                            <p className={styles.memberYear}>{member.year}</p>

                            <div className={styles.memberSocials}>
                              {socialLinks.length > 0 ? (
                                socialLinks.map((link) => (
                                  <a
                                    key={link.key}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    aria-label={`${member.name} — ${link.label}`}
                                  >
                                    {link.label}
                                  </a>
                                ))
                              ) : (
                                <span className={styles.socialPlaceholder}>
                                  Social Link TBA
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className={styles.modalFooter}>
              <span className={styles.modalNote}>
                Placeholder directory — update <code>src/data/team.js</code> with confirmed council data.
              </span>
              <Button onClick={() => setActiveDivision(null)}>Close Directory</Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
